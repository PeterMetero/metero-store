import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000',
  // withCredentials: true,    // uncomment later if using cookie-based auth
});