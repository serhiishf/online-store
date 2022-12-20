import TemplatePage from '../templatePage';

class MainPage extends TemplatePage {
    static TextObj = {
        mainTitle: 'Main Page',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const title = this.createPageHTML(MainPage.TextObj.mainTitle);
        this.container.append(title);
        return this.container;
    }
}

export default MainPage;
