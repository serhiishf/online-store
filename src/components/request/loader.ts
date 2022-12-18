import { Product } from '../../types/index';
import { Callback, JsonProducts, UrlApi, FiltersType } from '../../types/Loader';

export class Loader {
    rawArr: Product[] = [];
    onStorageUpdated: Callback<Product[]>;
    urlApi: UrlApi;
    flag = false;

    constructor(url: UrlApi, callback: Callback<Product[]>) {
        this.onStorageUpdated = callback;
        this.urlApi = url;
    }

    async loadGoods() {
        await fetch(`${this.urlApi.base}${this.urlApi.goods}`)
            .then(this.errorHandler)
            .then((responce) => responce.json())
            .then((data: JsonProducts) => {
                this.rawArr = data.products;
                this.flag = true;
                console.log(this.rawArr);
            });
    }

    async callOnStrorageUpdated() {
        await this.loadGoods();
        this.onStorageUpdated(this.rawArr);
    }

    errorHandler(res: Response) {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }
        return res;
    }

    getList(filtersType: FiltersType) {
        this.checkFlag();
        console.log(Array.from(new Set(this.rawArr.map((elem) => elem[filtersType]))));
        return Array.from(new Set(this.rawArr.map((elem) => elem[filtersType])));
    }

    checkFlag() {
        if (!this.flag) {
            console.log('Data hasn`t yet been recieved from the server');
            throw new Error('Data hasn`t yet been recieved from the server');
        }
    }
}
