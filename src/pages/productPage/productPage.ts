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
        const title = document.createElement('h1');
        title.textContent = 'Product page!';
        thumb.append(title);
        //TODO: create and input here method to render page of product
        this.container.append(thumb);
        return this.container;
    }
}

export default ProductPage;
