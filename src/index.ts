import './styles/index.scss';

//------------TEST CODE-------------------------
import { Loader } from './components/request/loader';
import { drawProducts } from './components/view/products/products';
enum Url {
    base = 'https://dummyjson.com',
    goods = '/products?limit=100',
    categories = '/products/categories',
}
const test = new Loader(Url, drawProducts);
//const test = new Loader('https://dummyjson.com/products/1', drawProducts);

test.callOnStrorageUpdated();
