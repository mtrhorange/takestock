import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_GATEWAY_URL = "http://localhost:8060/api";

export const fetchProducts = () => axios.get(`${API_GATEWAY_URL}/products`);
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

