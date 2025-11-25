import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useAuth } from "../auth/AuthContext";
import PasswordInput from "../components/PasswordInput";
import Footer from "../components/Footer";


const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.900");
  const sectionColor = useColorModeValue("gray.700", "gray.300");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Save Profile
  const handleSaveProfile = async () => {
    setLoading(true);

    try {
      await updateProfile({ name, email });

      toast({
        title: "Profile updated",
        description: "Your profile info has been saved.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err.message,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Missing fields",
        description: "Fill in both fields.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);

      toast({
        title: "Password updated",
        description: "Your password has been changed.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast({
        title: "Password change failed",
        description: err.message,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        bg={cardBg}
        rounded="xl"
        shadow="lg"
        p={10}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Heading
          size="lg"
          textAlign="center"
          mb={6}
          bgGradient="linear(to-r, teal.400, blue.500)"
          bgClip="text"
        >
          My Profile
        </Heading>

        <VStack spacing={8} align="stretch">
          {/* Account Section */}
          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              mb={4}
              color={sectionColor}
            >
              Account Information
            </Text>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input
                  value={email}
                  isReadOnly
                  bg={useColorModeValue("gray.50", "gray.800")}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <Button
                colorScheme="blue"
                w="full"
                size="lg"
                isLoading={loading}
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </VStack>
          </Box>

          <Divider />

          {/* Password Section */}
          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              mb={4}
              color={sectionColor}
            >
              Change Password
            </Text>

            <VStack spacing={4} align="stretch">
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />

              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                showStrength={true}
              />

              <Button
                colorScheme="red"
                w="full"
                size="lg"
                isLoading={loading}
                onClick={handleChangePassword}
              >
                Update Password
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
      <VStack spacing={8}>
                    {/* page content here */}
                  </VStack>
            
                  <Footer />
    </Container>
  );
};

export default ProfilePage;
