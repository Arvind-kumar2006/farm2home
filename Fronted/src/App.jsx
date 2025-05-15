import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import './index.css'
import FarmerDashboard from './pages/FarmerDashboard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
       <Route path='/' element={<Home/>}/>
        <Route path="/FarmerDashboard" element={<FarmerDashboard/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;