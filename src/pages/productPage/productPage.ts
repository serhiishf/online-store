import TemplatePage from '../templatePage';

class ProductPage extends TemplatePage {
    static textObject = {
        prodThumb: 'product__thumb',
        title: 'Product page!',
        //names of classes, text contents
    };

    constructor(id: string) {
        super(id);
    }

    render(): HTMLElement {
        const thumb = this.createPageHTML(ProductPage.textObject.prodThumb);
        const title = document.createElement('h1');
        title.textContent = ProductPage.textObject.title;
        thumb.append(title);
        //TODO: create and input here method to render page of product
        this.container.append(thumb);
        return this.container;
    }
}

export default ProductPage;
