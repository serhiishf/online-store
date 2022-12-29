interface Product {
    id: number;
    count: number;
}

interface Cart {
    totalCount: number;
    totalPrice: number;
    products: Product[];
}

export class cartController {
    static getCart(): string | null {
        return window.localStorage.getItem('cart');
    }

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

    static addProduct(id: number, price: number): void {
        const cart: string | null = cartController.getCart();
        if (cart) {
            const cartParsed: Cart = JSON.parse(cart);
            cartParsed.totalCount += 1;
            cartParsed.totalPrice += price;
            const productIdInCart: number = cartParsed.products.findIndex((el, i) => el.id === id && i);

            if (productIdInCart >= 0) {
                cartParsed.products[productIdInCart].count += 1;
            } else {
                cartParsed.products.push({ id, count: 1 });
            }
            window.localStorage.setItem('cart', JSON.stringify(cartParsed));
        } else {
            const newCart = cartController.createCart(id, price);
            window.localStorage.setItem('cart', JSON.stringify(newCart));
        }
    }
}
