import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./Router/ProtectedRoute";
import "./App.css"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/HomePage"
import DoctorDashboard from "./pages/DoctorDashboardPage"
import BookingPage from "./pages/BookingPage";
import PublicRoute from "./Router/PublicRoute";
import ReceptionDashboard from "./pages/ReceptionPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route path="/bookingPage" element={<BookingPage />} />
        <Route path="/reception/dashboard" element ={<ProtectedRoute allowedRoles={["secretary"]}><ReceptionDashboard/></ProtectedRoute>} />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;