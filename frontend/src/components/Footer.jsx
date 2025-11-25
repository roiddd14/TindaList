import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const Footer = () => {
  const footerColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box textAlign="center" py={6} mt={10}>
      <Text fontSize="sm" color={footerColor}>
        © {new Date().getFullYear()} Tindalist. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
