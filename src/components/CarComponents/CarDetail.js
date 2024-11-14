import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Button, Image, Spinner, Flex, Heading, Stack } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  useEffect(() => {
    
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/v1/car/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCar(response.data.car);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch car details. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCarDetails();
  }, [id]);  
  const handleEdit = () => {
    navigate(`/update/${id}`);   
  };
 
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/v1/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/list');  
    } catch (err) {
      setError('Failed to delete car. Please try again later.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={8}>
        <Text color="red.500" fontSize="xl" fontWeight="bold">{error}</Text>
      </Box>
    );
  }

  if (!car) {
    return (
      <Box textAlign="center" mt={8}>
        <Text fontSize="xl" fontWeight="semibold">No car found with the provided ID.</Text>
      </Box>
    );
  }

  return (
    <Box 
      p={8} 
      borderWidth={1} 
      borderRadius="lg" 
      boxShadow="lg" 
      maxWidth="800px" 
      margin="auto" 
      bg="gray.50"
    >
      <Heading as="h1" size="2xl" fontWeight="bold" mb={6} color="teal.600">
        {car.name}
      </Heading>

      <Stack spacing={4} mb={6}>
        <Text fontSize="lg" fontWeight="medium" color="gray.600">
          <strong>Brand:</strong> {car.brand}
        </Text>
        <Text fontSize="lg" fontWeight="medium" color="gray.600">
          <strong>Year:</strong> {car.year}
        </Text>
        <Text fontSize="lg" fontWeight="medium" color="gray.600">
          <strong>Price:</strong> ${car.price.toLocaleString()}
        </Text>
        <Text fontSize="md" color="gray.700">
          <strong>Description:</strong> {car.description}
        </Text>
      </Stack>

      <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
        <strong>Images:</strong>
      </Text>
      <Flex wrap="wrap" justify="space-between" mb={6}>
        {car.images.map((image, index) => (
          <Box 
            key={index} 
            mb={4} 
            width="120px" 
            height="120px" 
            overflow="hidden" 
            borderRadius="md" 
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.05)' }}
          >
            <Image src={image} alt={`car-image-${index}`} objectFit="cover" width="100%" height="100%" />
          </Box>
        ))}
      </Flex>

      <Flex justify="space-between" mb={6}>
        <Button colorScheme="teal" onClick={handleEdit} size="lg" _hover={{ bg: "teal.700" }}>
          Edit Car
        </Button>
        <Button colorScheme="red" onClick={handleDelete} size="lg" _hover={{ bg: "red.700" }}>
          Delete Car
        </Button>
      </Flex>

      <Button 
        colorScheme="teal" 
        size="lg" 
        width="full" 
        mt={4} 
        onClick={() => navigate('/list')} 
        _hover={{ bg: "teal.700" }}
      >
        Back to Car List
      </Button>
    </Box>
  );
};

export default CarDetail;
