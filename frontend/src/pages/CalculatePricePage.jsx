import React, { useState, useEffect } from "react";
import {
  Container,
  VStack,
  Text,
  Box,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  HStack,
  IconButton,
  Flex,
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Badge,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useProductStore } from "../store/product";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const CalculatePricePage = () => {
  const { products, fetchProducts, updateProductStock } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast({
        title: "No product selected",
        description: "Please select a product before adding it.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const product = products.find((prod) => prod._id === selectedProduct);
    if (!product) return;

    if (quantity > product.stock) {
      toast({
        title: "Insufficient stock",
        description: `Only ${product.stock} items are available.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const existingProduct = selectedProducts.find(
      (item) => item.productId === selectedProduct
    );

    if (existingProduct) {
      const updatedProducts = selectedProducts.map((item) =>
        item.productId === selectedProduct
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { productId: selectedProduct, quantity },
      ]);
    }

    setQuantity(1);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((item) => item.productId !== productId));
  };

  const handleIncrement = (productId) => {
    setSelectedProducts((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const product = products.find((prod) => prod._id === productId);
          if (product && item.quantity < product.stock) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      })
    );
  };

  const handleDecrement = (productId) => {
    setSelectedProducts((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  const totalPrice = selectedProducts.reduce((sum, item) => {
    const product = products.find((prod) => prod._id === item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  const handleSold = () => {
    selectedProducts.forEach((item) => {
      const product = products.find((prod) => prod._id === item.productId);
      if (product) {
        const newStock = product.stock - item.quantity;
        updateProductStock(item.productId, newStock);
      }
    });

    fetchProducts();

    toast({
      title: "Sale Successful",
      description: "The selected products have been sold.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setSelectedProducts([]);
    navigate("/calculate");
  };

  return (
    <Box bg={pageBg} minH="100vh">
      <Container maxW="container.md" py={{ base: 10, md: 14 }}>
        <VStack spacing={10}>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="extrabold"
            textAlign="center"
            bgGradient="linear(to-r, teal.400, blue.500, purple.600)"
            bgClip="text"
            letterSpacing="tight"
          >
            Product Price Calculator
          </Text>

          {/* Selection Card */}
          <Card
            w="100%"
            borderRadius="2xl"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderCol}
            boxShadow={useColorModeValue(
              "0 10px 30px rgba(0, 0, 0, 0.05)",
              "0 8px 24px rgba(0, 0, 0, 0.4)"
            )}
            _hover={{
              transform: "translateY(-3px)",
              boxShadow: useColorModeValue(
                "0 16px 40px rgba(0, 0, 0, 0.1)",
                "0 12px 36px rgba(0, 0, 0, 0.5)"
              ),
            }}
            transition="all 0.3s ease"
          >
            <CardHeader pb={0}>
              <Text fontSize="lg" fontWeight="semibold">
                Add Products
              </Text>
            </CardHeader>

            <CardBody>
              <VStack spacing={5}>
                <Input
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  focusBorderColor="blue.400"
                  size="lg"
                  borderRadius="xl"
                  bg={useColorModeValue("gray.50", "gray.700")}
                />

                <Select
                  placeholder="Select a Product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  focusBorderColor="blue.400"
                  size="lg"
                  borderRadius="xl"
                >
                  {filteredProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} — ₱{product.price} (Stock: {product.stock})
                    </option>
                  ))}
                </Select>

                <NumberInput
                  value={quantity}
                  onChange={(value) => setQuantity(parseInt(value) || 0)}
                  min={0}
                  size="lg"
                  focusBorderColor="blue.400"
                >
                  <NumberInputField borderRadius="xl" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <Button
                  w="full"
                  colorScheme="blue"
                  size="lg"
                  borderRadius="full"
                  onClick={handleAddProduct}
                >
                  Add Product
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <Card
              w="100%"
              borderRadius="2xl"
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderCol}
              boxShadow={useColorModeValue(
                "0 10px 30px rgba(0, 0, 0, 0.05)",
                "0 8px 24px rgba(0, 0, 0, 0.4)"
              )}
              transition="all 0.3s ease"
            >
              <CardHeader>
                <Text fontSize="lg" fontWeight="semibold">
                  Selected Products
                </Text>
              </CardHeader>

              <CardBody>
                <VStack spacing={4} align="stretch">
                  {selectedProducts.map((item) => {
                    const product = products.find((prod) => prod._id === item.productId);

                    return (
                      <Box
                        key={item.productId}
                        p={4}
                        borderWidth="1px"
                        borderColor={borderCol}
                        borderRadius="xl"
                        bg={useColorModeValue("gray.50", "gray.700")}
                        _hover={{
                          transform: "scale(1.01)",
                          boxShadow: "md",
                        }}
                        transition="0.2s"
                      >
                        <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                          <Box>
                            <Text fontWeight="medium" fontSize="md">
                              {product.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              ₱{product.price} × {item.quantity}
                            </Text>
                            <Badge mt={1} colorScheme="purple">
                              Subtotal: ₱{(product.price * item.quantity).toFixed(2)}
                            </Badge>
                          </Box>

                          <HStack>
                            <Button size="sm" onClick={() => handleDecrement(item.productId)}>
                              -
                            </Button>
                            <Button size="sm" onClick={() => handleIncrement(item.productId)}>
                              +
                            </Button>
                            <IconButton
                              icon={<FaTrash />}
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProduct(item.productId)}
                            />
                          </HStack>
                        </Flex>
                      </Box>
                    );
                  })}
                </VStack>
              </CardBody>

              <Divider />

              <CardFooter justify="space-between" flexWrap="wrap" gap={4}>
                <Text fontSize="xl" fontWeight="bold">
                  Total: ₱{totalPrice.toFixed(2)}
                </Text>
                <Button
                  colorScheme="green"
                  size="lg"
                  borderRadius="full"
                  onClick={handleSold}
                  disabled={selectedProducts.length === 0}
                >
                  Mark as Sold
                </Button>
              </CardFooter>
            </Card>
          )}
        </VStack>

        <Footer />
      </Container>
    </Box>
  );
};

export default CalculatePricePage;
