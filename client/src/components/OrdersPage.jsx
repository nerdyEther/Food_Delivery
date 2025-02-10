import React, { useState, useEffect } from 'react';
import { useCart } from './contexts/CartContext';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { AlertCircle, Clock, CheckCircle2, ShoppingBasket, ShoppingCart, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import axios from 'axios';
import { useToast } from "./ui/hooks/use-toast";
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const { cartItems, totalAmount, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
  }, []);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
      
      const response = await axios.put(`https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/orders/${orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

     
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
        variant: "default",
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };


  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          menuItem: item._id,
          quantity: item.quantity
        })),
        totalAmount: totalAmount + 40
      };

      const response = await axios.post('https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

    
      const ordersResponse = await axios.get('https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setOrders(ordersResponse.data);

  
      clearCart();

      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error placing order:', err);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800">
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4 text-gray-500">
                  <ShoppingBasket className="h-16 w-16 text-purple-400" />
                  <h3 className="text-xl font-semibold">Make Your First Order</h3>
                  <p className="text-sm max-w-xs">
                    You haven't placed any orders yet. Explore our menu and start your culinary journey!
                  </p>
                  <Link to="/menu">
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                      Browse Menu
                    </Button>
                  </Link>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order._id} className="bg-white/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </p>
                              <p className="font-medium">
                                Order #{order._id.slice(-6)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <Badge 
                                variant={
                                  order.status === 'Completed' ? 'success' :
                                  order.status === 'Pending' ? 'warning' : 
                                  'destructive'
                                }
                              >
                                {order.status}
                              </Badge>
                              {['admin', 'manager'].includes(userRole) && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateOrderStatus(order._id, order.status)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.menuItem.name} × {item.quantity}</span>
                                <span className="font-medium">
                                  ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-4" />
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{order.totalAmount.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

      
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800">
                Current Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4 text-gray-500">
                  <ShoppingCart className="h-16 w-16 text-purple-400" />
                  <h3 className="text-xl font-semibold">Your Cart is Empty</h3>
                  <p className="text-sm max-w-xs">
                    Looks like you haven't added anything to your cart yet. 
                    Explore our menu and discover delicious meals!
                  </p>
                  <Link to="/menu">
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                      Browse Menu
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>₹40.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>₹{(totalAmount + 40).toFixed(2)}</span>
                    </div>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handlePlaceOrder}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;