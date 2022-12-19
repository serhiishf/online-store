//----Test File
import { Loader } from './loader';
//import { Products } from '../view/products/products';
import { FiltersType } from '../../types/Loader';
enum Url {
    base = 'https://dummyjson.com',
    goods = '/products?limit=100',
    categories = '/products/categories',
}
const test = new Loader(Url);
export async function testFunction() {
    //get data from api, render carts with goods
    await test.loadGoods();

    //get raw data
    const arr = test.rawData;

    //get arr with category and brands (this data we can use for render filters)
    console.log(test.getList(arr, FiltersType.category));
    console.log(test.getList(arr, FiltersType.brand));

    //get diapazone max min
    console.log(test.getMaxMin(arr, FiltersType.price));
    console.log(test.getMaxMin(arr, FiltersType.stock));

    //filter raw arr
/*     console.log(test.filterData(arr, FiltersType.category, 'smartphones'));
    console.log(test.filterData(arr, FiltersType.price, { max: 125, min: 12 })); */
}
