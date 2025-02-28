import product from 'app/entities/product/product.reducer';
import userActivity from 'app/entities/user-activity/user-activity.reducer';
import address from 'app/entities/address/address.reducer';
import order from 'app/entities/order/order.reducer';
import orderItem from 'app/entities/order-item/order-item.reducer';
import payment from 'app/entities/payment/payment.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  product,
  userActivity,
  address,
  order,
  orderItem,
  payment,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
