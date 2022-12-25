abstract class TemplatePage {
    protected container: HTMLElement;
    static textObject = {};

    constructor(pageName: string) {
        this.container = document.createElement('div');
        this.container.classList.add(pageName.slice(1) || 'main');
    }

    protected createPageHTML(className: string): HTMLDivElement {
        const thumb: HTMLDivElement = document.createElement('div');
        thumb.classList.add(className);
        return thumb;
    }

    async render() {
        return this.container;
    }
}

export default TemplatePage;
