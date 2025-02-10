import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import MenuComponent from './components/menu/Menu';
import AddItem from './components/menu/AddItem';
import OrdersPage from './components/OrdersPage';
import AppLayout from './components/AppLayout';
import { CartProvider } from './components/contexts/CartContext';
import { Toaster } from "./components/ui/toaster";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');  
    window.location.href = '/login';
  };

  return (
    <CartProvider>
      <Router>
        <Routes>

          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <AppLayout handleLogout={handleLogout}>
                  <MenuComponent />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute>
                <AppLayout handleLogout={handleLogout}>
                  <AddItem />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AppLayout handleLogout={handleLogout}>
                  <OrdersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </CartProvider>
  );
}

export default App;