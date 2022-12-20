import MainPage from '../mainPage';
import ProductPage from '../productPage';
import TemplatePage from '../templatePage/templatePage';

const enum PageIds {
    MainPage = 'main-page',
    ProductPage = 'product-page',
}

class App {
    private static container: HTMLElement = <HTMLElement>document.body.querySelector('#app');
    // private initialPage: MainPage;

    // constructor() {
    //     this.initialPage = new MainPage('main-page');
    // }

    static renderNewPage(idPage: string) {
        App.container.innerHTML = '';
        let page: TemplatePage | null = null;

        if (idPage === PageIds.MainPage) {
            page = new MainPage(idPage);
        } else if (idPage === PageIds.ProductPage) {
            page = new ProductPage(idPage);
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
