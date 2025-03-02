import dayjs from 'dayjs';

export interface IUserActivity {
  id?: number;
  userId1?: string;
  productId?: string;
  action?: string;
  timestamp?: dayjs.Dayjs;
}

export const defaultValue: Readonly<IUserActivity> = {};
