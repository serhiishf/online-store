import { Product as ProductType } from '../../../types';

export class Product {
    protected productsThumb: HTMLElement;

    constructor() {
        this.productsThumb = <HTMLElement>document.createElement('div');
    }

    private countPriceBeforeDiscount(price: number, discount: number): number {
        return Math.round((price * 100) / (100 - Math.round(discount)));
    }

    private createSlider(prodClone: HTMLElement, bigImage: HTMLImageElement, sliderThumb: HTMLElement) {
        sliderThumb.addEventListener('click', (e) => {
            const target = <HTMLElement>e.target;
            let activeImages = sliderThumb.querySelectorAll('.product__small-img.active');

            if (target.tagName === 'IMG') {
                if (activeImages.length > 0) {
                    activeImages[0].classList.remove('active');
                }
                target.classList.add('active');
                bigImage.src = (<HTMLImageElement>e.target).src;
            }
        });

        let buttonRight = <HTMLElement>prodClone.querySelector('#slideRight');
        let buttonLeft = <HTMLElement>prodClone.querySelector('#slideLeft');

        buttonLeft.addEventListener('click', function () {
            sliderThumb.scrollLeft -= 180;
        });

        buttonRight.addEventListener('click', function () {
            sliderThumb.scrollLeft += 180;
        });
    }

    public draw(data: ProductType): HTMLElement {
        const baseUrl = window.location.origin;
        this.productsThumb.innerHTML = '';

        const fragment = <DocumentFragment>document.createDocumentFragment();
        const productItemTemp = <HTMLTemplateElement>document.querySelector('#product-page');
        const prodClone = <HTMLElement>productItemTemp.content.cloneNode(true);

        //navidation:
        const pathCategoryEl = <HTMLLinkElement>prodClone.querySelector('.product__path-category');
        pathCategoryEl.href = `${baseUrl}/?category=${data.category.toLocaleLowerCase()}#/`;
        pathCategoryEl.textContent = data.category;

        const pathBrandEl = <HTMLLinkElement>prodClone.querySelector('.product__path-brand');
        pathBrandEl.href = `${baseUrl}/?category=${data.category}&brand=${data.brand.toLocaleLowerCase()}#/`;
        pathBrandEl.textContent = data.brand;

        (<HTMLLinkElement>prodClone.querySelector('.product__path-name')).textContent = data.title;

        //content:
        (<HTMLElement>prodClone.querySelector('.product__title')).textContent = data.title;
        (<HTMLElement>prodClone.querySelector('.product__brand')).textContent = data.brand;

        //big image:
        const imgEl = <HTMLImageElement>prodClone.querySelector('.product__img');
        imgEl.setAttribute('src', data.images[0]);
        imgEl.setAttribute('alt', data.title);

        //slider:
        const sliderThumb = <HTMLElement>prodClone.querySelector('#slider');
        data.images.forEach((imgUrl, i) => {
            const img = document.createElement('img');
            img.setAttribute('src', imgUrl);
            img.setAttribute('url', `image ${i}`);
            img.classList.add('product__small-img');
            if (i === 0) {
                img.classList.add('active');
            }
            sliderThumb.append(img);
        });

        this.createSlider(prodClone, imgEl, sliderThumb);

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
