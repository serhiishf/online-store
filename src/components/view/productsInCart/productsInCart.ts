import { Cart, Product, ProductInCart as IProductInCart } from '../../../types';
import { LoaderSingleProduct } from '../../controller/loaderSingleProduct';

export class ProductsInCart {
    protected items: IProductInCart[];
    protected listEl: HTMLUListElement;
    // { products: IProductInCart[]}
    constructor(storageCart: Cart) {
        this.items = storageCart.products;
        this.listEl = document.createElement('ul');
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

    public async draw() {
        const products = await this.getProducts();
        if (products) {
            const fragment = <DocumentFragment>document.createDocumentFragment();
            const template = <HTMLTemplateElement>document.querySelector('#product-in-cart');

            products.forEach((prod) => {
                const prodClone = <HTMLElement>template.content.cloneNode(true);
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
                (<HTMLElement>prodClone.querySelector('.cart__product-count')).textContent = count
                    ? count.toString()
                    : '1';
                //total price for one product*product quantity:
                (<HTMLElement>prodClone.querySelector('.cart__product-price-quantity')).textContent = count
                    ? `${prod.price * count}`
                    : `${prod.price}`;

                //add + and - product in Cart
                // this.addOrRemoveProdAction(prodClone);

                fragment.append(prodClone);
            });

            this.listEl.innerHTML = '';
            this.listEl.append(fragment);
        }

        return this.listEl;
    }
}
