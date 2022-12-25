import { Product } from '../../../types';

export class Products {
    protected productsList: HTMLElement;

    constructor() {
        this.productsList = <HTMLElement>document.createElement('ul');
        this.productsList.classList.add('products');
    }

    public draw(data: Product[] | []): HTMLElement {
        const products = [...data]; // here we can filter data if we need it;
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
                    item.images[0] || './assets/img/default-image.png'
                );
                (<HTMLElement>prodClone.querySelector('.card__image')).setAttribute('alt', item.title);
                (<HTMLElement>prodClone.querySelector('.card__desc')).textContent = item.description;
                (<HTMLElement>prodClone.querySelector('.card__stock')).textContent = `In stock: ${item.stock}`;
                (<HTMLElement>prodClone.querySelector('.card__price')).textContent = `${item.price} $`;
                (<HTMLElement>(
                    (<HTMLElement>prodClone.querySelector('.card__icon-cart')).firstElementChild
                )).setAttribute('href', './assets/icons/sprite.svg#to-cart');
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
