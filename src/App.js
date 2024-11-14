import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LoginPage from './components/UserComponent/Login';
import Register from './components/UserComponent/Register'; 
import UploadCarPage from './components/CarComponents/UploadCarPage'; 
import CarList from './components/CarComponents/CarList';
import CarEditAndDelete from './components/CarComponents/CarEditAndDelete';
import CarDetail from './components/CarComponents/CarDetail';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/upload" element={<UploadCarPage />} /> 
        <Route path="/list" element={<CarList />} /> 
        <Route path="/update/:id" element={<CarEditAndDelete />} />
        <Route path="/car/:id" element={<CarDetail />} />
  
         
      </Routes>
    </Router>
  );
}

export default App;
