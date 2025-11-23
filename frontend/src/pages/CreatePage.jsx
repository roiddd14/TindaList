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
} from "@chakra-ui/react";

import { useState } from "react";
import { useProductStore } from "../store/product";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
		
        <Heading
          as="h1"
          size="2xl"
          textAlign="center"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
        >
          Create New Product
        </Heading>

        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={10}
          rounded="xl"
          shadow="lg"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <VStack spacing={6}>
            {formFields.map(({ label, name, placeholder, type, tooltip }) => (
              <FormControl key={name} isInvalid={errors[name]}>
                <FormLabel fontWeight="semibold">
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

            <Button
              w="full"
              size="lg"
              colorScheme="blue"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>

            <HStack w="full">
              <Link to="/" style={{ width: "100%" }}>
                <Button w="full" size="lg" variant="outline">
                  Cancel
                </Button>
              </Link>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
