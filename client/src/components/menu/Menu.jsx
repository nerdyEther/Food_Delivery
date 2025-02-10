import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { jwtDecode } from 'jwt-decode';
import { 
  Search, 
  SlidersHorizontal, 
  Coffee, 
  Pizza, 
  Cake,
  PlusCircle,
  ArrowUpDown
} from "lucide-react";
import MenuGrid from './MenuGrid';
import { Button } from "../ui/button";
import AddItem from './AddItem';
import { Toaster } from "../ui/toaster";
import UpdateItem from './UpdateItem';
import { useToast } from "../ui/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

function MenuComponent() {
  const [menuItems, setMenuItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9
  });
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'name',
    order: 'asc',
    search: '',
    page: 1,
    limit: 9
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const queryFilters = { ...filters };
      if (queryFilters.category === 'all') {
        delete queryFilters.category;
      }

      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(queryFilters).filter(([_, v]) => v != null && v !== '')
        )
      ).toString();

      const response = await fetch(`https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/menu?${query}`);
      const data = await response.json();
      
      setMenuItems(data.data.items);
      setPagination(data.data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    }
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, pagination.totalPages));
    setFilters(prev => ({ ...prev, page: validPage }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
  };

  const handleUpdateClick = async (itemId) => {
    try {
      const response = await fetch(`https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/menu/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      
      const { data } = await response.json();
      setSelectedItem(data);
      setIsUpdateModalOpen(true);
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch item details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    
    try {
      const response = await fetch(`https://querulous-karil-kuchnaamnhai-0c1f10e1.koyeb.app/api/menu/${deleteItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      if (!response.ok) throw new Error('Delete failed');
      
      toast({
        title: "Success",
        description: "Menu item has been successfully deleted.",
        variant: "default",
      });
      
      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
              
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search dishes..." 
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors duration-200 w-full"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                />
              </div>

             
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({...filters, category: value, page: 1})}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      All Categories
                    </div>
                  </SelectItem>
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

             
              <Select
                value={`${filters.sortBy}_${filters.order}`}
                onValueChange={(value) => {
                  const [sortBy, order] = value.split('_');
                  setFilters({...filters, sortBy, order, page: 1});
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Sort by</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>

             
              {isAdmin && (
                <Button 
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              )}
            </div>
          </div>
        </div>

        <MenuGrid 
          menuItems={menuItems} 
          loading={loading} 
          onDelete={handleDeleteClick}
          onUpdate={handleUpdateClick}
        />

       
        {!loading && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center mt-8 space-y-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="cursor-pointer"
              >
                Previous
              </Button>

              <div className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              Total Items: {pagination.totalItems}
            </div>
          </div>
        )}

       
        {isAddModalOpen && (
          <AddItem 
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchMenuItems();
            }}
          />
        )}

        {isUpdateModalOpen && selectedItem && (
          <UpdateItem 
            item={selectedItem}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedItem(null);
            }}
            onSuccess={() => {
              setIsUpdateModalOpen(false);
              setSelectedItem(null);
              fetchMenuItems();
              toast({
                title: "Success",
                description: "Menu item has been successfully updated.",
                variant: "default",
              });
            }}
          />
        )}

        <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this menu item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Toaster />
      </div>
    </div>
  );
}

export default MenuComponent;