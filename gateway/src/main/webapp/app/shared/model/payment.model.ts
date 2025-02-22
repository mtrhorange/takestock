import dayjs from 'dayjs';
import { IOrder } from 'app/shared/model/order.model';

export interface IPayment {
  id?: number;
  paymentMethod?: string;
  transactionId?: string;
  paymentStatus?: string;
  paymentDate?: dayjs.Dayjs;
  order?: IOrder | null;
}

export const defaultValue: Readonly<IPayment> = {};
