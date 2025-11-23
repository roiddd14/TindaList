import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const auth = useAuth();
  const nav = useNavigate();

  const cardBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await auth.login(identifier, password); 
      nav("/");
    } catch (error) {
      setErr(error.message || "Login failed");
    }
  };

  return (
    <Container
      maxW="md"
      py={20}
      minH="100vh"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* Tindalist Title */}
      <Heading
        bgGradient="linear(to-r, blue.400, purple.500)"
        bgClip="text"
        fontSize="4xl"
        fontWeight="extrabold"
        mb={8}
        textAlign="center"
        letterSpacing="wide"
      >
        Tindalist
      </Heading>

      <Box
        w="100%"
        p={10}
        borderRadius="2xl"
        boxShadow="lg"
        bg={cardBg}
        borderWidth="1px"
      >
        <VStack spacing={6}>
          {/* Title */}
          <Heading
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="extrabold"
            textAlign="center"
          >
            Welcome Back 👋
          </Heading>

          <Text fontSize="md" color="gray.500" textAlign="center">
            Login to continue using <strong>Tindalist</strong>
          </Text>

          {/* Errors */}
          {err && (
            <Alert status="error" borderRadius="md" w="100%">
              <AlertIcon />
              {err}
            </Alert>
          )}

          {/* FORM */}
          <form onSubmit={submit} style={{ width: "100%" }}>
            <VStack spacing={5}>
              <FormControl>
                <FormLabel fontWeight="medium">Email or Username</FormLabel>
                <Input
                  bg={inputBg}
                  size="lg"
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter your password"
                />
              </FormControl>

              <Button
                w="100%"
                colorScheme="blue"
                size="lg"
                borderRadius="full"
                type="submit"
              >
                Login
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" color="gray.600">
            Don’t have an account?{" "}
            <Text
              as={Link}
              to="/register"
              color="blue.500"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
            >
              Register here
            </Text>
          </Text>
        </VStack>
      </Box>
    </Container>
  );

}
