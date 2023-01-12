import { Cart, Product as ProductType } from '../../../types';
import { CartController } from '../../controller/cartController';
import { clearSearchParams } from '../../controller/clearSearchParams';
import { HeaderController } from '../../controller/headerController';
import { parseRequestUrl } from '../../controller/parseRequestUrl';
//TODO: add render count of added product to cart and maybe input for changing this number

export class Product {
  protected productsThumb: HTMLElement;
  productData: ProductType;

  constructor(product: ProductType) {
    this.productsThumb = <HTMLElement>document.createElement('div');
    this.productData = product;
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
        this.createMagnify(bigImage, (<HTMLImageElement>e.target).src);
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

  private createMagnify(bigImage: HTMLImageElement, imgSrc: string) {
    const boxImg = <HTMLElement>bigImage.parentElement;
    const magnifyEl = <HTMLElement>bigImage.nextElementSibling;

    magnifyEl.style.backgroundImage = `url(${imgSrc})`;

    boxImg.addEventListener('mousemove', (e: MouseEvent) => magnifyOnMousemove(e, boxImg, bigImage, magnifyEl));
    function magnifyOnMousemove(
      e: MouseEvent,
      boxImg: HTMLElement,
      bigImage: HTMLImageElement,
      magnifyEl: HTMLElement
    ) {
      const x = e.pageX - boxImg.offsetLeft;
      const y = e.pageY - boxImg.offsetTop;

      let xPerc = (x / bigImage.width) * 100;
      let yPerc = (y / bigImage.height) * 100;

      // Add some margin for right edge
      if (x > 0.01 * bigImage.width) {
        xPerc += 0.15 * xPerc;
      }

      // Add some margin for bottom edge
      if (y >= 0.01 * bigImage.height) {
        yPerc += 0.15 * yPerc;
      }

      // Set the background of the magnified image horizontal
      magnifyEl.style.backgroundPositionX = xPerc - 9 + '%';
      // Set the background of the magnified image vertical
      magnifyEl.style.backgroundPositionY = yPerc - 9 + '%';

      // Move the magnifying glass with the mouse movement.
      magnifyEl.style.left = x - magnifyEl.clientWidth / 2 + 'px';
      magnifyEl.style.top = y - magnifyEl.clientWidth / 2 + 'px';
    }
  }

  private static actionsWithProduct(parentEl: HTMLElement, data: ProductType) {
    const addToCartBtn = <HTMLButtonElement>parentEl.querySelector('.product__action-btn--add-cart');
    const isProductInCart = CartController.findProductPos(data.id);
    addToCartBtn.textContent = isProductInCart === -1 ? 'Add to cart' : 'Drop from cart';
    if (isProductInCart >= 0) {
      Product.addListenerToRemoveProduct(addToCartBtn, data.id, data.price);
    } else {
      Product.addListenerToAddProduct(addToCartBtn, data.id, data.price);
    }
  }

  private static addListenerToAddProduct(cartBtn: HTMLButtonElement, id: number, price: number): void {
    cartBtn.addEventListener('click', addProduct);

    function addProduct(e: MouseEvent): void {
      CartController.addProduct(id, price);
      cartBtn.textContent = 'Drop from cart';
      HeaderController.changeViewOnCartAction();
      Product.addListenerToRemoveProduct(cartBtn, id, price);
      cartBtn.removeEventListener('click', addProduct);
    }
  }

  private static addListenerToRemoveProduct(cartBtn: HTMLButtonElement, id: number, price: number) {
    cartBtn.addEventListener('click', removeProduct);

    function removeProduct(e: MouseEvent) {
      CartController.removeAllProductsOneType(id, price);
      cartBtn.textContent = 'Add to cart';
      HeaderController.changeViewOnCartAction();
      Product.addListenerToAddProduct(cartBtn, id, price);
      cartBtn.removeEventListener('click', removeProduct);
    }
  }

  private onCategoryLinkClick(category: string): void {
    const url = new URL(window.location.href);
    clearSearchParams(url);
    url.searchParams.delete('id');
    url.searchParams.set('category', `${category}`);
    window.history.pushState(null, '', url.toString());
  }

  private obBrandLinkClick(category: string, brand: string): void {
    const url = new URL(window.location.href);
    clearSearchParams(url);
    url.searchParams.delete('id');
    url.searchParams.set('category', `${category}`);
    url.searchParams.set('brand', `${brand}`);

    window.history.pushState(null, '', url.toString());
  }

  private actionBuyNow(data: ProductType) {
    const cart: Cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;

    if (!cart) {
      CartController.createCart();
    }
    CartController.addProduct(data.id, data.price);
    HeaderController.changeViewOnCartAction();

    //   const pathname = window.location.href; //this gives me current Url
    const url = new URL(window.location.href);
    window.localStorage.setItem('pageUrl', JSON.stringify(url));
    window.history.pushState(null, '', url.toString());
    // window.history.go();
    // // window.history.replaceState({ prevUrl: window.location.href }, '', url.toString());
  }

  public draw(): HTMLElement {
    this.productsThumb.innerHTML = '';
    const data = this.productData;

    const fragment = <DocumentFragment>document.createDocumentFragment();
    const productItemTemp = <HTMLTemplateElement>document.querySelector('#product-page');
    const prodClone = <HTMLElement>productItemTemp.content.cloneNode(true);

    //navigation:
    (<HTMLElement>prodClone.querySelector('.product__path-main')).addEventListener('click', () => {
      const url = new URL(window.location.origin);
      url.searchParams.delete('id');
      window.history.pushState(null, '', url.toString());
    });

    const pathCategoryEl = <HTMLLinkElement>prodClone.querySelector('.product__path-category');
    pathCategoryEl.textContent = data.category;
    pathCategoryEl.addEventListener('click', () => this.onCategoryLinkClick(data.category.toLocaleLowerCase()));

    const pathBrandEl = <HTMLLinkElement>prodClone.querySelector('.product__path-brand');
    pathBrandEl.textContent = data.brand;
    pathBrandEl.addEventListener('click', () =>
      this.obBrandLinkClick(data.category.toLocaleLowerCase(), data.brand.toLocaleLowerCase())
    );

    (<HTMLLinkElement>prodClone.querySelector('.product__path-name')).textContent = data.title;

    //content:
    (<HTMLElement>prodClone.querySelector('.product__title')).textContent = data.title;
    (<HTMLElement>prodClone.querySelector('.product__brand')).textContent = data.brand;

    //big image:
    const imgEl = <HTMLImageElement>prodClone.querySelector('.product__img');
    imgEl.setAttribute('src', data.images[0]);
    imgEl.setAttribute('alt', data.title);
    this.createMagnify(imgEl, data.images[0]);

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

    //add product to cart logic:
    Product.actionsWithProduct(prodClone, data);
    (<HTMLButtonElement>prodClone.querySelector('.product__action-btn--buy-now')).addEventListener('click', () =>
      this.actionBuyNow(data)
    );

    fragment.append(prodClone);
    this.productsThumb.appendChild(fragment);
    return this.productsThumb;
  }
}
