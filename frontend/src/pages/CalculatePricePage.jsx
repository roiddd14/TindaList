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
  Grid,
  HStack,
  IconButton,
  Divider,
  Flex,
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Badge,
  useColorModeValue,
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

  // Color modes for UI consistency
  const cardBg = useColorModeValue("white", "gray.900");
  const borderCol = useColorModeValue("gray.200", "gray.700");

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
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          bgGradient="linear(to-r, teal.400, blue.500, purple.600)"
          bgClip="text"
        >
          Product Price Calculator
        </Text>

        {/* Selection Card */}
        <Card
          w="100%"
          shadow="lg"
          borderRadius="lg"
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderCol}
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
                focusBorderColor="blue.500"
                size="lg"
              />

              <Select
                placeholder="Select a Product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                focusBorderColor="blue.500"
                size="lg"
              >
                {filteredProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} — ₱{product.price} (Stock: {product.stock})
                  </option>
                ))}
              </Select>

              <NumberInput
                value={quantity}
                onChange={(value) => setQuantity(parseInt(value) || 1)}
                min={1}
                size="lg"
                focusBorderColor="blue.500"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Button
                w="full"
                colorScheme="teal"
                size="lg"
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
            shadow="lg"
            borderRadius="lg"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderCol}
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
                      borderRadius="lg"
                      shadow="sm"
                      bg={cardBg}
                    >
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text fontWeight="medium">{product.name}</Text>
                          <Text fontSize="sm" color="gray.600">
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

            <CardFooter justify="space-between">
              <Text fontSize="xl" fontWeight="bold">
                Total: ₱{totalPrice.toFixed(2)}
              </Text>
              <Button
                colorScheme="green"
                size="lg"
                onClick={handleSold}
                disabled={selectedProducts.length === 0}
              >
                Mark as Sold
              </Button>
            </CardFooter>
          </Card>
        )}
      </VStack>
      <VStack spacing={8}>
        {/* page content here */}
      </VStack>

      <Footer />
    </Container>

    
  );
};

export default CalculatePricePage;
