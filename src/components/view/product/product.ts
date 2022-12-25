import { Product as ProductType } from '../../../types';

export class Product {
    protected productsThumb: HTMLElement;

    constructor() {
        this.productsThumb = <HTMLElement>document.createElement('div');
    }

    public draw(data: ProductType): HTMLElement {
        this.productsThumb.innerHTML = '';
        const fragment = <DocumentFragment>document.createDocumentFragment();
        const productItemTemp = <HTMLTemplateElement>document.querySelector('#product-page');
        const prodClone = <HTMLElement>productItemTemp.content.cloneNode(true);

        (<HTMLElement>prodClone.querySelector('.product__title')).textContent = data.title;
        (<HTMLElement>prodClone.querySelector('.product__brand')).textContent = data.brand;

        (<HTMLElement>prodClone.querySelector('.product__img')).setAttribute('src', data.images[0]);
        (<HTMLElement>prodClone.querySelector('.product__img')).setAttribute('alt', data.title);

        (<HTMLElement>prodClone.querySelector('.product__category')).textContent = `Category: ${data.category}`;
        (<HTMLElement>prodClone.querySelector('.product__rating')).textContent = `Rating: ${data.rating}`;
        (<HTMLElement>prodClone.querySelector('.product__description')).textContent = data.description;
        (<HTMLElement>prodClone.querySelector('.product__stock')).textContent = `In Stock: ${data.stock}`;

        (<HTMLElement>prodClone.querySelector('.product__price-origin')).textContent = `Price: ${data.price} $`;

        fragment.append(prodClone);
        this.productsThumb.appendChild(fragment);
        return this.productsThumb;
    }
}

/*
 <template id="product-page">
            <div>
                <h1 class="product__title"></h1>
                <span class="product__brand"></span>
            </div>
            <div class="product__img-thumb">
                <!-- img exmpl. feature toto: here will slider -->
                <img class="product__img" />
            </div>
            <div class="product__info-thumb">
                <p class="product__category"></p>
                <p class="product__rating"></p>
                <p class="product__description"></p>
                <p class="product__stock"></p>
            </div>
            <div class="product__price-thumb">
                <p class="product__price-origin"></p>
                <p class="product__price-with-discount"></p>
            </div>
            <div class="product__action-thumb">
                <button class="product__action-btn" type="button">Add to cart</button>
                <button class="product__action-btn" type="button">Buy now</button>
            </div>
        </template>
*/
