import { ProductInCart } from './ProductInCart';

type DiscountCode = {
  [prop: string]: number;
};

export interface Cart {
  totalCount: number;
  oneTypeProductCount: number;
  totalPrice: number;
  products: ProductInCart[];
  discount: number;
  totalPriceAfterDiscount: number | null;
  activeDiscountCodes: DiscountCode[] | [];
}
