import dayjs from 'dayjs';

export interface IUserActivity {
  id?: number;
  userId?: string;
  productId?: string;
  action?: string;
  timestamp?: dayjs.Dayjs;
}

export const defaultValue: Readonly<IUserActivity> = {};
