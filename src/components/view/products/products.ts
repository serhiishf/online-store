import { ids } from 'webpack';
import { Product } from '../../../types';

interface Cart {
    totalCount: number;
    totalPrice: number;
    products: {
        id: number;
        count: number;
    }[];
}

export class Products {
    protected productsList: HTMLElement;

    constructor() {
        this.productsList = <HTMLElement>document.createElement('ul');
        this.productsList.classList.add('products');
    }

    private addEventListeners(cartBtn: HTMLElement, id: number, price: number): void {
        cartBtn.addEventListener('click', addToLocalStorage);

        function addToLocalStorage(e: MouseEvent): void {
            e.preventDefault();

            if (window.localStorage.getItem('cart')) {
                const cart: Cart = JSON.parse(<string>window.localStorage.getItem('cart'));
                cart.totalCount += 1;
                cart.totalPrice += price;
                //check if id is already exist in cart.produsts. if yes - +=1 to count
                cart.products.push({ id, count: 1 });
                window.localStorage.setItem('cart', JSON.stringify(cart));
                // console.log('updated cart', JSON.parse(<string>window.localStorage.getItem('cart')));
            } else {
                const cart: Cart = {
                    totalCount: 1,
                    totalPrice: price,
                    products: [
                        {
                            id,
                            count: 1,
                        },
                    ],
                };
                window.localStorage.setItem('cart', JSON.stringify(cart));
                // console.log('new cart', JSON.parse(<string>window.localStorage.getItem('cart')));
            }
            cartBtn.removeEventListener('click', addToLocalStorage);
        }
    }

    public draw(data: Product[] | []): HTMLElement {
        const products = [...data];
        const fragment = <DocumentFragment>document.createDocumentFragment();
        const productItemTemp = <HTMLTemplateElement>document.querySelector('#product-item');
        const baseUrl = window.location.origin;

        if (products.length > 0) {
            //check localStorage. if we have already, don't add eventListener on this cart, render with yellow color on cart img
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

                this.addEventListeners(<HTMLElement>prodClone.querySelector('.card__btn-cart'), item.id, item.price);

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
