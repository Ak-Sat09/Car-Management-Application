import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Stack, 
  Text, 
  useToast 
} from '@chakra-ui/react';

const CreateCar = () => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);  // Array to hold multiple image URLs
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'brand') setBrand(value);
    if (name === 'price') setPrice(value);
    if (name === 'year') setYear(value);
    if (name === 'description') setDescription(value);
  };

  // Handle adding new image URL input field
  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  // Handle removing an image URL input field
  const handleRemoveImageUrl = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  // Handle image URL input change
  const handleImageUrlChange = (index, e) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = e.target.value;
    setImageUrls(newImageUrls);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0 || imageUrls.includes('')) {
      setError('Please provide at least one valid image URL.');
      return;
    }

    const carData = {
      name,
      brand,
      price,
      year,
      description,
      imagesBase64: imageUrls,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/v1/upload', carData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Add the token for authentication
        },
      });
      
      // Show success toast message
      toast({
        title: 'Car Created.',
        description: 'The car has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset the form
      setName('');
      setBrand('');
      setPrice('');
      setYear('');
      setDescription('');
      setImageUrls(['']);
      setError('');

      // Redirect to login page
      navigate('/list');

    } catch (err) {
      console.error(err);
      setError('There was an error creating the car.');
      
      // Show error toast message
      toast({
        title: 'Error',
        description: 'There was an error creating the car. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="lg" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Text fontSize="2xl" mb={4}>Create a New Car</Text>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Car Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter car name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Brand</FormLabel>
            <Input
              type="text"
              name="brand"
              value={brand}
              onChange={handleChange}
              placeholder="Enter car brand"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              name="price"
              value={price}
              onChange={handleChange}
              placeholder="Enter car price"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Year</FormLabel>
            <Input
              type="number"
              name="year"
              value={year}
              onChange={handleChange}
              placeholder="Enter car manufacturing year"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Enter car description"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Car Images (Enter Image URLs)</FormLabel>
            {imageUrls.map((url, index) => (
              <Stack direction="row" spacing={4} key={index}>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e)}
                  placeholder={`Image URL ${index + 1}`}
                />
                {imageUrls.length > 1 && (
                  <Button
                    colorScheme="red"
                    onClick={() => handleRemoveImageUrl(index)}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            ))}
            <Button colorScheme="teal" onClick={handleAddImageUrl} mt={2}>
              Add Another Image URL
            </Button>
          </FormControl>

          {error && <Text color="red.500">{error}</Text>}

          <Button colorScheme="teal" type="submit" width="full">
            Create Car
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateCar;
