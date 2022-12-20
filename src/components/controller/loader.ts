import { Product } from '../../types/index';
import { UrlApi, JsonProducts, FiltersType, MaxMin, FilterCollection } from '../../types/Loader';

export class Loader {
    rawArr: Product[] = [];
    urlApi: UrlApi;
    flag = false;

    constructor(url: UrlApi) {
        this.urlApi = url;
    }

    async loadGoods() {
        this.flag = false;
        await fetch(`${this.urlApi.base}${this.urlApi.goods}`)
            .then(this.errorHandler)
            .then((responce) => responce.json())
            .then((data: JsonProducts) => {
                this.rawArr = data.products;
                this.flag = true;
                console.log(this.rawArr);
            });
    }

    errorHandler(res: Response) {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }
        return res;
    }

    checkFlag() {
        if (!this.flag) {
            console.log('Data hasn`t yet been recieved from the server');
            throw new Error('Data hasn`t yet been recieved from the server');
        }
    }

    get rawData() {
        this.checkFlag();
        return this.rawArr;
    }

    getList(goods: Product[], filtersType: FiltersType) {
        this.checkFlag();
        return Array.from(new Set(goods.map((elem) => elem[filtersType])));
    }

    getMaxMin(goods: Product[], filtersType: FiltersType.price | FiltersType.stock) {
        this.checkFlag();
        const result: MaxMin = {
            max: 0,
            min: 0,
        };
        result.max = Math.max(...(this.getList(goods, filtersType) as number[]));
        result.min = Math.min(...(this.getList(goods, filtersType) as number[]));
        return result;
    }

    getFilterData(goods: Product[], filterType: FiltersType, param: string | MaxMin) {
        if (typeof param === 'string') {
            return goods.filter((elem) => elem[filterType] === param);
        } else {
            return goods.filter((elem) => elem[filterType] >= param.min && elem[filterType] <= param.max);
        }
    }

    facetedFilter(goods: Product[], data: FilterCollection[] ){
        let result: Product[] = goods;
        data.forEach(elem => {
            let accum: Product[] = [];
            if(Array.isArray(elem.keys)){
                elem.keys.forEach((key)=> {
                    const tempArr = this.getFilterData(result, elem.type, key);
                    accum = [...accum, ...tempArr]
                })
            } else {
            const tempArr = this.getFilterData(result, elem.type, elem.keys);
            accum = [...accum, ...tempArr]
            }
            result = accum;
        })
        return result
    }

}
