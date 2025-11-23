import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  Tooltip,
  VStack,
  Badge,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useColorModeValue,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { EditIcon, DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useProductStore } from "../store/product";

const LOW_STOCK_THRESHOLD = 5;

const ProductCard = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [soldQuantity, setSoldQuantity] = useState(1);

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();

  // Modals
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const soldModal = useDisclosure();

  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const shadow = useColorModeValue("lg", "dark-lg");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Low-stock alert toast (runs once)
  useEffect(() => {
    if (updatedProduct.stock <= LOW_STOCK_THRESHOLD) {
      toast({
        title: "Low Stock Warning",
        description: `"${product.name}" has only ${updatedProduct.stock} left!`,
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
    }
  }, []);

  // --- ACTION HANDLERS ---
  const handleDelete = async () => {
    const { success, message } = await deleteProduct(product._id);

    toast({
      title: success ? "Deleted" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 2500,
      isClosable: true,
    });

    deleteModal.onClose();
  };

  const handleUpdate = async () => {
    const { success, message } = await updateProduct(product._id, updatedProduct);

    toast({
      title: success ? "Updated" : "Error",
      description: success ? "Product updated!" : message,
      status: success ? "success" : "error",
      duration: 2500,
      isClosable: true,
    });

    editModal.onClose();
  };

  const handleSold = async () => {
    const newStock = updatedProduct.stock - soldQuantity;

    if (newStock < 0) {
      toast({
        title: "Error",
        description: "Quantity exceeds available stock.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const { success } = await updateProduct(product._id, { ...updatedProduct, stock: newStock });

    if (success) {
      setUpdatedProduct((prev) => ({ ...prev, stock: newStock }));
      toast({
        title: "Sale Recorded",
        description: `${soldQuantity} item(s) sold.`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      soldModal.onClose();
    }
  };

  return (
    <Box
      bg={cardBg}
      shadow={shadow}
      rounded="xl"
      overflow="hidden"
      transition="0.25s"
      _hover={{
        transform: "scale(1.03)",
        shadow: "xl",
      }}
      display="flex"
      flexDirection="column"
    >
      {/* PRODUCT IMAGE */}
      <Box position="relative">
        <Image
          src={product.image}
          alt={product.name}
          w="full"
          h="220px"
          objectFit="cover"
        />

        {/* CATEGORY BADGE */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorScheme="grey"
          px={3}
          py={1}
          rounded="full"
          fontSize="0.7rem"
        >
          {product.category}
        </Badge>

        {/* LOW STOCK BADGE */}
        {updatedProduct.stock <= LOW_STOCK_THRESHOLD && (
          <Badge
            position="absolute"
            top={3}
            right={3}
            colorScheme="red"
            px={3}
            py={1}
            rounded="full"
            fontSize="0.7rem"
          >
            Low Stock
          </Badge>
        )}
      </Box>

      {/* PRODUCT INFO */}
      <VStack align="start" spacing={2} p={5} flex="1">
        <Heading
          size="md"
          noOfLines={2}
          color={textColor}
          fontWeight="bold"
        >
          {product.name}
        </Heading>

        <Text fontSize="xl" fontWeight="bold" color="blue.500">
          ₱{product.price}
        </Text>

        <HStack>
          <Text fontSize="sm" color={textColor}>
            <strong>Stock:</strong> {updatedProduct.stock}
          </Text>
          {updatedProduct.stock <= LOW_STOCK_THRESHOLD && (
            <WarningIcon color="red.400" />
          )}
        </HStack>
      </VStack>

      {/* ACTION BUTTONS */}
      <HStack p={4} justify="space-between">
        <Button colorScheme="green" size="sm" onClick={soldModal.onOpen}>
          Sold
        </Button>

        <HStack spacing={2}>
          <Tooltip label="Edit">
            <IconButton
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              onClick={editModal.onOpen}
            />
          </Tooltip>

          <Tooltip label="Delete">
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              onClick={deleteModal.onOpen}
            />
          </Tooltip>
        </HStack>
      </HStack>

      {/* --- SOLD MODAL --- */}
      <Modal isOpen={soldModal.isOpen} onClose={soldModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Sale</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text mb={2}>Current Stock: {updatedProduct.stock}</Text>
            <Input
              type="number"
              placeholder="Quantity sold"
              value={soldQuantity}
              min={1}
              onChange={(e) => setSoldQuantity(Number(e.target.value))}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleSold}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* --- EDIT MODAL --- */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4} w="100%">
              
              <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={updatedProduct.price}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={updatedProduct.image}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, image: e.target.value })
                  }
                  placeholder="Enter image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  value={updatedProduct.category}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, category: e.target.value })
                  }
                  placeholder="Enter category"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Stock</FormLabel>
                <Input
                  type="number"
                  value={updatedProduct.stock}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, stock: e.target.value })
                  }
                  placeholder="Enter stock amount"
                />
              </FormControl>

            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdate}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text color="red.400" fontWeight="bold">
              Are you sure you want to delete "{product.name}"?
              This action cannot be undone.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
