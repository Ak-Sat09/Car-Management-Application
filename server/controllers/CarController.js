import Car from '../models/CarModel.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload base64 images to Cloudinary
const uploadImages = async (imagesBase64) => {
  const uploadImages = [];
  for (let i = 0; i < imagesBase64.length; i++) {
    const result = await cloudinary.v2.uploader.upload(imagesBase64[i], {
      folder: 'cars_images',
    });
    uploadImages.push(result.secure_url);
  }
  return uploadImages;
};

// Controller to create a new car without user authentication
export const createCar = async (req, res) => {
  try {
    // Extract token from request headers (assuming it's in the Authorization header)
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // or decoded.userId, depending on how your token is structured

    // Extract other car data from the request body
    const { name, brand, price, year, description, imagesBase64 } = req.body;

    // Ensure at least one image is provided
    if (!imagesBase64 || imagesBase64.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    // Upload the images to Cloudinary
    const images = await uploadImages(imagesBase64); // Assume uploadImages function is defined elsewhere

    // Create a new car object and associate it with the user
    const newCar = new Car({
      name,
      brand,
      price,
      year,
      description,
      images,
      user: userId, // Add user ID here
    });

    // Save the new car to the database
    await newCar.save();

    // Send the response
    res.status(201).json({ message: 'Car created successfully', car: newCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating car.' });
  }
};

export const getCarsByUsers = async (req , res) => {
  try {
    const userId = req.user.id;
    const cars = await Car.find({user:userId});
    if(!cars) return res.status(404).json({ message: "No cars found for this user." });
    res.status(200).json({ cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching cars.' });
    
  }
};
 

export const updateCar = async (req, res) => {
  const carId = req.params.id;
  const { name, brand, price, year, description, imagesBase64 } = req.body; // Extract imagesBase64 here
  let images = [];

  try {
    // Find the car by its ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    // Check if the user owns the car
    if (car.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this car.' });
    }

    // Check if new images are provided in base64 format
    if (imagesBase64 && imagesBase64.length > 0) {
      // Upload new images to Cloudinary
      images = await uploadImages(imagesBase64);
    } else {
      // Keep old images if no new images are provided
      images = car.images;
    }

    // Update the car with new information
    car.name = name || car.name;
    car.brand = brand || car.brand;
    car.price = price || car.price;
    car.year = year || car.year;
    car.description = description || car.description;
    car.images = images;

    // Save the updated car
    await car.save();

    // Send response with the updated car information
    res.status(200).json({ message: 'Car updated successfully.', car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating car.' });
  }
};


// Controller to delete a car
export const deleteCar = async (req, res) => {
  const carId = req.params.id;

  try {
    // Find the car by its ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    // Check if the user is the owner of the car
    if (car.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this car.' });
    }

    // Delete the car using deleteOne method
    await car.deleteOne();

    // Send success response
    res.status(200).json({ message: 'Car deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting car.' });
  }
};



export const getCarDetails = async (req, res) => {
  const carId = req.params.id;

  try {
    // Find the car by its ID
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    // Return the car details
    res.status(200).json({ car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching car details.' });
  }
};


export const searchCars = async (req, res) => {
  const keyword = req.query.keyword || '';  // Get the search keyword from query params

  try {
    // Use MongoDB's $text operator to search across text-indexed fields
    const cars = await Car.find({
      $text: { $search: keyword }  // Perform a full-text search
    });

    if (cars.length === 0) {
      return res.status(404).json({ message: 'No cars found matching the search keyword.' });
    }

    res.status(200).json({ cars });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};