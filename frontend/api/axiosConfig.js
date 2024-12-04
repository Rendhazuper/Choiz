import axios from 'axios';

// Buat instance Axios dengan konfigurasi default
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api', // URL Laravel API
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default axiosInstance;
