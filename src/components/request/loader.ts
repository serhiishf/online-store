import { Product } from '../../types/index';
import { Callback, JsonProducts, UrlApi } from '../../types/Loader';

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

    get categories() {
        this.checkFlag();
        //TODO: finish this method
        return [];
    }

    checkFlag() {
        if (!this.flag) {
            console.log('Data hasn`t yet been recieved from the server');
            throw new Error('Data hasn`t yet been recieved from the server');
        }
    }
}
