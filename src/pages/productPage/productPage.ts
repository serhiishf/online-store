import TemplatePage from '../templatePage';

class ProductPage extends TemplatePage {
    productId: string | null;
    static textObject = {
        prodThumb: 'product__thumb',
        title: 'Product page!',
        //names of classes, text contents
    };

    constructor(pageId: string, productId: string | undefined) {
        super(pageId);
        this.productId = productId || null;
    }

    private async fetchProduct() {
        //test fetch foo:
        fetch(`https://dummyjson.com/products/${this.productId}`)
            .then((res) => res.json())
            .then(console.log);
    }

    render(): HTMLElement {
        this.fetchProduct();
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
