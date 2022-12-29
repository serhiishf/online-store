import { Product } from '../../../types';
import { cartController } from '../../controller/cartController';

export class Products {
    protected productsList: HTMLElement;

    constructor() {
        this.productsList = <HTMLElement>document.createElement('ul');
        this.productsList.classList.add('products');
    }

    private addEventListeners(cartBtn: HTMLButtonElement, id: number, price: number): void {
        cartBtn.addEventListener('click', addToLocalStorage);

        function addToLocalStorage(e: MouseEvent): void {
            e.preventDefault();
            cartController.addProduct(id, price);
            cartBtn.disabled = true;
            cartBtn.style.backgroundColor = '#f1d627';
            cartBtn.removeEventListener('click', addToLocalStorage);
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
                (<HTMLLinkElement>prodClone.querySelector('.card')).href = `${baseUrl}/?id=${item.id}#/product`;
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

                const AddToCartBtn = <HTMLButtonElement>prodClone.querySelector('.card__btn-cart');

                const productInCartPosition = cartController.findProductPos(item.id);

                if (productInCartPosition >= 0) {
                    AddToCartBtn.disabled = true;
                    AddToCartBtn.style.backgroundColor = '#f1d627';
                } else {
                    this.addEventListeners(AddToCartBtn, item.id, item.price);
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
