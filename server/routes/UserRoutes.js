import express from 'express'; 
import { validateLogin, validateRegistration } from '../middlewares/validationMiddleware.js';
import { createUser, loginUser } from '../controllers/UserController.js';
 
const router = express.Router();

// POST request to register a new user
router.post('/register', validateRegistration, createUser);

// POST request to login a user
router.post('/login', validateLogin, loginUser);

export default router;
