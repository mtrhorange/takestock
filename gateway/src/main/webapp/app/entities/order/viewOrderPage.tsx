import { Box, Button, CardMedia, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { toast } from 'react-toastify';

const orderTabs = [
  { label: 'All', status: 'ALL' },
  { label: 'To Pay', status: 'PENDING' },
  { label: 'To Ship', status: ['PAID', 'PROCESSING'] },
  { label: 'To Receive', status: ['SHIPPED', 'TO_RECEIVE'] },
  { label: 'Completed', status: 'COMPLETED' },
  { label: 'Cancelled', status: 'CANCELLED' },
  { label: 'Return Refund', status: 'RETURN_REFUND' },
];

const orderStatusLabel = [
  { label: 'Pending Payment', status: 'PENDING' },
  { label: 'Pending Shipping', status: ['PAID', 'PROCESSING'] },
  { label: 'Pending Delivery', status: ['SHIPPED', 'TO_RECEIVE'] },
  { label: 'Completed', status: 'COMPLETED' },
  { label: 'Cancelled', status: 'CANCELLED' },
  { label: 'Return Refund', status: 'RETURN_REFUND' },
];

const apiUrl = 'api/';

export const ViewOrderPage = () => {
  const account = JSON.parse(localStorage.getItem('account') || 'null');
  const [selectedTab, setSelectedTab] = useState('ALL');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data: ordersData } = await axios.get(`${apiUrl}orders/viewOrders/${account.id}`);

      const enrichedOrders = await Promise.all(
        ordersData.map(async order => {
          const productDetails = await Promise.all(
            order.orderItemDTOList.map(async item => {
              const { data: product } = await axios.get(`${apiUrl}products/${item.productId}`);
              return { ...item, ...product }; // Merge product details
            }),
          );
          return { ...order, orderItemDTOList: productDetails }; // Update structure
        }),
      );

      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleCancelOrder = id => {
    const orderPayload = { id };

    const requestUrl = `${apiUrl}orders/deleteOrder`;
    axios
      .post(requestUrl, orderPayload)
      .then(res => {
        fetchOrders();
        toast.success('Order cancelled successfully!');
        // Optionally refetch orders or update UI
      })
      .catch(err => {
        toast.error('Failed to cancel order.');
      });
  };

  const handleRefundOrder = id => {
    const orderPayload = { id };

    const requestUrl = `${apiUrl}orders/refundOrder`;
    axios
      .post(requestUrl, orderPayload)
      .then(res => {
        fetchOrders();
        toast.success('Order refund successfully!');
        // Optionally refetch orders or update UI
      })
      .catch(err => {
        toast.error('Failed to refund.');
      });
  };

  // Filter orders based on selected tab
  const filteredOrders =
    selectedTab === 'ALL'
      ? orders
      : orders.filter(order =>
          Array.isArray(orderTabs.find(tab => tab.status === selectedTab)?.status)
            ? orderTabs.find(tab => tab.status === selectedTab)?.status.includes(order.orderDTO.orderStatus)
            : order.orderDTO.orderStatus === selectedTab,
        );
  console.warn(orders);
  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        My Purchases
      </Typography>

      {/* Tabs */}
      <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {orderTabs.map(tab => (
          <Tab key={tab.label} label={tab.label} value={tab.status} />
        ))}
      </Tabs>

      {/* Loading Indicator */}
      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading orders...
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ mt: 3 }}>
          {filteredOrders.length === 0 ? (
            <Typography textAlign="center">No orders found in this category.</Typography>
          ) : (
            filteredOrders.map(order => (
              <Paper key={order.orderDTO.id} sx={{ mb: 3, p: 3, boxShadow: 2, borderRadius: 2 }}>
                {/* Order Status */}
                <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {orderStatusLabel.find(label => label.status.includes(order.orderDTO.orderStatus))?.label}
                </Typography>

                {/* Ordered Items */}
                {order.orderItemDTOList.map(item => (
                  <Paper key={item.productId} sx={{ mt: 2, p: 2, display: 'flex', alignItems: 'center', boxShadow: 1 }}>
                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      sx={{ width: 70, height: 70, objectFit: 'contain', borderRadius: 1, mx: 1 }}
                      image={item.imageUrl || '/placeholder.jpg'}
                      alt={item.name}
                    />

                    {/* Product Details */}
                    <Stack sx={{ flexGrow: 1, mx: 2 }}>
                      <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Variation: {item.variation || 'Default'}
                      </Typography>
                      <Typography variant="body2">x{item.quantity}</Typography>
                    </Stack>

                    {/* Price */}
                    <Typography fontWeight="bold">${(item.quantity * item.price).toFixed(2)}</Typography>
                  </Paper>
                ))}

                {/* Order Total & Actions */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Typography fontWeight="bold">Total: ${order.orderDTO.totalPrice.toFixed(2)}</Typography>
                  <Stack direction="row" spacing={1}>
                    {orderTabs.find(tab => tab.status === 'PENDING')?.status.includes(order.orderDTO.orderStatus) ? (
                      <Button variant="contained" color="error" onClick={() => handleCancelOrder(order.orderDTO.id)}>
                        Cancel Order
                      </Button>
                    ) : orderTabs
                        .find(tab => tab.label === 'To Ship' || tab.label === 'To Receive')
                        ?.status.includes(order.orderDTO.orderStatus) ? (
                      <Button variant="contained" color="error" onClick={() => handleRefundOrder(order.orderDTO.id)}>
                        Refund
                      </Button>
                    ) : null}

                    <Button variant="contained" color="primary">
                      View Order Details
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default ViewOrderPage;
