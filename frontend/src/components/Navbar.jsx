import React, { useState } from "react";
import {
  Box,
  VStack,
  IconButton,
  Tooltip,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  AiOutlineHome,
  AiOutlinePlusSquare,
  AiOutlineCalculator,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUser,
} from "react-icons/ai";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";


import { useAuth } from "../auth/AuthContext";

const Sidebar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showSidebar, setShowSidebar] = useState(false); // <-- TOGGLE STATE

  // Hide sidebar completely on auth pages
  const hideRoutes = ["/login", "/register"];
  if (hideRoutes.includes(location.pathname)) return null;

  const confirmLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* FLOATING TOGGLE BUTTON */}
      {!showSidebar && (
        <IconButton
          icon={<AiOutlineMenu size={24} />}
          aria-label="Open Sidebar"
          position="fixed"
          top="20px"
          left="20px"
          zIndex={100}
          borderRadius="full"
          colorScheme="blue"
          onClick={() => setShowSidebar(true)}
        />
      )}

      {/* SIDEBAR */}
      <Box
        position="fixed"
        left={showSidebar ? "0" : "-80px"} // slide in/out
        top="0"
        h="100vh"
        w="70px"
        bg={colorMode === "light" ? "gray.100" : "gray.900"}
        p={4}
        boxShadow="xl"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        transition="left 0.3s ease"
        zIndex="200"
      >
        {/* CLOSE BUTTON */}
        <IconButton
          icon={<AiOutlineClose size={20} />}
          aria-label="Close Sidebar"
          variant="ghost"
          mb={4}
          onClick={() => setShowSidebar(false)}
        />

        <VStack spacing={6}>
          <Tooltip label="Home" placement="right" hasArrow>
            <IconButton
              as={Link}
              to="/"
              aria-label="Home"
              icon={<AiOutlineHome size={22} />}
              variant="ghost"
              _hover={{ bg: "gray.700" }}
            />
          </Tooltip>

          {user && (
            <>
              <Tooltip label="Add Item" placement="right" hasArrow>
                <IconButton
                  as={Link}
                  to="/create"
                  aria-label="Add Item"
                  icon={<AiOutlinePlusSquare size={22} />}
                  variant="ghost"
                  _hover={{ bg: "gray.700" }}
                />
              </Tooltip>

              <Tooltip label="Calculate Price" placement="right" hasArrow>
                <IconButton
                  as={Link}
                  to="/calculate"
                  aria-label="Calculate"
                  icon={<AiOutlineCalculator size={22} />}
                  variant="ghost"
                  _hover={{ bg: "gray.700" }}
                />
              </Tooltip>

              <Tooltip label="Profile" placement="right" hasArrow>
                <IconButton
                  as={Link}
                  to="/profile"
                  aria-label="Profile"
                  icon={<AiOutlineUser size={22} />}
                  variant="ghost"
                  _hover={{ bg: "gray.700" }}
                />
              </Tooltip>


              <Tooltip label="Logout" placement="right" hasArrow>
                <IconButton
                  aria-label="Logout"
                  icon={<AiOutlineLogout size={22} />}
                  variant="ghost"
                  onClick={onOpen}
                  color="red.300"
                  _hover={{ bg: "red.500", color: "white" }}
                />
              </Tooltip>
            </>
          )}
        </VStack>

        {/* THEME TOGGLE */}
        <Tooltip label="Toggle Theme" placement="right" hasArrow>
          <IconButton
            aria-label="Toggle Theme"
            icon={colorMode === "light" ? <IoMoon size={20} /> : <LuSun size={20} />}
            variant="ghost"
            onClick={toggleColorMode}
            _hover={{ bg: "gray.700" }}
          />
        </Tooltip>
      </Box>

      {/* LOGOUT MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text>Are you sure you want to logout?</Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>

            <Button colorScheme="red" onClick={confirmLogout}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;
