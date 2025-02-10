import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { MdDeliveryDining } from "react-icons/md";
import { useToast } from "./ui/hooks/use-toast";

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    api: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();


  useEffect(() => {
    if (location.state?.success) {
      toast({
        title: "Registration Successful",
        description: location.state.success,
        variant: "default",
        duration: 5000
      });

     
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (!/^[a-zA-Z0-9]{4,20}$/.test(value)) {
          error = 'Username must be 4-20 alphanumeric characters';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {
      username: validateField('username', formData.username),
      password: validateField('password', formData.password),
      api: ''
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name] || errors.api) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
        api: name === 'username' ? '' : prev.api
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, api: '' }));

    try {
      const response = await fetch('https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        const apiError = data.message.includes('credentials') 
          ? 'Invalid username or password' 
          : data.message;
        throw new Error(apiError || 'Login failed. Please try again.');
      }
  
   
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.user.username);


      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.username}!`,
        variant: "default",
        duration: 3000
      });

      
      setTimeout(() => {
        navigate('/menu');
      }, 1000);

    } catch (error) {
   
      toast({
        title: "Login Failed",
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <MdDeliveryDining className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-600">Glad to see you again 👋</p>
          <p className="text-sm text-gray-500">Login to your account below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter user or admin or manager"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Same pw for all three -> 12345A"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">↻</span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-purple-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;