import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_GATEWAY_URL = "http://localhost:8060/api";

export const fetchProducts = (currentPage, pageSize) => axios.get(`${API_GATEWAY_URL}/products/pageProduct?page=${currentPage}&size=${pageSize}&sort=id`);
export const fetchRecommendProducts = (id) => axios.get(`${API_GATEWAY_URL}/user-activities/recommend/${id}`);
export const postUserAction = (productId, userId1, action) => axios.post(`${API_GATEWAY_URL}/user-activities/userActivity`, {
  productId,
  userId1,
  action,
  timestamp: new Date().toISOString(), // ✅ Converts to ISO string (Instant-compatible)
})
export const authenticate = (credentials: {
  username: string;
  password: string;
}) => axios.post(`${API_GATEWAY_URL}/authenticate`, credentials);
export const account = async () => {
  const token = await AsyncStorage.getItem("token");
  return axios.get(`${API_GATEWAY_URL}/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const searchProducts = (params) => axios.get(`${API_GATEWAY_URL}/products/search?${params}`);
export const placeOrder = (orderPayload) => axios.post(`${API_GATEWAY_URL}/orders/placeOrder`, orderPayload);
export const stockQtyUpdate = (selectedProducts) => axios.post(`${API_GATEWAY_URL}/products/placeOrder`, selectedProducts);