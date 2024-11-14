import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Heading, Text, VStack, Image, Flex } from '@chakra-ui/react';

const HomePage = () => {
  const navigate = useNavigate();

  // Navigation function for Login and Register
  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <Box
      position="relative"
      height="100vh"
      width="100%"
      overflow="hidden"
    >
      {/* Fullscreen Background Image */}
      <Image
        src="https://jlr.scene7.com/is/image/jlr/L46125GL_303103154_001_ALT" // Replace with your car image URL
        alt="Car"
        objectFit="cover"
        width="100%"
        height="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
      />

      {/* Main content - Centered */}
      <Flex
        direction="column"
        justify="center"
        align="center"
        height="100%"
        textAlign="center"
        color="white"
        padding="20px"
        zIndex="1"
      >
        {/* Slogan */}
        <Heading size="2xl" mb={6} fontFamily="Arial, sans-serif" fontWeight="bold">
          Drive Your Future with Us
        </Heading>

        {/* Car Image (Circular) */}
        <Box borderRadius="full" overflow="hidden" mb={8} boxSize="150px">
          <Image
            src="data:image/jpeg;base64,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" // Replace with your car image URL
            alt="Car"
            objectFit="cover"
            boxSize="100%"
          />
        </Box>

        {/* Buttons for Login and Register */}
        <VStack spacing={4} color="white">
          <Button
            colorScheme="teal"
            size="lg"
            onClick={goToLogin}
            width="250px"
            _hover={{ bg: "teal.600" }}
          >
            Login
          </Button>

          <Text fontSize="lg" color="white">or</Text>

          <Button
            colorScheme="teal"
            size="lg"
            onClick={goToRegister}
            width="250px"
            _hover={{ bg: "teal.600" }}
          >
            Register
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

export default HomePage;
