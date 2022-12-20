class App {
    private container: HTMLElement;
    constructor() {
        this.container = <HTMLElement>document.body.querySelector('#app');
    }
    run() {
        this.container.innerText = 'Single Page App';
    }
}

export default App;
