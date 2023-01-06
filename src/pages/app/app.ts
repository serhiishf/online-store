import { HeaderController } from '../../components/controller/headerController';
import { parseRequestUrl } from '../../components/controller/parseRequestUrl';
import { ErrorTypes, PagePath, UrlParams } from '../../types';
import CartPage from '../cartPage';
import ErrorPage from '../errorPage';
import MainPage from '../mainPage';
import ProductPage from '../productPage';

class App {
    private static container: HTMLElement = <HTMLElement>document.body.querySelector('#app');

    constructor() {
        window.addEventListener('load', HeaderController.changeViewOnCartAction);
        window.addEventListener('hashchange', this.router);
    }

    router() {
        App.renderNewPage(parseRequestUrl());
    }

    static async renderNewPage(params: UrlParams): Promise<void> {
        App.container.innerHTML = '';
        let page: MainPage | ProductPage | CartPage | ErrorPage;
        // const url = new URL(window.location.href);
        if (params.page === PagePath.MainPage) {
            // url.searchParams.forEach((_, key, parent) => {
            //     if (key === 'id' || key === 'limit' || key === 'page') {
            //         parent.delete(key);
            //     }
            // });
            // window.history.pushState(null, '', url.toString());
            page = new MainPage(params.page);
        } else if (params.page === PagePath.ProductPage) {
            // url.searchParams.forEach((_, key, parent) => {
            //     if (key !== 'id') {
            //         parent.delete(key);
            //     }
            // });
            // window.history.pushState(null, '', url.toString());
            page = new ProductPage(params.page, params.id);
        } else if (params.page === PagePath.CartPage) {
            // url.searchParams.forEach((_, key, parent) => {
            //     parent.delete(key);
            // });
            // window.history.pushState(null, '', url.toString());
            page = new CartPage(params.page);
        } else {
            page = new ErrorPage(PagePath.ErrorPage, ErrorTypes.Error_404);
        }

        if (page) {
            const pageHTML = await page.render();
            App.container.append(pageHTML);
        }
    }

    run() {
        this.router();
    }
}

export default App;
