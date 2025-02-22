export interface IAddress {
  id?: number;
  userId1?: number;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export const defaultValue: Readonly<IAddress> = {};
