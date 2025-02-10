import React, { useEffect, useState } from 'react';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2, ShoppingCart, Check } from "lucide-react";
import { jwtDecode } from 'jwt-decode';
import { useCart } from '../contexts/CartContext';
import { useToast } from "../ui/hooks/use-toast";


const foodImageUrls = [
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164829/OWidXNe_xuys40.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164829/ckmGknG_kpitnk.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164829/TvTBUKx_ne8gtb.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164829/JjQldM4_ftocgy.png',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164829/27IffZt_yruxzc.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164829/R8KYrjH_gllfhe.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164829/27IffZt_yruxzc.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164828/IKQbKjQ_r9gl9j.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164828/cpdv7j0_ikc498.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164828/dZzXWFQ_vjrspz.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164828/cpTZoRG_iyj68h.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164827/skXmSgF_rlbnzf.png',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164827/5XIv3EJ_pp8uev.jpg',
    'https://res.cloudinary.com/dfbnrhhn2/image/upload/v1739164827/eMYknFK_hvhvui.png'
];


function MenuGrid({ menuItems, loading, onUpdate, onDelete }) {
  const [userRole, setUserRole] = useState('user');
  const [foodImages, setFoodImages] = useState({});
  const { addToCart, cartItems, setIsOpen } = useCart();
  const { toast } = useToast();

  
  const isItemInCart = (itemId) => {
    return cartItems.some(item => item._id === itemId);
  };

  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }


    const assignImages = () => {
      const newImages = {};
      menuItems.forEach(item => {
        const randomIndex = Math.floor(Math.random() * foodImageUrls.length);
        newImages[item._id] = foodImageUrls[randomIndex];
      });
      setFoodImages(newImages);
    };

    if (menuItems.length > 0) {
      assignImages();
    }
  }, [menuItems]);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
    setIsOpen(true);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="animate-spin text-4xl">↻</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const inCart = isItemInCart(item._id);
            
            return (
              <Card 
                key={item._id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-xl"
              >
                <div className="p-4 space-y-4">
                 
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {foodImages[item._id] ? (
                      <img
                        src={foodImages[item._id]}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Loading...
                      </div>
                    )}
                  </div>

                  
                  <div className="space-y-3">
                 
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                      <span className="text-sm text-purple-600">{item.category}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                      <div className="flex gap-2">
                    
                        {(userRole === 'admin' || userRole === 'manager') && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onUpdate(item._id)}
                            className="hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {userRole === 'admin' && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onDelete(item._id)}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${
                        !item.availability 
                          ? 'bg-gray-300'
                          : inCart 
                          ? 'bg-green-600 hover:bg-green-600'
                          : 'bg-purple-600 hover:bg-purple-700'
                      } transition-colors group-hover:shadow-md`}
                      disabled={!item.availability || inCart}
                      onClick={() => handleAddToCart(item)}
                    >
                      {!item.availability ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Unavailable
                        </>
                      ) : inCart ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MenuGrid;