import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, VStack, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', credentials);
      localStorage.setItem('token', response.data.token);
      toast({ title: 'Login successful', status: 'success', duration: 2000 });
      navigate('/list');
    } catch (error) {
      toast({ title: 'Login failed', status: 'error', duration: 2000 });
    }
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <VStack spacing={4}>
        <Heading>Login</Heading>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" onChange={handleInputChange} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" onChange={handleInputChange} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleSubmit}>Login</Button>
      </VStack>
    </Box>
  );
}

export default LoginPage;
