import express from 'express';
import { createCar, deleteCar, getCarDetails, getCarsByUsers, searchCars, updateCar } from '../controllers/CarController.js'; 
import { verifyToken } from '../middlewares/carsmiddlewares.js';
const router = express.Router();

router.post('/upload' ,createCar);
router.get('/usercars', verifyToken, getCarsByUsers);
router.put('/update/:id', verifyToken, updateCar);
router.delete('/delete/:id' , verifyToken ,deleteCar );
router.get('/car/:id' , verifyToken , getCarDetails);

router.get('/search', searchCars);

export default router;