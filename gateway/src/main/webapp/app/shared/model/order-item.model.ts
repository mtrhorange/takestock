import { IOrder } from 'app/shared/model/order.model';

export interface IOrderItem {
  id?: number;
  productId?: string;
  quantity?: number;
  price?: number;
  order?: IOrder | null;
}

export const defaultValue: Readonly<IOrderItem> = {};
