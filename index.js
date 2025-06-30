// ==UserScript==
// @name            better_pspay
// @namespace       http://tampermonkey.net/
// @version         0.8
// @description     hehе
// @match           https://p2p-paradise.info/
// @grant           none
// @author          vccuser
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @updateURL       https://openuserjs.org/meta/vccuser/better_pspay.meta.js
// @downloadURL     https://openuserjs.org/install/vccuser/better_pspay.user.js
// @copyright       2025, vccuser (https://openuserjs.org/users/vccuser)
// ==/UserScript==

(function() {
    'use strict';

    function getExchangeRates() {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', 'https://api.coinbase.com/v2/prices/USDT-RUB/spot', false)
        xmlHttp.send(null);
        return JSON.parse(xmlHttp.responseText);
    }

    // Функция для форматирования значения страхового баланса
    const formatBalance = (balance) => {
        // Делим на 100 и добавляем знак доллара
        const formattedBalance = (balance / 100).toFixed(2);
        return `$${formattedBalance}`;
    };

    const convertToRub = (value, rate) => {
        const formattedBalance = ((value / 100) * rate).toFixed(2);
        return `${formattedBalance}₽`;
    };

    const createDivElement = (name) => {
        const divElementContainer = document.createElement('div');
        divElementContainer.className = 'chakra-stack css-116s6jx';
        divElementContainer.innerHTML = `<h2 class="chakra-heading css-1jlbnaj">${name}</h2><div class="css-smlf7u" id="better"></div>`;
        return divElementContainer;

    };

    const createFrozenBalanceElement = (frozen_balance) => {
        const formattedFrozenBalance = formatBalance(frozen_balance);
        const balanceContainer = document.createElement('div');
        balanceContainer.className = 'chakra-stack css-1meq8zh';
        balanceContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${formattedFrozenBalance}</h2><p class="css-1tzeee1">Замороженный баланс</p></div>`;
        return balanceContainer;
    };

    const createInsuranceBalanceElement = (balance) => {
        const formattedBalance = formatBalance(balance);
        const balanceContainer = document.createElement('div');
        balanceContainer.className = 'chakra-stack css-1meq8zh';
        balanceContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${formattedBalance}</h2><p class="css-1tzeee1">Страховой баланс</p></div>`;
        return balanceContainer;
    };

    const createFailedTradesElement = (trades) => {
        const failedTradesContainer = document.createElement('div');
        failedTradesContainer.className = 'chakra-stack css-1meq8zh';
        failedTradesContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${trades}</h2><p class="css-1tzeee1">Истекших трейдов подряд</p></div>`;
        return failedTradesContainer;
    };

    const createAutoPayoutElement = (value) => {
        const autoPayoutContainer = document.createElement('div');
        switch (value) {
            case 0:
                value = 'Нет';
                break;
            case 1:
                value = 'Да';
                break;
            default:
                break;
        }
        autoPayoutContainer.className = 'chakra-stack css-1meq8zh';
        autoPayoutContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${value}</h2><p class="css-1tzeee1">Автопринятие откупов</p></div>`;
        return autoPayoutContainer;
    };

    const createPriorityElement = (value) => {
        const priorityContainer = document.createElement('div');
        switch (value) {
            case 0:
                value = 'Нет';
                break;
            case 1:
                value = 'Да';
                break;
            default:
                break;
        }
        priorityContainer.className = 'chakra-stack css-1meq8zh';
        priorityContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${value}</h2><p class="css-1tzeee1">Приоритет</p></div>`;
        return priorityContainer;
    };

    const createRubBalanceElement = (balance) => {
        const rubBalanceContainer = document.createElement('div');
        rubBalanceContainer.className = 'chakra-stack css-1meq8zh';
        rubBalanceContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${balance}</h2><p class="css-1tzeee1">Баланс в RUB</p></div>`;
        return rubBalanceContainer;
    }



    // Перехват XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (method === 'GET' && url === 'https://api.p2p-paradise.info/account' && document.URL === 'https://p2p-paradise.info/') {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response && response.account) {
                        const balance = response.account.balance;
                        const insuranceBalance = response.account.insurance_balance;
                        const frozenBalance = response.account.frozen_balance;
                        const failedTrades = response.account.failed_trades_in_row;
                        const autoPayout = response.account.auto_payout_accept;
                        const priority = response.account.priority;

                        const infoContainer = document.querySelector('.css-jft3y9');
                        const divElement = createDivElement('Better PsPay');
                        infoContainer.appendChild(divElement)
                        const betterElements = document.querySelector('#better')

                        if (betterElements) {
                            // Создаем и добавляем все элементы
                            const rates = getExchangeRates().data.amount;
                            const rubBalanceElement = createRubBalanceElement(convertToRub(balance, rates));
                            const insuranceBalanceElement = createInsuranceBalanceElement(insuranceBalance);
                            const frozenBalanceElement = createFrozenBalanceElement(frozenBalance);
                            const failedTradesElement = createFailedTradesElement(failedTrades);
                            const autoPayoutElement = createAutoPayoutElement(autoPayout);
                            const priorityElement = createPriorityElement(priority);
                            betterElements.appendChild(rubBalanceElement);
                            betterElements.appendChild(frozenBalanceElement);
                            betterElements.appendChild(insuranceBalanceElement);
                            betterElements.appendChild(failedTradesElement);
                            betterElements.appendChild(autoPayoutElement);
                            betterElements.appendChild(priorityElement);
                        }
                    }
                } catch (e) {
                    console.error('Ошибка парсинга JSON:', e);
                }
            });
        }
        originalXhrOpen.apply(this, arguments);
    };

})();