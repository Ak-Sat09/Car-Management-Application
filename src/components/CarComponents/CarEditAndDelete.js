import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, FormControl, FormLabel, Input, Textarea, Button, Image, Spinner, Flex, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCar = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();  

  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
 
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

        const carData = response.data.car;
        setCar(carData);
        setName(carData.name);
        setBrand(carData.brand);
        setPrice(carData.price);
        setYear(carData.year);
        setDescription(carData.description);
        setImages(carData.images);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch car details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleImageUrlChange = (e, index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = e.target.value;
    setImageUrls(updatedUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/v1/update/${id}`,
        {
          name,
          brand,
          price,
          year,
          description,
          imagesBase64: imageUrls, },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      if (response.status === 200) {
        navigate(`/car/${id}`);  
      }
    } catch (err) {
      setError('Failed to update car. Please try again later.');
      setLoading(false);
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
        <Text color="red.500" fontSize="xl">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" maxWidth="600px" margin="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>Edit Car</Text>

      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Car Name"
          />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Brand</FormLabel>
          <Input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Car Brand"
          />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Car Price"
          />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Year</FormLabel>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Car Year"
          />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Car Description"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Image URLs (optional)</FormLabel>
          {imageUrls.map((url, index) => (
            <Flex key={index} mb={2} align="center">
              <Input
                type="text"
                value={url}
                onChange={(e) => handleImageUrlChange(e, index)}
                placeholder="Image URL"
                width="80%"
              />
              <Button
                ml={2}
                colorScheme="red"
                onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </Flex>
          ))}
          <Button
            colorScheme="blue"
            onClick={() => setImageUrls([...imageUrls, ''])}
          >
            Add Image URL
          </Button>
        </FormControl>

        {images.length > 0 && (
          <Box mb={4}>
            <FormLabel>Current Images</FormLabel>
            <Flex wrap="wrap" justify="space-between">
              {images.map((image, index) => (
                <Box key={index} mb={2} width="100px" height="100px" overflow="hidden" borderRadius="md" boxShadow="md">
                  <Image src={image} alt={`car-image-${index}`} objectFit="cover" width="100%" height="100%" />
                </Box>
              ))}
            </Flex>
          </Box>
        )}

        <Button colorScheme="teal" type="submit" width="full" mb={4}>Update Car</Button>
      </form>

      <Button colorScheme="red" onClick={() => navigate(`/list`)} width="full">Cancel</Button>
    </Box>
  );
};

export default EditCar;
