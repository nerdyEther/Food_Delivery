import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/hooks/use-toast";
import { Coffee, Pizza, Cake, X } from "lucide-react";
import { Card } from "../ui/card";

function AddItem({ onClose, onSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    availability: true
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else if (!['Appetizers', 'Main Course', 'Desserts', 'Beverages'].includes(formData.category)) {
      newErrors.category = 'Invalid category';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add menu item');
      }

      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-[500px] bg-white p-6 relative">
       
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

      
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-purple-600">
            Add New Menu Item
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
      
          <div className="space-y-2">
            <Label htmlFor="name">
              Item Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

       
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Appetizers">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Appetizers
                  </div>
                </SelectItem>
                <SelectItem value="Main Course">
                  <div className="flex items-center gap-2">
                    <Pizza className="h-4 w-4" />
                    Main Course
                  </div>
                </SelectItem>
                <SelectItem value="Desserts">
                  <div className="flex items-center gap-2">
                    <Cake className="h-4 w-4" />
                    Desserts
                  </div>
                </SelectItem>
                <SelectItem value="Beverages">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Beverages
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

      
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

        
          <div className="flex items-center space-x-2">
            <Checkbox
              id="availability"
              checked={formData.availability}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, availability: checked })
              }
            />
            <Label htmlFor="availability" className="text-sm font-medium">
              Item is available
            </Label>
          </div>

     
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? "Adding..." : "Add Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddItem;