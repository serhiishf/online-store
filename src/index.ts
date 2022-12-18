import './styles/index.scss';

//------------TEST CODE-------------------------
import { Loader } from './components/request/loader';
import { drawProducts } from './components/view/products/products';
import { FiltersType } from './types/Loader'
enum Url {
    base = 'https://dummyjson.com',
    goods = '/products?limit=100',
    categories = '/products/categories',
}
const test = new Loader(Url, drawProducts);
async function testFunction() {
  //get data from api, render carts with goods
  await test.callOnStrorageUpdated();
  //get arr with category and brands
  await test.getList(FiltersType.category);
  await test.getList(FiltersType.brand);
}
testFunction()

