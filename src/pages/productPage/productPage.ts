import { ErrorTypes, PagePath } from '../../types';
import TemplatePage from '../templatePage';

class ProductPage extends TemplatePage {
    productObj!: {};
    productId: string | null;

    static textObject = {
        prodThumb: 'product__thumb',
        title: 'Product page!',
    };

    constructor(pageName: string, productId: string | undefined) {
        super(pageName);
        this.productId = productId || null;
    }

    private async fetchProduct() {
        if (this.productId) {
            //test fetch foo:

            fetch(`https://dummyjson.com/products/${this.productId}`)
                .then((res) => {
                    if (res.status === ErrorTypes.Error_404) {
                        window.location.hash = '#' + PagePath.ErrorPage;
                    } else if (res.status === 200) {
                        return res.json();
                    }
                })
                .then((res) => (this.productObj = res));
        }
    }

    render(): HTMLElement {
        this.fetchProduct();
        console.log(this.productObj);
        const thumb = this.createPageHTML(ProductPage.textObject.prodThumb);
        //TODO: create and input here method to render page of product
        this.container.append(thumb);
        return this.container;
    }
}

export default ProductPage;
