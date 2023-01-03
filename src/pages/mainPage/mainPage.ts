import TemplatePage from '../templatePage';
import { Loader } from '../../components/controller/loader';
import { Products } from '../../components/view/products';

//test URL:    (later will be class to parse info from URL string)
enum Url {
    base = 'https://dummyjson.com',
    goods = '/products?limit=10',
    categories = '/products/categories',
}

class MainPage extends TemplatePage {
    loader: Loader;
    view: Products;

    static textObject = {
        mainThumb: 'main__thumb',
        filters: 'filters',
    };

    constructor(id: string) {
        super(id);
        //test loader:
        this.loader = new Loader(Url);
        this.view = new Products();
    }

    async createProductsCards() {
        await this.loader.loadGoods();
        return this.view.draw(this.loader.rawData);
    }

    async render() {
        const thumb = this.createPageHTML(MainPage.textObject.mainThumb);

        const filters = this.createPageHTML(MainPage.textObject.filters);
        const products = await this.createProductsCards();

        thumb.append(filters, products);

        this.container.append(thumb);
        return this.container;
    }
}

export default MainPage;
