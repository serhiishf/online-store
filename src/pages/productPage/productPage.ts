import { LoaderSingleProduct } from '../../components/controller/loaderSingleProduct';
import { Product } from '../../types';
import TemplatePage from '../templatePage';

class ProductPage extends TemplatePage {
    productObj!: Product;
    productId: string | null;

    static textObject = {
        prodThumb: 'product__thumb',
    };

    constructor(pageName: string, productId: string | undefined) {
        super(pageName);
        this.productId = productId || null;
    }

    private async fetchProduct() {
        if (this.productId) {
            this.productObj = await LoaderSingleProduct.fetchProduct(this.productId);
        }
    }

    public async render(): Promise<HTMLElement> {
        await this.fetchProduct();
        console.log(this.productObj);
        const thumb = this.createPageHTML(ProductPage.textObject.prodThumb);
        //TODO: create and input here method to render page of product
        this.container.append(thumb);
        return this.container;
    }
}

export default ProductPage;
