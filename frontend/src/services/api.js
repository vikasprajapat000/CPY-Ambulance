import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message));
    }
  }
);

// Booking APIs
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings/create', bookingData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookingByBookingId = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/booking/${bookingId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookingsByPhone = async (phone) => {
  try {
    const response = await api.get(`/bookings/phone/${phone}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllBookings = async (params = {}) => {
  try {
    const response = await api.get('/bookings', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookingStats = async () => {
  try {
    const response = await api.get('/bookings/stats/summary');
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;