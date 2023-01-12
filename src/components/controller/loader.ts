import { Product } from '../../types/index';
import { UrlApi, JsonProducts,  } from '../../types/Loader';

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

    
}
