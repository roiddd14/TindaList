import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const toast = useToast();
  const nav = useNavigate();
  const auth = useAuth();

  const cardBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await auth.register(name, email, password);

      toast({
        title: "Account created!",
        description: "You have successfully registered.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      nav("/login");
    } catch (error) {
      setErr(error.message);
      toast({
        title: "Registration failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      maxW="md"
      py={14}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="100%"
        p={10}
        borderRadius="2xl"
        boxShadow="lg"
        borderWidth="1px"
        bg={cardBg}
      >
        <VStack spacing={6}>
          {/* Title */}
          <Heading
            as="h2"
            fontSize="2.5xl"
            textAlign="center"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Create Your Account
          </Heading>

          <Text fontSize="md" color="gray.500" textAlign="center">
            Join <strong>Tindalist</strong> and get started in seconds
          </Text>

          {/* FORM */}
          <form onSubmit={submit} style={{ width: "100%" }}>
            <VStack spacing={5}>
              {/* Name */}
              <FormControl isInvalid={!name && err}>
                <FormLabel fontWeight="medium">Name</FormLabel>
                <Input
                  bg={inputBg}
                  size="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
                <FormErrorMessage>Name is required</FormErrorMessage>
              </FormControl>

              {/* Email */}
              <FormControl isInvalid={!email && err}>
                <FormLabel fontWeight="medium">Email Address</FormLabel>
                <Input
                  type="email"
                  bg={inputBg}
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <FormErrorMessage>Email is required</FormErrorMessage>
              </FormControl>

              {/* Password */}
              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="Create a password"
                showStrength={true}
              />

              {/* Error */}
              {err && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {err}
                </Text>
              )}

              {/* Submit Button */}
              <Button
                w="full"
                size="lg"
                colorScheme="blue"
                borderRadius="full"
                type="submit"
              >
                Register
              </Button>
            </VStack>
          </form>

          {/* Already have account? */}
          <Text fontSize="sm" color="gray.600">
            Already have an account?{" "}
            <ChakraLink
              color="blue.500"
              fontWeight="bold"
              as={Link}
              to="/login"
              _hover={{ textDecoration: "underline" }}
            >
              Login here
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}
