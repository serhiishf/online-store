import { Product, ProductInCart as IProductInCart } from '../../../types';
import { LoaderSingleProduct } from '../../controller/loaderSingleProduct';

export class ProductsInCart {
    items: IProductInCart[];

    constructor(items: IProductInCart[]) {
        this.items = items;
    }

    public async draw() {
        const promises = this.items.map((el: IProductInCart) => LoaderSingleProduct.fetchProduct(el.id.toString()));
        const products: Product[] = await Promise.all(promises);
        console.log(products);
        const ulEl = document.createElement('ul');
        ulEl.innerHTML = `<li>
            <p>${products[0].title}</p>
            </li>`;
        return ulEl;
    }
}
