import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from '../contexts/CartContext';
import { Separator } from "../ui/separator";
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    totalAmount
  } = useCart();

  const shippingCost = 40;
  const subtotal = totalAmount;
  const total = subtotal + shippingCost;

  const handleProceedToOrder = () => {
    setIsOpen(false);
    navigate('/orders');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-1 -mx-6 px-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                <p>Your cart is empty</p>
                <Button 
                  variant="link" 
                  className="text-purple-600 mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6 py-6">
                {cartItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="font-semibold whitespace-nowrap">₹{item.price * item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {cartItems.length > 0 && (
            <div className="border-t py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>₹{shippingCost.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleProceedToOrder}
              >
                Proceed to Order
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Cart;