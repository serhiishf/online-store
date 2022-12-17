import { Product } from '../../types/index';

interface JsonProducts {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export class Loader {
    private rawArr: Product[] = [];
    onStorageUpdated: (data: Product[]) => void;
    url: string;

    constructor(url: string, callback: (data: Product[]) => void) {
        this.onStorageUpdated = callback;
        this.url = url;
    }

    async loadGoods() {
       await fetch(`${this.url}`)
            .then((responce) => responce.json())
            .then((data: JsonProducts) => {
                this.rawArr = data.products;
            });
    }
    
    async callOnStrorageUpdated() {
        console.log('async callOnStrorageUpdated method work');
        await this.loadGoods();
        this.onStorageUpdated(this.rawArr);
    }

}
