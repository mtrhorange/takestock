import axios from "axios";

const API_GATEWAY_URL = "http://localhost:9000/api";

export const fetchProducts = () => axios.get(`${API_GATEWAY_URL}/products`);
export const authenticate = (credentials: {
  username: string;
  password: string;
}) => axios.post(`${API_GATEWAY_URL}/authenticate`, credentials);
