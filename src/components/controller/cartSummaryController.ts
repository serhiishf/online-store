import { Cart } from '../../types';
import { CartController } from './cartController';

export class CartSummaryController {
  public static updateComponentOnAction() {
    const cart: Cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;
    // const discountListEl = <HTMLUListElement>document.querySelector('.cart__summary-discount-list');
    // const totalAfterPriceThumbEl = <HTMLElement>document.querySelector('.cart__summary-desc--after');
    const totalAfterPriceEl = <HTMLElement>document.querySelector('.cart__summary-data--price-after');
    const totalPriceEl = <HTMLElement>document.querySelector('.cart__summary-data--price');

    if (cart?.activeDiscountCodes.length > 0) {
      totalAfterPriceEl.textContent = (<number>cart.totalPriceAfterDiscount).toString();
      totalPriceEl.textContent = cart.totalPrice.toString();
    } else {
      totalPriceEl.textContent = cart.totalPrice.toString();
    }
  }
}
