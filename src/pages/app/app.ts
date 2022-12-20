import { ErrorTypes } from '../../types';
import ErrorPage from '../errorPage';
import MainPage from '../mainPage';
import ProductPage from '../productPage';
import TemplatePage from '../templatePage/templatePage';

const enum PageIds {
    MainPage = 'main-page',
    ProductPage = 'product-page',
    ErrorPage = 'error-page',
}

class App {
    private static container: HTMLElement = <HTMLElement>document.body.querySelector('#app');

    static renderNewPage(idPage: string) {
        App.container.innerHTML = '';
        let page: TemplatePage | null = null;

        if (idPage === PageIds.MainPage) {
            page = new MainPage(idPage);
        } else if (idPage === PageIds.ProductPage) {
            page = new ProductPage(idPage);
        } else {
            page = new ErrorPage(PageIds.ErrorPage, ErrorTypes.Error_404);
        }

        if (page) {
            const pageHTML = page.render();
            App.container.append(pageHTML);
        }
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash);
        });
    }

    run() {
        App.renderNewPage('main-page');
        this.enableRouteChange();
    }
}

export default App;
