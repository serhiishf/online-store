import './styles/index.scss';
import './assets/icons/sprite.svg';
import App from './pages/app';

function fixLocalStorageBug() {
  const cart = localStorage.getItem('cart');
  if(cart) {
    const cartObj = JSON.parse(cart);
    if(cartObj.discount !== undefined) {
      console.log('OK');
    } else {
      localStorage.clear();
    }
  }
}
fixLocalStorageBug()

const app = new App();
app.run();
