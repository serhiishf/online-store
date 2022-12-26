import { ErrorTypes, PagePath } from '../../types';

export class LoaderSingleProduct {
    static async fetchProduct(id: string) {
        try {
            const resp = await fetch(`https://dummyjson.com/products/${id}`);
            if (resp.status === ErrorTypes.Error_404) {
                window.location.hash = '#' + PagePath.ErrorPage;
            } else if (resp.status === 200) {
                return resp.json();
            }
        } catch (error) {
            console.log('error', error);
        }
    }
}
