import cartPage from '../../../pages/cartPage';
import CartPage from '../../../pages/cartPage/cartPage';
import { Cart, Product, ProductInCart as IProductInCart } from '../../../types';
import { CartController } from '../../controller/cartController';
import { HeaderController } from '../../controller/headerController';
import { LoaderSingleProduct } from '../../controller/loaderSingleProduct';

export class ProductsInCart {
    protected items: IProductInCart[];
    protected listEl: HTMLUListElement;

    constructor(storageCart: Cart) {
        this.items = storageCart.products;
        this.listEl = document.createElement('ol');
        this.listEl.classList.add('cart__product-list');
    }

    private async getProducts() {
        try {
            const promises = this.items.map((el: IProductInCart) => LoaderSingleProduct.fetchProduct(el.id.toString()));
            const products: Product[] = await Promise.all(promises);
            return products;
        } catch (error) {
            let message: string = 'Restart the page!';
            if (typeof error === 'string') {
                message = error;
                error;
            } else if (error instanceof Error) {
                message = error.message;
            }
            console.log(`Something went wrong! ${message}`);
        }
    }

    private addOrRemoveProdAction(parentEl: HTMLElement, prodId: number, prodPrice: number, inStock: number) {
        const incrBtnEl = <HTMLButtonElement>parentEl.querySelector('.cart__product-count-incr');
        const decrBtnEl = <HTMLButtonElement>parentEl.querySelector('.cart__product-count-decr');
        const countEl = <HTMLElement>parentEl.querySelector('.cart__product-count');
        const priceEl = <HTMLElement>parentEl.querySelector('.cart__product-price-quantity');

        incrBtnEl.addEventListener('click', addProduct);
        decrBtnEl.addEventListener('click', () => removeProduct(this.listEl));

        function addProduct(): void {
            const prodQuantity = 1;
            CartController.addProduct(prodId, prodPrice, prodQuantity);
            HeaderController.changeViewOnCartAction();

            countEl.textContent = `${Number(<string>countEl.textContent) + prodQuantity}`;
            priceEl.textContent = `${Number(<string>priceEl.textContent) + prodPrice * prodQuantity}`;

            if (Number(countEl.textContent) === inStock) {
                incrBtnEl.disabled = true;
            }
        }

        function removeProduct(listEl: HTMLElement): void {
            const prodQuantity = 1;
            CartController.removeOneProductOneType(prodId, prodPrice, prodQuantity);
            HeaderController.changeViewOnCartAction();
            incrBtnEl.disabled = false;

            countEl.textContent = `${Number(<string>countEl.textContent) - prodQuantity}`;
            priceEl.textContent = `${Number(<string>priceEl.textContent) - prodPrice * prodQuantity}`;
            if (countEl.textContent === '0') {
                const parentElInDOM = <HTMLElement>document.querySelector(`#product-id-${prodId}`);
                parentElInDOM.remove();
            }
            const cartStorage = CartController.getCart();
            if (cartStorage) {
                const cart: Cart = JSON.parse(cartStorage);
                if (cart.totalCount === 0) {
                    const alternativeTxt = document.createElement('p');
                    alternativeTxt.classList.add('alternative-txt');
                    alternativeTxt.textContent = 'Your Cart is Empty';
                    listEl.append(alternativeTxt);
                }
            }
        }
    }

    public async draw() {
        const products = await this.getProducts();
        if (products) {
            const fragment = <DocumentFragment>document.createDocumentFragment();
            const template = <HTMLTemplateElement>document.querySelector('#product-in-cart');

            products.forEach((prod) => {
                const prodClone = <HTMLElement>template.content.cloneNode(true);
                (<HTMLImageElement>prodClone.querySelector('.cart__product-item')).setAttribute(
                    'id',
                    `product-id-${prod.id}`
                );
                //product image:
                const imgEl = <HTMLImageElement>prodClone.querySelector('.cart__product-img');
                imgEl.setAttribute('src', prod.thumbnail);
                imgEl.setAttribute('alt', prod.title);
                //product info:
                (<HTMLElement>prodClone.querySelector('.cart__product-title')).textContent = prod.title;
                (<HTMLElement>prodClone.querySelector('.cart__product-desc')).textContent = prod.description;
                (<HTMLElement>prodClone.querySelector('.cart__product-inf--rating')).textContent =
                    prod.rating.toString();
                (<HTMLElement>prodClone.querySelector('.cart__product-inf--discount')).textContent =
                    prod.discountPercentage.toString();
                (<HTMLElement>prodClone.querySelector('.cart__inf--stock')).textContent = prod.stock.toString();
                //how many in cart:
                const count: number | undefined = this.items.find((el) => el.id === prod.id)?.count;
                const countEl = <HTMLElement>prodClone.querySelector('.cart__product-count');
                countEl.textContent = count ? count.toString() : '1';
                //total price for one product*product quantity:
                const priceEl = <HTMLElement>prodClone.querySelector('.cart__product-price-quantity');
                priceEl.textContent = count ? `${prod.price * count}` : `${prod.price}`;

                //add + and - product in Cart
                this.addOrRemoveProdAction(prodClone, prod.id, prod.price, prod.stock);

                fragment.append(prodClone);
            });

            this.listEl.innerHTML = '';
            this.listEl.append(fragment);
        }

        return this.listEl;
    }
}
