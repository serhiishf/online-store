import { Product } from '../../../types';

export class Products {
    public draw(data: Product[] | []): void {
        const products = [...data]; // here we can filter data if we need it;
        const fragment = <DocumentFragment>document.createDocumentFragment();
        const productItemTemp = <HTMLTemplateElement>document.querySelector('#product-item');
        const productsList = <HTMLElement>document.querySelector('.products');

        if (products.length > 0) {
            products.forEach((item: Product) => {
                const prodClone = <HTMLElement>productItemTemp.content.cloneNode(true);
                (<HTMLElement>prodClone.querySelector('.card__brand')).textContent = item.brand;
                (<HTMLElement>prodClone.querySelector('.card__title')).textContent = item.title;
                (<HTMLElement>prodClone.querySelector('.card__image')).setAttribute(
                    'src',
                    item.images[0] || './assets/img/default-image.png'
                );
                (<HTMLElement>prodClone.querySelector('.card__image')).setAttribute('alt', item.title);
                (<HTMLElement>prodClone.querySelector('.card__desc')).textContent = item.description;
                (<HTMLElement>prodClone.querySelector('.card__stock')).textContent = `In stock: ${item.stock}`;
                (<HTMLElement>prodClone.querySelector('.card__price')).textContent = `${item.price} $`;

                fragment.append(prodClone);
            });

            productsList.innerHTML = '';
            productsList.appendChild(fragment);
        } else {
            const p: HTMLParagraphElement = document.createElement('p');
            p.textContent = 'No results';
            productsList.innerHTML = '';
            productsList.after(p);
        }
    }
}
