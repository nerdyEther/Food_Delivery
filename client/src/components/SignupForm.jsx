import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { MdFastfood } from "react-icons/md";
import { useToast } from "./ui/hooks/use-toast";

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    api: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (!/(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number and uppercase letter';
        }
        break;
        
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
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
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
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
      const response = await fetch('https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
       
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: "Registration Successful",
        description: `Account created for ${data.user.username}. Please login.`,
        variant: "default",
        duration: 5000
      });


      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {
    
      const errorMessage = error.message.includes('already exists') 
        ? 'Username already exists' 
        : error.message || 'An unexpected error occurred';

   
      toast({
        title: "Registration Failed",
        description: errorMessage,
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
            <MdFastfood className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-600">Start your food journey with us 🍔</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
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
                Registering...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-purple-600 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;