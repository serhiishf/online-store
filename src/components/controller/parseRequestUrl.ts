import { UrlParams } from '../../types';

//TODO: change on class
export const parseRequestUrl = (): UrlParams => {
    const urlParams: UrlParams = { search: {}, page: '/' };

    const url = new URL(window.location.href);

    if (url.search !== '') {
        url.search
            .slice(1)
            .split('&')
            .forEach((el) => {
                const keyVal = el.split('=');
                if (keyVal[0] === 'id') {
                    urlParams.id = keyVal[1];
                } else {
                    urlParams.search[keyVal[0]] = keyVal[1];
                }
            });
    }
    urlParams.page = window.location.hash.slice(1).toLowerCase() || '/';
    console.log('parse url', urlParams)
    return urlParams;
};
