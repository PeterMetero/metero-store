// src/context/AppContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import { API } from '../utils/api';
import { toast } from 'react-toastify';

const AppContext = createContext();

const initialState = {
  user: null,
  cart: [],           // array of { _id, name, price, image, quantity }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'ADD_TO_CART': {
      const exists = state.cart.find(item => item._id === action.payload._id);
      if (exists) {
        toast.info('Already in cart');
        return state;
      }
      toast.success('Added to cart');
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }

    case 'UPDATE_CART_QUANTITY': {
      return {
        ...state,
        cart: state.cart.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'REMOVE_FROM_CART':
      toast.info('Removed from cart');
      return {
        ...state,
        cart: state.cart.filter(item => item._id !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      API.get('/api/users/profile')     // ← change to your real profile endpoint
        .then(res => {
          dispatch({ type: 'SET_USER', payload: res.data });
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete API.defaults.headers.common['Authorization'];
        });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);