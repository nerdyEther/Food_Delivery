import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { FiLogOut } from "react-icons/fi";
import { MdFastfood } from "react-icons/md";
import { ShoppingCart, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useCart } from './contexts/CartContext';
import { jwtDecode } from 'jwt-decode';
import Cart from './menu/Cart';

function Navbar({ handleLogout }) {
  const location = useLocation();
  const { setIsOpen, getCartCount } = useCart();
  const itemCount = getCartCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getUserInfo = () => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUsername = localStorage.getItem('username');
      
      console.log('Raw Token:', token);
      console.log('Stored Username:', storedUsername);
  
      if (!token) {
        console.log('No token found');
        return { name: 'Guest', role: 'user' };
      }
      
      const decoded = jwtDecode(token);
      
      console.log('Decoded Token:', decoded);
      
      return {
        name: storedUsername || 'Guest',
        role: decoded.role || 'user'
      };
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      return { name: 'Guest', role: 'user' };
    }
  };

  const { name: userName, role: userRole } = getUserInfo();

  return (
    <>
      <nav className="bg-white border-b border-purple-100 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <Link 
              to="/menu" 
              className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105"
            >
              <MdFastfood className="h-8 w-8 text-purple-600 transition-colors duration-200 group-hover:text-purple-700" />
              <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                FoodDeliver
              </span>
            </Link>

           
            <div className="hidden md:flex space-x-8">
              <Link
                to="/menu"
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${location.pathname === '/menu' 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                Menu
                {location.pathname === '/menu' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
                )}
              </Link>
              
              <Link
                to="/orders"
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${location.pathname === '/orders' 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                My Orders
                {location.pathname === '/orders' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
                )}
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              
              <Button 
                variant="ghost" 
                className="relative text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 hidden md:flex"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-purple-600 text-white h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

             
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/menu" className="flex items-center">
                        Menu
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsOpen(true)} className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                      {itemCount > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 bg-purple-600 text-white"
                        >
                          {itemCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

          
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 rounded-full border-2 border-purple-200 hover:border-purple-400 transition-colors duration-200">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {userName?.charAt(0)?.toUpperCase() || 'G'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {userRole?.charAt(0)?.toUpperCase()}{userRole?.slice(1)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <Cart />
    </>
  );
}

export default Navbar;