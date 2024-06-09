import { Product } from '@prisma/client';

export class ProductEntity implements Product {
  id: number;

  name: string;

  category: string;

  description: string;

  price: number;
}
