import { ErrorTypes } from '../../types';
import ErrorPage from '../errorPage';
import MainPage from '../mainPage';
import ProductPage from '../productPage';
import TemplatePage from '../templatePage/templatePage';

const enum PagePath {
    MainPage = '/',
    ProductPage = '/product',
    ErrorPage = '/error',
}
//===============================
export const parseRequestUrl = () => {
    // Convert location hash into an url.
    const path = location.hash.slice(2).toLowerCase() || '/';
    const params = path.split('/');

    // Build request variable.
    const request = {
        page: params[0] || null,
        id: params[1] || null,
    };
    return request;
};
//==================
class App {
    private static container: HTMLElement = <HTMLElement>document.body.querySelector('#app');

    constructor() {
        window.addEventListener('hashchange', this.router);
        window.addEventListener('load', this.router);
    }

    router() {
        const { page, id } = parseRequestUrl();
        const path = (page ? '/' + page : '/') + (id ? '/:id' : '');
        App.renderNewPage(path);
    }

    static renderNewPage(pageHash: string): void {
        App.container.innerHTML = '';
        let page: TemplatePage | null = null;

        if (pageHash === PagePath.MainPage) {
            page = new MainPage(pageHash);
        } else if (pageHash === PagePath.ProductPage) {
            page = new ProductPage(pageHash);
        } else {
            page = new ErrorPage(PagePath.ErrorPage, ErrorTypes.Error_404);
        }

        if (page) {
            const pageHTML = page.render();
            App.container.append(pageHTML);
        }
    }

    run() {
        this.router();
    }
}

export default App;
