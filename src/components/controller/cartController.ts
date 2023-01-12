import { Cart } from '../../types';

export class CartController {
  static createCart(): Cart {
    const newCart = {
      totalCount: 0,
      oneTypeProductCount: 0,
      totalPrice: 0,
      products: [],
      discount: 0,
      totalPriceAfterDiscount: null,
      activeDiscountCodes: [],
    };
    window.localStorage.setItem('cart', JSON.stringify(newCart));
    return newCart;
  }

  static getCart(): string | null {
    return window.localStorage.getItem('cart');
  }

  static getTotalPriceAfterDiscount(): number | null {
    const cart: string | null = CartController.getCart();
    if (cart) {
      const cartParsed: Cart = JSON.parse(cart);
      return cartParsed.totalPriceAfterDiscount;
    } else {
      return null;
    }
  }

  static setDiscount(codeName: string, discount: number) {
    //params discount in %!!!
    const cart: string | null = CartController.getCart();
    if (cart) {
      const cartParsed: Cart = JSON.parse(cart);

      const discountObj = { [codeName]: discount };
      const isDiscountActive = cartParsed.activeDiscountCodes.find((el) => el[codeName]);

      if (!isDiscountActive) {
        cartParsed.activeDiscountCodes = [...cartParsed.activeDiscountCodes, discountObj];

        cartParsed.discount = cartParsed.discount + Math.ceil((discount / 100) * cartParsed.totalPrice);
        cartParsed.totalPriceAfterDiscount = cartParsed.totalPrice - cartParsed.discount;
      }

      window.localStorage.setItem('cart', JSON.stringify(cartParsed));
    }
  }

  static removeDiscount(codeName: string, discount: number) {
    //params discount in %!!!
    const cart: string | null = CartController.getCart();
    if (cart) {
      const cartParsed: Cart = JSON.parse(cart);
      const isDiscountActive = cartParsed.activeDiscountCodes.findIndex((el) => el[codeName]);

      if (isDiscountActive >= 0) {
        cartParsed.activeDiscountCodes.splice(isDiscountActive, 1);
        cartParsed.discount = cartParsed.discount - Math.ceil((discount / 100) * cartParsed.totalPrice);
        cartParsed.totalPriceAfterDiscount = cartParsed.totalPrice - cartParsed.discount;
      }
      window.localStorage.setItem('cart', JSON.stringify(cartParsed));
    }
  }

  static findProductPos(id: number): number {
    const cart: string | null = CartController.getCart();
    if (cart) {
      const cartParsed: Cart = JSON.parse(cart);
      const productIdInCart: number = cartParsed.products.findIndex((el) => el.id === id);

      if (productIdInCart >= 0) {
        return productIdInCart;
      }
    }
    return -1;
  }

  static addProduct(id: number, price: number, quantity: number = 1): void {
    const cart: string | null = CartController.getCart();
    if (cart) {
      const cartParsed: Cart = JSON.parse(cart);
      cartParsed.totalCount += quantity;
      cartParsed.totalPrice += price * quantity;

      if (cartParsed.activeDiscountCodes.length > 0) {
        cartParsed.discount = 0;

        cartParsed.activeDiscountCodes.forEach((el) => {
          const discount = Object.values(el)[0];
          cartParsed.discount = cartParsed.discount + Math.ceil((discount / 100) * cartParsed.totalPrice);
        });
        cartParsed.totalPriceAfterDiscount = cartParsed.totalPrice - cartParsed.discount;
      }

      const productPos: number = CartController.findProductPos(id);
      if (productPos >= 0) {
        cartParsed.products[productPos].count += quantity;
      } else {
        cartParsed.oneTypeProductCount += 1;
        cartParsed.products.push({ id, count: quantity });
      }
      window.localStorage.setItem('cart', JSON.stringify(cartParsed));
    } else {
      CartController.createCart();
      CartController.addProduct(id, price);
    }
  }

  static removeOneProductOneType(id: number, price: number, quantity: number = 1) {
    const cart: string | null = CartController.getCart();
    if (cart) {
      const cartParsed: Cart = JSON.parse(cart);

      const productPos: number = CartController.findProductPos(id);
      if (productPos >= 0) {
        cartParsed.totalCount -= quantity;
        cartParsed.totalPrice -= price * quantity;
        const prodCount = cartParsed.products[productPos].count;
        if (prodCount > 1) {
          cartParsed.products[productPos].count -= quantity;
        } else if (prodCount === 1) {
          cartParsed.products.splice(productPos, 1);
          cartParsed.oneTypeProductCount -= 1;
        }

        if (cartParsed.activeDiscountCodes.length > 0) {
          cartParsed.discount = 0;

          cartParsed.activeDiscountCodes.forEach((el) => {
            const discount = Object.values(el)[0];
            cartParsed.discount = cartParsed.discount + Math.ceil((discount / 100) * cartParsed.totalPrice);
          });

          cartParsed.totalPriceAfterDiscount = cartParsed.totalPrice - cartParsed.discount;
        }
      } else {
        console.log("You didn't add anything in Cart yet");
      }
      window.localStorage.setItem('cart', JSON.stringify(cartParsed));
    } else {
      console.log("You didn't add anything in Cart yet");
    }
  }

  static removeAllProductsOneType(id: number, price: number) {
    const cart: string | null = CartController.getCart();
    if (cart) {
      const cartParsed: Cart = JSON.parse(cart);
      const productPos: number = CartController.findProductPos(id);
      if (productPos >= 0) {
        const prodCount = cartParsed.products[productPos].count;
        cartParsed.totalCount -= prodCount;
        cartParsed.oneTypeProductCount -= 1;
        cartParsed.totalPrice -= price * prodCount;
        cartParsed.products.splice(productPos, 1);

        if (cartParsed.activeDiscountCodes.length > 0) {
          cartParsed.discount = 0;

          cartParsed.activeDiscountCodes.forEach((el) => {
            const discount = Object.values(el)[0];
            cartParsed.discount = cartParsed.discount + Math.ceil((discount / 100) * cartParsed.totalPrice);
          });

          cartParsed.totalPriceAfterDiscount = cartParsed.totalPrice - cartParsed.discount;
        }
      } else {
        console.log("You didn't add anything in Cart yet");
      }
      window.localStorage.setItem('cart', JSON.stringify(cartParsed));
    } else {
      console.log("You didn't add anything in Cart yet");
    }
  }
}
