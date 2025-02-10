import React, { useState, useEffect } from 'react';
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

function UpdateItem({ item, onClose, onSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  

  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    price: item?.price?.toString() || '',
    availability: item?.availability ?? true
  });


  useEffect(() => {
    if (item) {
      console.log('Setting form data for item:', item);

      const newFormData = {
        name: item.name || '',
        category: item.category || '',
        price: item.price?.toString() || '',
        availability: item.availability ?? true
      };
      console.log('New form data:', newFormData);
      setFormData(newFormData);
    }
  }, [item]);

  


  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
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
    console.log('Submitting form with data:', formData);
    
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
      const response = await fetch(`http://localhost:5555/api/menu/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          availability: formData.availability
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update menu item');
      }

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

  if (!item) {
    return null;
  }

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
            Update Menu Item
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Item Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
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
              defaultValue={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category">
                  {formData.category}
                </SelectValue>
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
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price"
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
              onCheckedChange={(checked) => handleInputChange('availability', checked)}
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
              {loading ? "Updating..." : "Update Item"}
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

export default UpdateItem;