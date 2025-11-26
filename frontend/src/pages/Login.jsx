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
  Divider,
  Flex,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const nav = useNavigate();

  const cardBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await auth.login(identifier, password);
      nav("/");
    } catch (error) {
      setErr(error.message || "Login failed");
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
      flexDir="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* App Title */}
      <Heading
        bgGradient="linear(to-r, blue.400, purple.500)"
        bgClip="text"
        fontSize={{ base: "5xl", md: "4xl" }}
        fontWeight="extrabold"
        mb={10}
        textAlign="center"
        letterSpacing="tight"
      >
        Tindalist
      </Heading>

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
        <VStack spacing={6} align="stretch">
          <VStack spacing={1}>
            <Heading
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color={useColorModeValue("gray.800", "gray.100")}
            >
              Welcome 👋
            </Heading>

            <Text
              fontSize="sm"
              color={useColorModeValue("gray.500", "gray.400")}
              textAlign="center"
              marginTop={1}
            >
              Login to continue using <strong>Tindalist</strong>
            </Text>
          </VStack>

          {err && (
            <Alert status="error" borderRadius="md" w="100%" fontSize="sm">
              <AlertIcon />
              {err}
            </Alert>
          )}

          <form onSubmit={submit} style={{ width: "100%" }}>
            <VStack spacing={5}>
              <FormControl>
                <FormLabel fontWeight="medium" fontSize="sm">
                  Email or Username
                </FormLabel>
                <Input
                  bg={inputBg}
                  size="lg"
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  borderRadius="xl"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
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
                borderRadius="xl"
                type="submit"
                isLoading={loading}
                fontWeight="semibold"
                letterSpacing="wide"
              >
                Login
              </Button>
            </VStack>
          </form>

          <Divider />

          <Flex justify="center">
            <Text fontSize="sm" color="gray.600">
              Don’t have an account?{" "}
              <Text
                as={Link}
                to="/register"
                color="blue.500"
                fontWeight="semibold"
                _hover={{ textDecoration: "underline" }}
              >
                Register here
              </Text>
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
}
