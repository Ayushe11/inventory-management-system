import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventory-backend-voww.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
