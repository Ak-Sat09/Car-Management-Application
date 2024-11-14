import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Heading, 
  VStack, 
  useToast 
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // Initialize navigate

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: 'All fields are required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Show success message
      toast({
        title: 'Registration Successful!',
        description: `Welcome, ${formData.name}! Redirecting to login...`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login'); // Navigate to login page
      }, 3000); // Adjust the timeout as needed
    } catch (error) {
      // Handle error from the server
      const errorMessage =
        error.response?.data?.message || 'An error occurred during registration.';
      toast({
        title: 'Registration Failed!',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      maxW="md" 
      mx="auto" 
      mt="8" 
      p="8" 
      borderWidth="1px" 
      borderRadius="lg" 
      boxShadow="lg"
    >
      <Heading as="h2" size="xl" textAlign="center" mb="6">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="teal" 
            width="full" 
            isLoading={loading}
          >
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterPage;
