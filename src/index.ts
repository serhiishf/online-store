import './styles/index.scss';

//------------TEST CODE-------------------------
import { Loader } from './components/request/loader';
import { drawProducts } from './components/view/products/products';
import { FiltersType } from './types/Loader';
enum Url {
    base = 'https://dummyjson.com',
    goods = '/products?limit=100',
    categories = '/products/categories',
}
const test = new Loader(Url, drawProducts);
async function testFunction() {
    //get data from api, render carts with goods
    await test.callOnStrorageUpdated();

    //get raw data
    const arr = test.rawData;

    //get arr with category and brands (this data we can use for render filters)
    console.log(test.getList(arr, FiltersType.category));
    console.log(test.getList(arr, FiltersType.brand));

    //get diapazone max min
    console.log(test.getMaxMin(arr, FiltersType.price));
    console.log(test.getMaxMin(arr, FiltersType.stock));

    //filter raw arr
    console.log(test.filterData(arr, FiltersType.category, 'smartphones'));
    console.log(test.filterData(arr, FiltersType.price, { max: 125, min: 12 }));
}
testFunction();
