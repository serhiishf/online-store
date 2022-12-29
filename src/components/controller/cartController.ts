interface Product {
    id: number;
    count: number;
}

interface Cart {
    totalCount: number;
    totalPrice: number;
    products: Product[];
}

export class CartController {
    static createCart(id: number, price: number): Cart {
        return {
            totalCount: 1,
            totalPrice: price,
            products: [
                {
                    id,
                    count: 1,
                },
            ],
        };
    }

    static getCart(): string | null {
        return window.localStorage.getItem('cart');
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

    static addProduct(id: number, price: number): void {
        const cart: string | null = CartController.getCart();
        if (cart) {
            const cartParsed: Cart = JSON.parse(cart);
            cartParsed.totalCount += 1;
            cartParsed.totalPrice += price;
            const productPos: number = CartController.findProductPos(id);
            if (productPos >= 0) {
                cartParsed.products[productPos].count += 1;
            } else {
                cartParsed.products.push({ id, count: 1 });
            }
            window.localStorage.setItem('cart', JSON.stringify(cartParsed));
        } else {
            const newCart = CartController.createCart(id, price);
            window.localStorage.setItem('cart', JSON.stringify(newCart));
        }
    }

    static removeOneProductOneType(id: number, price: number) {
        const cart: string | null = CartController.getCart();
        if (cart) {
            const cartParsed: Cart = JSON.parse(cart);
            const productPos: number = CartController.findProductPos(id);
            if (productPos >= 0) {
                cartParsed.totalCount -= 1;
                cartParsed.totalPrice -= price;
                const prodCount = cartParsed.products[productPos].count;
                if (prodCount > 1) {
                    cartParsed.products[productPos].count -= 1;
                } else if (prodCount === 1) {
                    cartParsed.products.splice(productPos, 1);
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
                cartParsed.totalPrice -= price * prodCount;
                cartParsed.products.splice(productPos, 1);
            } else {
                console.log("You didn't add anything in Cart yet");
            }
            window.localStorage.setItem('cart', JSON.stringify(cartParsed));
        } else {
            console.log("You didn't add anything in Cart yet");
        }
    }
}
