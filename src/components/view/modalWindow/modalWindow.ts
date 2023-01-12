import { Callback } from '../../../types/Callbacks';
import App from '../../../pages/app/app';
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
    
    const personWrap = <HTMLElement>modalWindow.querySelector('.modal__person-data-wrap');
    const creditWrap = <HTMLElement>modalWindow.querySelector('.modal__credit-card');
    const modalConfirmationAlert = <HTMLElement>modalWindow.querySelector('.modal__confirmation-alert')
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

    //address 
    const address = <HTMLInputElement>modalWindow.querySelector('.modal__address');

    //email
    const email = <HTMLInputElement>modalWindow.querySelector('.modal__email');

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

    //confirm form
    const btnConfirm = <HTMLElement>modalWindow.querySelector('.modal__btn_confirm');
    btnConfirm.addEventListener('click', () => {
      let permition = true;
      //validate name
      const errorMsgName = <HTMLElement>document.querySelector('.modal__input-description_name');
      if(!nameInput.validity.valid) {
        if(errorMsgName){
          errorMsgName.classList.add('modal__input-description_active');
          permition = false;
        }
      } else {
        if(errorMsgName){
          errorMsgName.classList.remove('modal__input-description_active');
        }
      }
    

    //validate number
    const errorMsgPhone = <HTMLElement>document.querySelector('.modal__input-description_phone');
    if(!phone.validity.valid) {
      if(errorMsgPhone){
        errorMsgPhone.classList.add('modal__input-description_active');
        permition = false;
      }
    } else {
      if(errorMsgPhone){
        errorMsgPhone.classList.remove('modal__input-description_active');
      }
  }

  //validate address
  const errorMsgAddress = <HTMLElement>document.querySelector('.modal__input-description_address');
    if (!address.validity.valid) {
      if (errorMsgAddress){
        errorMsgAddress.classList.add('modal__input-description_active');
        permition = false;
      }
    } else {
      if(errorMsgAddress){
        errorMsgAddress.classList.remove('modal__input-description_active');
      }
  }
  //validate email
  const errorMsgEmail = <HTMLElement>document.querySelector('.modal__input-description_email');
    if (!email.validity.valid) {
      if (errorMsgEmail){
        errorMsgEmail.classList.add('modal__input-description_active');
        permition = false;
      }
    } else {
      if(errorMsgEmail){
        errorMsgEmail.classList.remove('modal__input-description_active');
      }
  }
  //validate cardnumber
  const errorMsgCardNum = <HTMLElement>document.querySelector('.modal__input-description_number');
    if (!cardNumber.validity.valid) {
      if (errorMsgCardNum){
        errorMsgCardNum.classList.add('modal__input-description_active');
        permition = false;
      }
    } else {
      if(errorMsgCardNum){
        errorMsgCardNum.classList.remove('modal__input-description_active');
      }
  }
  //validate card exp
  const errorMsgCardExp = <HTMLElement>document.querySelector('.modal__input-description_exp');
    if (!cardExp.validity.valid) {
      if (errorMsgCardExp){
        errorMsgCardExp.classList.add('modal__input-description_active');
        permition = false;
      }
    } else {
      if(errorMsgCardExp){
        errorMsgCardExp.classList.remove('modal__input-description_active');
      }
  }
  //validate card cvv
  const errorMsgCardCvv = <HTMLElement>document.querySelector('.modal__input-description_cvv');
    if (!cardCvv.validity.valid) {
      if (errorMsgCardCvv){
        errorMsgCardCvv.classList.add('modal__input-description_active');
        permition = false;
      }
    } else {
      if(errorMsgCardCvv){
        errorMsgCardCvv.classList.remove('modal__input-description_active');
      }
  }

  if(permition === false) {
    personWrap.remove();
    creditWrap.remove();
    btnConfirm.remove();
    modalConfirmationAlert.classList.add('modal__confirmation-alert_active');
    localStorage.clear();
    setTimeout(() => {
      const baseUrl = window.location.origin + '/';
      window.history.pushState('object or string', 'Title', baseUrl);
      const app = new App();
      app.run();
      location.reload();
    }, 3000) 
  }
  
  })
    

    return modalWindow;
  }

}