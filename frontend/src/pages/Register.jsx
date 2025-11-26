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
  Divider,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const nav = useNavigate();
  const auth = useAuth();

  const cardBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxW="md"
      py={20}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="100%"
        p={{ base: 8, md: 10 }}
        borderRadius="2xl"
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={useColorModeValue(
          "0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)",
          "0 8px 24px rgba(0, 0, 0, 0.4)"
        )}
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: useColorModeValue(
            "0 16px 40px rgba(0, 0, 0, 0.12), 0 6px 16px rgba(0, 0, 0, 0.06)",
            "0 12px 36px rgba(0, 0, 0, 0.5)"
          ),
        }}
      >
        <VStack spacing={6}>
          {/* Title */}
          <Heading
            as="h2"
            fontSize="2xl"
            textAlign="center"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Create Your Account
          </Heading>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Join <strong>Tindalist</strong> and get started in seconds
          </Text>

          {/* FORM */}
          <form onSubmit={submit} style={{ width: "100%" }}>
            <VStack spacing={5}>
              {/* Name */}
              <FormControl isInvalid={!name && err}>
                <FormLabel fontWeight="medium" fontSize="sm">
                  Name
                </FormLabel>
                <Input
                  bg={inputBg}
                  size="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  borderRadius="xl"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                />
                <FormErrorMessage>Name is required</FormErrorMessage>
              </FormControl>

              {/* Email */}
              <FormControl isInvalid={!email && err}>
                <FormLabel fontWeight="medium" fontSize="sm">
                  Email Address
                </FormLabel>
                <Input
                  type="email"
                  bg={inputBg}
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  borderRadius="xl"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
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
                borderRadius="xl"
                type="submit"
                isLoading={loading}
                fontWeight="semibold"
                letterSpacing="wide"
              >
                Register
              </Button>
            </VStack>
          </form>

          <Divider />

          {/* Already have an account */}
          <Text fontSize="sm" color="gray.600">
            Already have an account?{" "}
            <ChakraLink
              color="blue.500"
              fontWeight="semibold"
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
