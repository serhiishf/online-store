abstract class TemplatePage {
    protected container: HTMLElement;
    static textObject = {};

    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.id = id;
    }

    protected createPageHTML(className: string): HTMLDivElement {
        const thumb: HTMLDivElement = document.createElement('div');
        thumb.classList.add(className);
        return thumb;
    }

    render() {
        return this.container;
    }
}

export default TemplatePage;
