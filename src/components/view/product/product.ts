import { Product as ProductType } from '../../../types';

export class Product {
    protected productsThumb: HTMLElement;

    constructor() {
        this.productsThumb = <HTMLElement>document.createElement('div');
    }

    private countPriceBeforeDiscount(price: number, discount: number): number {
        return Math.round((price * 100) / (100 - Math.round(discount)));
    }

    public draw(data: ProductType): HTMLElement {
        const baseUrl = window.location.origin;
        this.productsThumb.innerHTML = '';

        const fragment = <DocumentFragment>document.createDocumentFragment();
        const productItemTemp = <HTMLTemplateElement>document.querySelector('#product-page');
        const prodClone = <HTMLElement>productItemTemp.content.cloneNode(true);

        //navidation:
        const pathCategoryEl = <HTMLLinkElement>prodClone.querySelector('.product__path-category');
        pathCategoryEl.href = `${baseUrl}/?category=${data.category}#/`;
        pathCategoryEl.textContent = data.category;

        const pathBrandEl = <HTMLLinkElement>prodClone.querySelector('.product__path-brand');
        pathBrandEl.href = `${baseUrl}/?category=${data.category}&brand=${data.brand.toLocaleLowerCase()}#/`;
        pathBrandEl.textContent = data.brand;

        (<HTMLLinkElement>prodClone.querySelector('.product__path-name')).textContent = data.title;

        //content:
        (<HTMLElement>prodClone.querySelector('.product__title')).textContent = data.title;
        (<HTMLElement>prodClone.querySelector('.product__brand')).textContent = data.brand;

        //image slider:
        const imgEl = <HTMLElement>prodClone.querySelector('.product__img');
        imgEl.setAttribute('src', data.images[0]);
        imgEl.setAttribute('alt', data.title);

        //content:
        (<HTMLElement>prodClone.querySelector('.product__category')).textContent = `Category: ${data.category}`;
        (<HTMLElement>prodClone.querySelector('.product__rating')).textContent = `Rating: ${data.rating}`;
        (<HTMLElement>prodClone.querySelector('.product__description')).textContent = data.description;
        (<HTMLElement>prodClone.querySelector('.product__stock')).textContent = `In Stock: ${data.stock}`;

        //price and discount:
        (<HTMLElement>prodClone.querySelector('.product__price-discount')).textContent = `-${Math.round(
            data.discountPercentage
        )}%`;
        (<HTMLElement>prodClone.querySelector('.product__price')).textContent = `${data.price} $`;
        (<HTMLElement>(
            prodClone.querySelector('.product__price-before-discount')
        )).textContent = `${this.countPriceBeforeDiscount(data.price, data.discountPercentage)} $`;

        fragment.append(prodClone);
        this.productsThumb.appendChild(fragment);
        return this.productsThumb;
    }
}
