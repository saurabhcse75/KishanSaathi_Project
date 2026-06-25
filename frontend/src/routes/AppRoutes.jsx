import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Flow from "../pages/Flow";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import FarmerDashboard from "../pages/farmer/Dashboard";
import BuyerDashboard from "../pages/buyer/Dashboard";
import ProtectedRoute from "../routes/ProtectedRoute";
import CreatePool from "../pages/farmer/CreatePool";
import NearbyPools from "../pages/farmer/NearbyPools";
import MyPools from "../pages/farmer/MyPools";
import PoolDetails from "../pages/farmer/PoolDetails";
import NearbyPoolsBuyer from "../pages/buyer/NearbyPoolsBuyer";
import MyOrders from "../pages/buyer/MyOrders";
import FarmerOrders from "../pages/farmer/FarmerOrders";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/flow" element={<Flow />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* FARMER ROUTES */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute role="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-pool"
        element={
          <ProtectedRoute role="farmer">
            <CreatePool />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nearby-pools"
        element={
          <ProtectedRoute role="farmer">
            <NearbyPools />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-pools"
        element={
          <ProtectedRoute role="farmer">
            <MyPools />
          </ProtectedRoute>
        }
      />

      <Route
        path="/farmer/orders"
        element={
          <ProtectedRoute role="farmer">
            <FarmerOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pool/:id"
        element={
          <ProtectedRoute role="farmer">
            <PoolDetails />
          </ProtectedRoute>
        }
      />

      {/* BUYER ROUTES */}
      <Route
        path="/buyer"
        element={
          <ProtectedRoute role="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/nearby"
        element={
          <ProtectedRoute role="buyer">
            <NearbyPoolsBuyer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/orders"
        element={
          <ProtectedRoute role="buyer">
            <MyOrders />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
