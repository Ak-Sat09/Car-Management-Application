import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Text,
  Button,
  Image,
  Flex,
  IconButton,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // Fetch all cars data from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/usercars', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCars(response.data.cars);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cars. Please try again later.');
        setLoading(false);
        console.error('Error fetching cars:', err);
      }
    };

    fetchCars();
  }, []);

  // Handle viewing car details
  const handleViewDetails = (carId) => {
    navigate(`/car/${carId}`);
  };

  // Function to handle image navigation for each car
  const handleImageChange = (carId, direction) => {
    setCurrentImageIndex((prevIndex) => ({
      ...prevIndex,
      [carId]:
        direction === 'prev'
          ? (prevIndex[carId] - 1 + (cars.find((car) => car._id === carId)?.images.length || 0)) %
            (cars.find((car) => car._id === carId)?.images.length || 1)
          : (prevIndex[carId] + 1) %
            (cars.find((car) => car._id === carId)?.images.length || 1),
    }));
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minHeight="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box p={4} bg="gray.50" minHeight="100vh">
      {error && (
        <Text color="red.500" fontSize="xl" fontWeight="semibold" mb={4}>
          {error}
        </Text>
      )}
      <Text fontSize="4xl" fontWeight="bold" textAlign="center" mb={8} color="teal.600">
        Car Collection
      </Text>

      {/* Grid layout for car cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {cars.length > 0 ? (
          cars.map((car) => (
            <Box
              key={car._id}
              borderWidth={1}
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              bg="white"
              transition="all 0.3s ease"
              _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
            >
              <Flex direction="column" align="flex-start">
                {/* Image */}
                <Box mb={6} borderRadius="md" overflow="hidden">
                  <Text fontSize="lg" fontWeight="semibold" mb={2} color="teal.500">
                    Images
                  </Text>
                  <Flex align="center" justify="center" position="relative">
                    {car.images.length > 1 && (
                      <IconButton
                        icon={<ChevronLeftIcon />}
                        aria-label="Previous Image"
                        onClick={() => handleImageChange(car._id, 'prev')}
                        variant="outline"
                        size="lg"
                        position="absolute"
                        left={4}
                        zIndex={2}
                        colorScheme="teal"
                      />
                    )}
                    <Image
                      src={car.images[currentImageIndex[car._id] || 0]} // Use current image index
                      alt={`car-image`}
                      boxSize="100%" // Full width for the image
                      maxHeight="400px"
                      objectFit="cover"
                      borderRadius="md"
                      boxShadow="lg"
                      transition="all 0.3s ease"
                    />
                    {car.images.length > 1 && (
                      <IconButton
                        icon={<ChevronRightIcon />}
                        aria-label="Next Image"
                        onClick={() => handleImageChange(car._id, 'next')}
                        variant="outline"
                        size="lg"
                        position="absolute"
                        right={4}
                        zIndex={2}
                        colorScheme="teal"
                      />
                    )}
                  </Flex>
                </Box>

                {/* Car Details */}
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
                    {car.name}
                  </Text>
                  <Text fontSize="xl" color="gray.600" mb={2}>
                    <strong>Brand:</strong> {car.brand}
                  </Text>
                  <Text fontSize="xl" color="green.500" mb={2}>
                    <strong>Price:</strong> ${car.price}
                  </Text>
                  <Text fontSize="lg" color="gray.700" mb={2}>
                    <strong>Year:</strong> {car.year}
                  </Text>
                  <Text fontSize="md" color="gray.600" mb={4}>
                    <strong>Description:</strong> {car.description}
                  </Text>

                  {/* Button to view more details of a car */}
                  <Button
                    colorScheme="teal"
                    onClick={() => handleViewDetails(car._id)}
                    variant="solid"
                    size="lg"
                    width="full"
                    _hover={{ bg: 'teal.700' }}
                  >
                    View Details
                  </Button>
                </Box>
              </Flex>
            </Box>
          ))
        ) : (
          <Text textAlign="center" fontSize="xl" color="gray.600">
            No cars available.
          </Text>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default CarList;
