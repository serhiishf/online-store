import './styles/index.scss';
import App from './pages/app/app';
//----Test code----------
import { testFunction } from './components/controller/testFile';
testFunction();
//-----------------------
const app = new App();
app.run();
