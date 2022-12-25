import { parseRequestUrl } from '../../components/controller/parseRequestUrl';
import { ErrorTypes, PagePath, UrlParams } from '../../types';
import ErrorPage from '../errorPage';
import MainPage from '../mainPage';
import ProductPage from '../productPage';

class App {
    private static container: HTMLElement = <HTMLElement>document.body.querySelector('#app');

    constructor() {
        window.addEventListener('hashchange', this.router);
        // window.addEventListener('load', this.router);
    }

    router() {
        App.renderNewPage(parseRequestUrl());
    }

    static async renderNewPage(params: UrlParams): Promise<void> {
        App.container.innerHTML = '';
        let page: MainPage | ProductPage | ErrorPage;

        if (params.page === PagePath.MainPage) {
            page = new MainPage(params.page);
        } else if (params.page === PagePath.ProductPage) {
            page = new ProductPage(params.page, params.id);
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
