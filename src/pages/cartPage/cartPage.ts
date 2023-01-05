import cartPage from '.';
import { CartController } from '../../components/controller/cartController';
import { ProductsInCart } from '../../components/view/productsInCart';
import { Cart } from '../../types';
import TemplatePage from '../templatePage/templatePage';

class CartPage extends TemplatePage {
    cart: Cart | null;

    constructor(id: string) {
        super(id);
        this.cart = this.getCart();
    }

    private getCart(): Cart | null {
        const cart: string | null = CartController.getCart();
        if (cart) {
            return JSON.parse(cart);
        }
        return null;
    }

    async render() {
        const thumb = this.createPageHTML('cart__thumb');

        if (this.cart && this.cart.totalCount > 0) {
            //render products in cart
            const view = new ProductsInCart(this.cart);
            const products = await view.draw();
            //render bloc with total price

            thumb.append(products);
        } else {
            const alternativeTxt = document.createElement('p');
            alternativeTxt.classList.add('alternative-txt');
            alternativeTxt.textContent = 'Your Cart is Empty';
            thumb.append(alternativeTxt);
        }
        this.container.append(thumb);
        return this.container;
    }
}

export default CartPage;
