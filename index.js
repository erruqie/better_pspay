// ==UserScript==
// @name         better_pspay
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  hehе
// @match        https://p2p-paradise.info/
// @grant        none
// @author       vccuser
// ==/UserScript==

(function() {
    'use strict';

    // Функция для форматирования значения страхового баланса
    const formatBalance = (balance) => {
        // Делим на 100 и добавляем знак доллара
        const formattedBalance = (balance / 100).toFixed(2);
        return `$${formattedBalance}`;
    };

    // Функция для создания элемента с страховым балансом
    const createInsuranceBalanceElement = (balance) => {
        const formattedBalance = formatBalance(balance);
        const balanceContainer = document.createElement('div');
        balanceContainer.className = 'chakra-stack css-1meq8zh';
        balanceContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${formattedBalance}</h2><p class="css-1tzeee1">Страховой баланс</p></div>`;
        return balanceContainer;
    };

    // Функция для создания элемента с замороженным балансом
    const createFrozenBalanceElement = (frozen_balance) => {
        const formattedFrozenBalance = formatBalance(frozen_balance);
        const balanceContainer = document.createElement('div');
        balanceContainer.className = 'chakra-stack css-1meq8zh';
        balanceContainer.innerHTML = `<div class="chakra-stack css-1ubuaci"><div class="chakra-stack css-1ubuaci"><h2 class="chakra-heading css-mhh1m3">${formattedFrozenBalance}</h2><p class="css-1tzeee1">Замороженный баланс</p></div>`;
        return balanceContainer;
    };

    // Перехват XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (method === 'GET' && url === 'https://api.p2p-paradise.info/account') {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response && response.account) {
                        const insuranceBalance = response.account.insurance_balance;
                        const frozenBalance = response.account.frozen_balance;
                        const balance = response.account.balance;
                        console.log(`insurance_balance: ${insuranceBalance}`);

                        // Находим контейнер для общего баланса
                        const existingBalanceElement = document.querySelector('.css-smlf7u');

                        if (existingBalanceElement) {
                            // Создаем и добавляем элемент для страхового баланса
                            const insuranceBalanceElement = createInsuranceBalanceElement(insuranceBalance);
                            const frozenBalanceElement = createFrozenBalanceElement(frozenBalance);
                            existingBalanceElement.appendChild(frozenBalanceElement);
                            existingBalanceElement.appendChild(insuranceBalanceElement);
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
