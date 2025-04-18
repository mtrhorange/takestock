export interface IProduct {
  id?: string;
  name?: string;
  description?: string | null;
  price?: number;
  category?: string;
  brand?: string | null;
  stock?: number;
  imageUrl?: string | null;
  tags?: string | null;
}

export const defaultValue: Readonly<IProduct> = {};
