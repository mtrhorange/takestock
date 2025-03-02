import axios from 'axios';

export const postUserAction = (userId1, product, action) => {
  const apiUrl = 'api/user-activities';
  axios
    .post(`${apiUrl}/userActivity`, {
      productId: product.id,
      userId1,
      action,
      timestamp: new Date().toISOString(), // ✅ Converts to ISO string (Instant-compatible)
    })
    .then(res => {
      return res.data;
    })
    .catch(e => console.error(e));
};
