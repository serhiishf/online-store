import './styles/index.scss';

//------------TEST CODE-------------------------
import { Loader } from './components/request/loader';
import { drawProducts } from './components/view/products/products';
const test = new Loader('https://dummyjson.com/products?limit=100', drawProducts);

test.callOnStrorageUpdated();

