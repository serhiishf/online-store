import { Cart } from '../../types';
import { CartController } from './cartController';

export class CartSummaryController {
  public static updateComponentOnAction() {
    const cart: Cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;

    const totalAfterPriceEl = <HTMLElement>document.querySelector('.cart__summary-data--price-after');
    const totalPriceEl = <HTMLElement>document.querySelector('.cart__summary-data--price');

    if (cart?.activeDiscountCodes.length > 0) {
      totalAfterPriceEl.textContent = `${<number>cart.totalPriceAfterDiscount} $`;
      totalPriceEl.textContent = `${cart.totalPrice} $`;
    } else {
      totalPriceEl.textContent = `${cart.totalPrice} $`;
    }
  }
}
