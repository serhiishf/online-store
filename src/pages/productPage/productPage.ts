import TemplatePage from '../templatePage';

class ProductPage extends TemplatePage {
    static TextObject = {
        prodThumb: 'product__thumb',
        //names of classes, text contents
    };

    constructor(id: string) {
        super(id);
    }

    render(): HTMLElement {
        const thumb = this.createPageHTML(ProductPage.TextObject.prodThumb);
        //TODO: create and input here method to render page of product
        this.container.append(thumb);
        return this.container;
    }
}

export default ProductPage;
