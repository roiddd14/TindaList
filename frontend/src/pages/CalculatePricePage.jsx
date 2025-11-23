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
  GridItem,
  HStack,
  IconButton,
  Divider,
  Flex,
  Button,
  Input,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useProductStore } from "../store/product";
import { useNavigate } from "react-router-dom";

const CalculatePricePage = () => {
  const { products, fetchProducts, updateProductStock } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

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

    setQuantity(1); // Reset quantity after adding
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
    navigate("/");
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Text
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          textAlign="center"
          bgGradient="linear(to-r, teal.400, blue.500, purple.600)"
          bgClip="text"
        >
          Product Price Calculator
        </Text>

        {/* Search and Product Selection */}
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
          <Box>
            <Text fontWeight="medium" mb={2}>
              Search Product
            </Text>
            <Input
              placeholder="Search for a product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              focusBorderColor="blue.500"
              size="lg"
            />
          </Box>
          <Box>
            <Text fontWeight="medium" mb={2}>
              Select a Product
            </Text>
            <Select
              placeholder="Select a Product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              focusBorderColor="blue.500"
              size="lg"
            >
              {filteredProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - ₱{product.price} (Stock: {product.stock})
                </option>
              ))}
            </Select>
          </Box>
        </Grid>

        {/* Quantity and Add Button */}
        <Grid templateColumns={{ base: "1fr", md: "1fr auto" }} gap={6} alignItems="end">
          <Box>
            <Text fontWeight="medium" mb={2}>
              Quantity
            </Text>
            <NumberInput
              value={quantity}
              onChange={(valueString) => setQuantity(parseInt(valueString) || 1)}
              min={1}
              focusBorderColor="blue.500"
              size="lg"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleAddProduct}
            w="full"
          >
            Add Product
          </Button>
        </Grid>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <Box>
            <Text fontWeight="medium" mb={4}>
              Selected Products
            </Text>
            <Divider mb={4} />
            {selectedProducts.map((item) => {
              const product = products.find((prod) => prod._id === item.productId);
              return (
                <Flex key={item.productId} justify="space-between" align="center" mb={3}>
                  <Text>
                    {product.name} x{item.quantity} - ₱{(product.price * item.quantity).toFixed(2)}
                  </Text>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      onClick={() => handleDecrement(item.productId)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleIncrement(item.productId)}
                      disabled={item.quantity >= product.stock}
                    >
                      +
                    </Button>
                    <IconButton
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveProduct(item.productId)}
                      aria-label="Remove product"
                    />
                  </HStack>
                </Flex>
              );
            })}
            <Divider mt={4} />
          </Box>
        )}

        {/* Total Price and Actions */}
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Total Price: ₱{totalPrice.toFixed(2)}
          </Text>
          <Button
            colorScheme="green"
            size="lg"
            onClick={handleSold}
            disabled={selectedProducts.length === 0}
          >
            Mark as Sold
          </Button>
        </Flex>
      </VStack>   
    </Container>
  );
};

export default CalculatePricePage;
