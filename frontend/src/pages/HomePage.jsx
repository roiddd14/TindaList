import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  Input,
  Box,
  Flex,
  Icon,
  Select,
  useColorModeValue,
  Badge,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";
import { SearchIcon } from "@chakra-ui/icons";
import { useAuth } from "../auth/AuthContext";
import Footer from "../components/Footer";

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  const { user, loading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  const itemsPerPage = 8;

  const headerGradient = useColorModeValue(
    "linear(to-r, teal.400, blue.500, purple.600)",
    "linear(to-r, teal.300, blue.400, purple.500)"
  );

  const filterBg = useColorModeValue("white", "gray.800");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    window.fetchProductsGlobal = fetchProducts;
  }, [fetchProducts]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!loading && token) {
      fetchProducts();
    }
  }, [loading, user, fetchProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "a-z":
        return a.name.localeCompare(b.name);
      case "z-a":
        return b.name.localeCompare(a.name);
      case "low-stock":
        return a.stock - b.stock;
      case "high-stock":
        return b.stock - a.stock;
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  return (
    <Box bg={pageBg} minH="100vh">
      <Container maxW="7xl" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }}>
        <VStack spacing={10} align="stretch">
          {/* HEADER */}
          <VStack spacing={2} textAlign="center">
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="extrabold"
              bgGradient={headerGradient}
              bgClip="text"
              letterSpacing="tight"
            >
              Product Inventory
            </Text>
            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
              Browse and manage your store items efficiently
            </Text>
          </VStack>

          {/* FILTER CARD */}
          <Box
            bg={filterBg}
            p={{ base: 5, md: 7 }}
            borderRadius="2xl"
            boxShadow={useColorModeValue(
              "0 10px 30px rgba(0, 0, 0, 0.05)",
              "0 8px 20px rgba(0, 0, 0, 0.4)"
            )}
            borderWidth="1px"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: useColorModeValue(
                "0 16px 40px rgba(0, 0, 0, 0.08)",
                "0 12px 30px rgba(0, 0, 0, 0.5)"
              ),
              transform: "translateY(-2px)",
            }}
          >
            <Flex
              w="full"
              justify="space-between"
              flexWrap="wrap"
              gap={4}
              direction={{ base: "column", md: "row" }}
              align="center"
            >
              {/* Search */}
              <Box position="relative" w={{ base: "100%", md: "40%" }}>
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="lg"
                  borderRadius="full"
                  pl={10}
                  bg={useColorModeValue("gray.50", "gray.700")}
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                />
                <Icon
                  as={SearchIcon}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                />
              </Box>

              {/* Category */}
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                size="lg"
                borderRadius="full"
                w={{ base: "100%", md: "25%" }}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>

              {/* Sort */}
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                size="lg"
                borderRadius="full"
                w={{ base: "100%", md: "25%" }}
              >
                <option value="default">Default Sorting</option>
                <option value="a-z">Name (A-Z)</option>
                <option value="z-a">Name (Z-A)</option>
                <option value="low-stock">Low Stock</option>
                <option value="high-stock">High Stock</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </Select>
            </Flex>
          </Box>

          {/* PRODUCTS */}
          {currentProducts.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={{ base: 6, md: 8 }}
            >
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          ) : (
            <Box
              textAlign="center"
              p={{ base: 8, md: 10 }}
              borderRadius="2xl"
              bg={useColorModeValue("white", "gray.800")}
              boxShadow="md"
            >
              <Text fontSize="lg" fontWeight="semibold">
                No products found
              </Text>
              <Text color="gray.500" mt={2}>
                Start building your inventory
              </Text>
              <Link to="/create">
                <Badge
                  mt={4}
                  px={5}
                  py={2}
                  borderRadius="full"
                  colorScheme="blue"
                  cursor="pointer"
                  _hover={{ transform: "scale(1.05)", boxShadow: "md" }}
                >
                  + Add New Product
                </Badge>
              </Link>
            </Box>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <>
              <Divider />
              <Flex justify="center" gap={3} flexWrap="wrap" mt={4}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Box
                    as="button"
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg={
                      currentPage === index + 1
                        ? "blue.500"
                        : useColorModeValue("gray.200", "gray.700")
                    }
                    color={currentPage === index + 1 ? "white" : "inherit"}
                    fontWeight="bold"
                    transition="0.2s"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "md",
                    }}
                  >
                    {index + 1}
                  </Box>
                ))}
              </Flex>
            </>
          )}
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default HomePage;
