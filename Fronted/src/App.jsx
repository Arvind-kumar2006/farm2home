import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import FarmerDashboard from './pages/FarmerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import OrderHistory from './pages/OrderHistory';
import FarmerOrders from './pages/Farmer.Order';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/FarmerDashboard" element={<FarmerDashboard />} />
        <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/FarmerOrders" element={<FarmerOrders />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;