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
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../store/product";
import { Link, useNavigate } from "react-router-dom";
import { InfoIcon } from "@chakra-ui/icons";
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

  const cardBg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={pageBg} minH="100vh">
      <Container maxW="container.md" py={{ base: 10, md: 14 }}>
        <VStack spacing={10}>
          {/* Page Header */}
          <VStack spacing={2}>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="extrabold"
              textAlign="center"
              bgGradient="linear(to-r, teal.400, blue.500, purple.600)"
              bgClip="text"
              letterSpacing="tight"
            >
              Create New Product
            </Heading>
            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} textAlign="center">
              Fill out the details below to add your new product to inventory
            </Text>
          </VStack>

          {/* Form Container */}
          <Box
            w="100%"
            p={{ base: 6, md: 10 }}
            borderRadius="2xl"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderCol}
            boxShadow={useColorModeValue(
              "0 10px 30px rgba(0, 0, 0, 0.05)",
              "0 8px 24px rgba(0, 0, 0, 0.4)"
            )}
            transition="all 0.3s ease"
            _hover={{
              transform: "translateY(-3px)",
              boxShadow: useColorModeValue(
                "0 16px 40px rgba(0, 0, 0, 0.1)",
                "0 12px 36px rgba(0, 0, 0, 0.5)"
              ),
            }}
          >
            <VStack spacing={6} align="stretch">
              {formFields.map(({ label, name, placeholder, type, tooltip }) => (
                <FormControl key={name} isInvalid={errors[name]}>
                  <FormLabel fontWeight="medium" display="flex" alignItems="center">
                    {label}
                    <Tooltip label={tooltip} fontSize="sm" hasArrow>
                      <Box as="span" ml={2} color="blue.400" cursor="help">
                        <Icon as={InfoIcon} w={4} h={4} />
                      </Box>
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
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="xl"
                    borderColor={errors[name] ? "red.400" : borderCol}
                    _focus={{
                      borderColor: errors[name] ? "red.400" : "blue.400",
                      boxShadow: `0 0 0 1px ${
                        errors[name]
                          ? "var(--chakra-colors-red-400)"
                          : "var(--chakra-colors-blue-400)"
                      }`,
                    }}
                  />

                  {errors[name] && (
                    <Fade in={errors[name]}>
                      <FormErrorMessage>{label} is required.</FormErrorMessage>
                    </Fade>
                  )}
                </FormControl>
              ))}

              <Divider />

              {/* Action Buttons */}
              <Flex
                direction={{ base: "column", sm: "row" }}
                gap={3}
                w="full"
                justify="space-between"
              >
                <Button
                  w="full"
                  size="lg"
                  colorScheme="blue"
                  borderRadius="full"
                  onClick={handleAddProduct}
                  fontWeight="semibold"
                  letterSpacing="wide"
                >
                  Add Product
                </Button>

                <Link style={{ width: "100%" }} to="/">
                  <Button
                    w="full"
                    size="lg"
                    variant="outline"
                    borderRadius="full"
                    fontWeight="medium"
                    _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                  >
                    Cancel
                  </Button>
                </Link>
              </Flex>
            </VStack>
          </Box>
        </VStack>

        <Footer />
      </Container>
    </Box>
  );
};

export default CreatePage;
