import { LoaderSingleProduct } from '../../components/controller/loaderSingleProduct';
import { Product } from '../../components/view/product';
import { Product as ProductType } from '../../types';
import TemplatePage from '../templatePage';

class ProductPage extends TemplatePage {
    productObj!: ProductType;
    view: Product;
    productId: string | null;

    static textObject = {
        prodThumb: 'product__thumb',
    };

    constructor(pageName: string, productId: string | undefined) {
        super(pageName);
        this.productId = productId || null;
        this.view = new Product();
    }

    private async fetchProduct() {
        if (this.productId) {
            this.productObj = await LoaderSingleProduct.fetchProduct(this.productId);
        }
    }

    public async render(): Promise<HTMLElement> {
        await this.fetchProduct();
        const thumb = this.createPageHTML(ProductPage.textObject.prodThumb);
        const contentHTML = this.view.draw(this.productObj);
        thumb.append(contentHTML);
        this.container.append(thumb);
        return this.container;
    }
}

export default ProductPage;
