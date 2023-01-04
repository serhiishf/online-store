import { Product } from '../../../types';
import { CartController } from '../../controller/cartController';
import { HeaderController } from '../../controller/headerController';
//TODO: add better animation on adding and removing product from cart

export class Products {
    protected productsList: HTMLElement;

    constructor() {
        this.productsList = <HTMLElement>document.createElement('ul');
        this.productsList.classList.add('products');
    }

    private static addListenerToAddProduct(cartBtn: HTMLButtonElement, id: number, price: number): void {
        cartBtn.addEventListener('click', addProduct);

        function addProduct(e: MouseEvent): void {
            e.preventDefault();
            CartController.addProduct(id, price);
            cartBtn.classList.add('card__btn-cart--active');
            HeaderController.changeViewOnCartAction();
            Products.addListenerToRemoveProduct(cartBtn, id, price);
            cartBtn.removeEventListener('click', addProduct);
        }
    }

    private static addListenerToRemoveProduct(cartBtn: HTMLButtonElement, id: number, price: number) {
        cartBtn.addEventListener('click', removeProduct);

        function removeProduct(e: MouseEvent) {
            e.preventDefault();
            CartController.removeAllProductsOneType(id, price);
            cartBtn.classList.remove('card__btn-cart--active');
            HeaderController.changeViewOnCartAction();
            Products.addListenerToAddProduct(cartBtn, id, price);
            cartBtn.removeEventListener('click', removeProduct);
        }
    }

    public draw(data: Product[] | []): HTMLElement {
        const products = [...data];
        const fragment = <DocumentFragment>document.createDocumentFragment();
        const productItemTemp = <HTMLTemplateElement>document.querySelector('#product-item');
        const baseUrl = window.location.origin;

        if (products.length > 0) {
            products.forEach((item: Product) => {
                const prodClone = <HTMLElement>productItemTemp.content.cloneNode(true);
                (<HTMLLinkElement>prodClone.querySelector('.card')).href = `${baseUrl}?id=${item.id}#/product`;
                (<HTMLElement>prodClone.querySelector('.card__title')).textContent = item.title;
                (<HTMLElement>prodClone.querySelector('.card__brand')).textContent = item.brand;
                (<HTMLElement>prodClone.querySelector('.card__image')).setAttribute(
                    'src',
                    item.thumbnail || './assets/img/default-image.png'
                );
                (<HTMLElement>prodClone.querySelector('.card__image')).setAttribute('alt', item.title);
                (<HTMLElement>prodClone.querySelector('.card__desc')).textContent = item.description;
                (<HTMLElement>prodClone.querySelector('.card__stock')).textContent = `In stock: ${item.stock}`;
                (<HTMLElement>prodClone.querySelector('.card__price')).textContent = `${item.price} $`;
                (<HTMLElement>(
                    (<HTMLElement>prodClone.querySelector('.card__icon-cart')).firstElementChild
                )).setAttribute('href', './assets/sprite.svg#to-cart');

                const addToCartBtn = <HTMLButtonElement>prodClone.querySelector('.card__btn-cart');

                const productInCartPosition = CartController.findProductPos(item.id);

                if (productInCartPosition >= 0) {
                    addToCartBtn.classList.add('card__btn-cart--active');
                    Products.addListenerToRemoveProduct(addToCartBtn, item.id, item.price);
                } else {
                    Products.addListenerToAddProduct(addToCartBtn, item.id, item.price);
                }

                fragment.append(prodClone);
            });

            this.productsList.innerHTML = '';
            this.productsList.appendChild(fragment);
        } else {
            const p: HTMLParagraphElement = document.createElement('p');
            p.textContent = 'No results';
            this.productsList.innerHTML = '';
            this.productsList.after(p);
        }

        return this.productsList;
    }
}
