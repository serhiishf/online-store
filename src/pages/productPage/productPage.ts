import TemplatePage from '../templatePage';

class ProductPage extends TemplatePage {
    static TextObj = {
        mainTitle: 'Product Page',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createPageHTML(ProductPage.TextObj.mainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default ProductPage;
