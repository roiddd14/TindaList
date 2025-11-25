import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  useColorModeValue,
  useToast,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Tooltip,
  Fade,
  Divider,
} from "@chakra-ui/react";

import { useState } from "react";
import { useProductStore } from "../store/product";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";



const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    stock: "",
    category: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    price: false,
    image: false,
    stock: false,
    category: false,
  });

  const toast = useToast();
  const navigate = useNavigate();
  const { createProduct } = useProductStore();

  const validateInputs = () => {
    let valid = true;
    const newErr = {};

    Object.keys(newProduct).forEach((key) => {
      newErr[key] = !newProduct[key];
      if (!newProduct[key]) valid = false;
    });

    setErrors(newErr);
    return valid;
  };

  const handleAddProduct = async () => {
    if (!validateInputs()) {
      toast({
        title: "Missing Fields",
        description: "Please complete all product fields.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const { success, message } = await createProduct(newProduct);

    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Product Created",
        description: "Your product has been added successfully.",
        status: "success",
        isClosable: true,
      });

      navigate("/");
    }

    setNewProduct({ name: "", price: "", image: "", stock: "", category: "" });
  };

  const formFields = [
    {
      label: "Product Name",
      name: "name",
      placeholder: "Enter product name",
      type: "text",
      tooltip: "This will be shown as the product's title.",
    },
    {
      label: "Price",
      name: "price",
      placeholder: "Enter product price",
      type: "number",
      tooltip: "Set the product price in PHP.",
    },
    {
      label: "Image URL",
      name: "image",
      placeholder: "Paste an image URL",
      type: "text",
      tooltip: "Provide a valid image link.",
    },
    {
      label: "Stock",
      name: "stock",
      placeholder: "Enter stock quantity",
      type: "number",
      tooltip: "Total available items in stock.",
    },
    {
      label: "Category",
      name: "category",
      placeholder: "Enter category (ex: Shoes, Electronics)",
      type: "text",
      tooltip: "Categorize your product for easier filtering.",
    },
  ];

  const cardBg = useColorModeValue("white", "gray.900");
  const borderCol = useColorModeValue("gray.200", "gray.700");

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          bgGradient="linear(to-r, teal.400, blue.500, purple.600)"
          bgClip="text"
        >
          Create New Product
        </Heading>

        <Box
          w="100%"
          p={10}
          borderRadius="2xl"
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderCol}
          boxShadow="lg"
        >
          <VStack spacing={6}>
            
            {formFields.map(({ label, name, placeholder, type, tooltip }) => (
              <FormControl key={name} isInvalid={errors[name]}>
                <FormLabel fontWeight="medium">
                  {label}{" "}
                  <Tooltip label={tooltip} fontSize="sm">
                    <Text as="span" cursor="help" color="blue.400">
                      ⓘ
                    </Text>
                  </Tooltip>
                </FormLabel>

                <Input
                  type={type}
                  placeholder={placeholder}
                  value={newProduct[name]}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, [name]: e.target.value })
                  }
                  size="lg"
                  bg={cardBg}
                  borderRadius="md"
                  focusBorderColor={errors[name] ? "red.400" : "blue.400"}
                  borderColor={errors[name] ? "red.400" : undefined}
                />

                {errors[name] && (
                  <Fade in={errors[name]}>
                    <FormErrorMessage>{label} is required.</FormErrorMessage>
                  </Fade>
                )}
              </FormControl>
            ))}

            <Divider />

            <Button
              w="full"
              size="lg"
              colorScheme="blue"
              borderRadius="full"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>

            <HStack w="full">
              <Link style={{ width: "100%" }} to="/">
                <Button w="full" size="lg" variant="outline" borderRadius="full">
                  Cancel
                </Button>
              </Link>
            </HStack>

          </VStack>
        </Box>
      </VStack>
      <VStack spacing={8}>
                    {/* page content here */}
                  </VStack>
            
                  <Footer />
    </Container>
    
  );
};

export default CreatePage;
