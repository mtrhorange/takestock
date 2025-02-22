import dayjs from 'dayjs';

export interface IOrder {
  id?: number;
  totalPrice?: number;
  orderStatus?: string;
  paymentStatus?: string;
  createdDate?: dayjs.Dayjs;
}

export const defaultValue: Readonly<IOrder> = {};
