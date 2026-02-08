// src/app/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Products from '../pages/Products/Products';
import { ProtectedRoute } from './router';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
