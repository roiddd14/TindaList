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
    <Container maxW="100%" px={{ base: 4, md: 10 }} py={10}>
      <VStack spacing={10} align="stretch">
        {/* HEADER */}
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          bgGradient="linear(to-r, teal.400, blue.500, purple.600)"
          bgClip="text"
        >
          Product Lists
        </Text>

        {/* FILTER SECTION */}
        <Flex
          w="full"
          justify="center"
          flexWrap="wrap"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          {/* Search bar */}
          <Box
            position="relative"
            w={{ base: "100%", md: "50%", lg: "35%" }}
            minW={{ base: "100%", md: "300px" }}
          >
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
              focusBorderColor="blue.500"
              borderRadius="full"
              pl={10}
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

          {/* Category dropdown */}
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            size="lg"
            w={{ base: "100%", md: "40%", lg: "20%" }}
            borderRadius="full"
            focusBorderColor="blue.500"
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
            w={{ base: "100%", md: "40%", lg: "20%" }}
            borderRadius="full"
            focusBorderColor="blue.500"
          >
            <option value="default">Default</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
            <option value="low-stock">Low to High Stock</option>
            <option value="high-stock">High to Low Stock</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </Select>
        </Flex>

        {/* PRODUCT GRID */}
        {currentProducts.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={{ base: 5, md: 8 }}
            w="full"
          >
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" mt={6}>
            <Text fontSize="lg" fontWeight="medium" color="gray.500">
              No items found 😢
            </Text>
            <Link to="/create">
              <Text
                as="span"
                color="blue.500"
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
              >
                Create a new item
              </Text>
            </Link>
          </Box>
        )}

        {/* PAGINATION */}
        <Flex justify="center" mt={6} gap={2} flexWrap="wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <Box
              as="button"
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              px={4}
              py={2}
              borderRadius="full"
              bg={currentPage === index + 1 ? "blue.500" : "gray.200"}
              color={currentPage === index + 1 ? "white" : "black"}
              fontWeight="bold"
              fontSize={{ base: "sm", md: "md" }}
            >
              {index + 1}
            </Box>
          ))}
        </Flex>
      </VStack>
      <VStack spacing={8}>
              {/* page content here */}
            </VStack>
      
            <Footer />
    </Container>
  );
};

export default HomePage;
