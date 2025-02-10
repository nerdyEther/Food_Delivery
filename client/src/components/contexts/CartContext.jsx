import { createContext, useContext, useState, useReducer, useEffect } from 'react';

const CartContext = createContext();


const cartReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
     
      localStorage.setItem('cartItems', JSON.stringify(newState.items));
      return newState;

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
   
      localStorage.setItem('cartItems', JSON.stringify(newState.items));
      return newState;

    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      };
    
      localStorage.setItem('cartItems', JSON.stringify(newState.items));
      return newState;

    case 'CLEAR_CART':
   
      localStorage.removeItem('cartItems');
      return {
        ...state,
        items: [],
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};

export function CartProvider({ children }) {

  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      try {
        const parsedItems = JSON.parse(savedCartItems);
        dispatch({ type: 'LOAD_CART', payload: parsedItems });
      } catch (error) {
        console.error('Error parsing cart items from localStorage:', error);
      }
    }
  }, []);


  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };


  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
    } else {
    
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    }
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    cartItems: state.items,
    isOpen,
    setIsOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    totalAmount: getSubtotal() 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};