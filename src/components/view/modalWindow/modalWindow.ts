import { Callback } from '../../../types/Callbacks';

export class ModalWindow {
  draw(callback:Callback) {
    const templateElem = <HTMLTemplateElement>document.querySelector('#modal');
    const modalWindow: HTMLElement = <HTMLElement>templateElem.content.cloneNode(true);
    const btnClose = <HTMLElement>modalWindow.querySelector('.modal__close-btn');
    btnClose.addEventListener('click', () => {
      (<HTMLElement>document.querySelector('.modal')).remove();
    });
    const visaCreditLogo = <HTMLInputElement>modalWindow.querySelector('.credit-card__logo_visa');
    const masterCreditLogo = <HTMLInputElement>modalWindow.querySelector('.credit-card__logo_mastercard');
    //name
    const nameInput = <HTMLInputElement>modalWindow.querySelector('.modal__name');
    nameInput.addEventListener('input', () => {
      const value = nameInput.value;

    })

    //phone
    const phone = <HTMLInputElement>modalWindow.querySelector('.modal__phone');
    phone.addEventListener('input', () => {
      const value = '+' + phone.value;
      phone.value = '+' + value.replace(/\D/g, '');
      phone.value = phone.value.slice(0, 18);
      if(phone.value.length === 1) {
        phone.value = '';
      }
    })

    //card number
    const cardNumber = <HTMLInputElement>modalWindow.querySelector('.credit-card__number');
    cardNumber.addEventListener('input', () => {
      const value = cardNumber.value;
      cardNumber.value = value.replace(/\D/g, '');
      cardNumber.value = cardNumber.value.slice(0, 16);
      if(value[0] === '4') {
        visaCreditLogo.classList.remove('credit-card__logo_disabled');
        masterCreditLogo.classList.add('credit-card__logo_disabled');
      } else if(value[0] === '5') {
        visaCreditLogo.classList.add('credit-card__logo_disabled');
        masterCreditLogo.classList.remove('credit-card__logo_disabled');
      } else {
        visaCreditLogo.classList.add('credit-card__logo_disabled');
        masterCreditLogo.classList.add('credit-card__logo_disabled');
      }
    })

    //card expiration
    const cardExp = <HTMLInputElement>modalWindow.querySelector('.credit-card__exp');
    cardExp.addEventListener('input', () => {
      const value = cardExp.value;
      const regExpD = /[0-9]/;
/*       const regExpFirstPart = /^(?:[0-1][1-2])\//;
      if(value === regExpFirstPart) {

      } */
      //cardExp.value = value.replace(/\D/g, '');
      if (cardExp.value[0] !== '0' && cardExp.value[0] !== '1') {
        cardExp.value = '';
      } else if(cardExp.value[0] === '1') {
        if(cardExp.value[1] !== '1' && cardExp.value[1] !== '2' ) {
          cardExp.value = cardExp.value.slice(0, 1);
        }
      }
      if(cardExp.value.length === 2) {
        cardExp.value = cardExp.value + '/';
      }
      if(!regExpD.test(cardExp.value[3])) {
        cardExp.value = cardExp.value.slice(0, 3)
      }
      if(!regExpD.test(cardExp.value[4])) {
        console.log('error')
        cardExp.value = cardExp.value.slice(0, 4)
      }
      if(cardExp.value.length > 5) {
        cardExp.value = cardExp.value.slice(0, 5);
      }
      
    })
    

    //card cvv
    const cardCvv = <HTMLInputElement>modalWindow.querySelector('.credit-card__cvv');
    cardCvv.addEventListener('input', () => {
      const value = cardCvv.value;
      cardCvv.value = value.replace(/\D/g, '');
      cardCvv.value = cardCvv.value.slice(0, 3);
    })


    return modalWindow;
  }
}