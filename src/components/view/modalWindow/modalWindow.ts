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