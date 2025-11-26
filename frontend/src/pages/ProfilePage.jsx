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
  Flex,
  Icon,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
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

  const cardBg = useColorModeValue("white", "gray.800");
  const sectionColor = useColorModeValue("gray.700", "gray.300");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const pageBg = useColorModeValue("gray.50", "gray.900");

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
        description: "Fill in both password fields.",
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
        description: "Your password has been changed successfully.",
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
    <Box bg={pageBg} minH="100vh">
      <Container maxW="container.sm" py={{ base: 10, md: 14 }}>
        <Box
          bg={cardBg}
          borderRadius="2xl"
          shadow={useColorModeValue(
            "0 10px 30px rgba(0,0,0,0.06)",
            "0 8px 24px rgba(0,0,0,0.5)"
          )}
          p={{ base: 6, md: 10 }}
          borderWidth="1px"
          borderColor={borderCol}
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-3px)",
            boxShadow: useColorModeValue(
              "0 16px 40px rgba(0, 0, 0, 0.1)",
              "0 12px 36px rgba(0, 0, 0, 0.6)"
            ),
          }}
        >
          {/* Header */}
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            textAlign="center"
            mb={8}
            bgGradient="linear(to-r, teal.400, blue.500, purple.500)"
            bgClip="text"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            My Profile
          </Heading>

          <VStack spacing={10} align="stretch">
            {/* Account Section */}
            <Box>
              <Flex align="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold" color={sectionColor}>
                  Account Information
                </Text>
                <Icon as={InfoIcon} ml={2} color="blue.400" />
              </Flex>

              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="medium">Email Address</FormLabel>
                  <Input
                    value={email}
                    isReadOnly
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="xl"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium">Full Name</FormLabel>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    borderRadius="xl"
                    bg={useColorModeValue("gray.50", "gray.700")}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                    }}
                  />
                </FormControl>

                <Button
                  colorScheme="blue"
                  w="full"
                  size="lg"
                  borderRadius="full"
                  isLoading={loading}
                  onClick={handleSaveProfile}
                  fontWeight="semibold"
                  letterSpacing="wide"
                >
                  Save Changes
                </Button>
              </VStack>
            </Box>

            <Divider />

            {/* Password Section */}
            <Box>
              <Flex align="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold" color={sectionColor}>
                  Change Password
                </Text>
                <Icon as={InfoIcon} ml={2} color="red.400" />
              </Flex>

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
                  borderRadius="full"
                  isLoading={loading}
                  onClick={handleChangePassword}
                  fontWeight="semibold"
                >
                  Update Password
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <Footer mt={10} />
      </Container>
    </Box>
  );
};

export default ProfilePage;
