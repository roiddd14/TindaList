import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Flex, Spinner } from "@chakra-ui/react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking user authentication
  if (loading) {
    return (
      <Flex
        w="100vw"
        h="100vh"
        justify="center"
        align="center"
        bg="gray.50"
      >
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  // If not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise allow page access
  return children;
}
