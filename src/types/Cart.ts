import { ProductInCart } from './ProductInCart';

export interface Cart {
    totalCount: number;
    totalPrice: number;
    products: ProductInCart[];
}
