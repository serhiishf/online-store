import { Cart } from '../../types';
import { CartController } from './cartController';

export class HeaderController {
    static changeViewOnCartAction() {
        const cart = CartController.getCart();
        const priceEl = <HTMLElement>document.querySelector('.header__price');
        const countEl = <HTMLElement>document.querySelector('.cart__count');
        if (cart) {
            const parsedCart: Cart = JSON.parse(cart);
            priceEl.textContent = `${parsedCart.totalPrice} $`;
            countEl.textContent = parsedCart.totalCount.toString();
        } else {
            priceEl.textContent = '0';
            countEl.textContent = '0';
        }
    }
}
