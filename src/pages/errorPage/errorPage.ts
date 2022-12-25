import { ErrorTypes } from '../../types';
import TemplatePage from '../templatePage';

class ErrorPage extends TemplatePage {
    private errorType: ErrorTypes | string;

    static textObject: { [prop: string]: string } = {
        pageThumb: 'page__thumb',
        '404': 'Error! Page was not found!',
    };
    constructor(id: string, errorType: ErrorTypes | string) {
        super(id);
        this.errorType = errorType;
    }

    async render() {
        const thumb = this.createPageHTML(ErrorPage.textObject.pageThumb);

        const title = document.createElement('h1');
        title.textContent = ErrorPage.textObject[this.errorType];

        thumb.append(title);
        this.container.append(thumb);
        return this.container;
    }
}

export default ErrorPage;
