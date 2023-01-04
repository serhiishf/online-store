import { ProductInCart } from './ProductInCart';

export interface Cart {
    totalCount: number;
    oneTypeProductCount: number;
    totalPrice: number;
    products: ProductInCart[];
}
