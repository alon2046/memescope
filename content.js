(function() {
    'use strict';

    //  show popup
    function showPopup(text, buttonElement) {
        // remove any existing popup
        const existingPopup = document.querySelector('.description-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // create new popup
        const popup = document.createElement('div');
        popup.className = 'description-popup';
        popup.textContent = text;

        // position popup relative to button
        document.body.appendChild(popup);
        
        // get button position
        const buttonRect = buttonElement.getBoundingClientRect();
        
        // calculate initial position
        let left = buttonRect.right + 10;
        let top = buttonRect.top + (buttonRect.height / 2);

        // check if popup would go off the right edge 
        if (left + popup.offsetWidth > window.innerWidth) {
            left = buttonRect.left - popup.offsetWidth - 10;
            popup.style.setProperty('--arrow-direction', 'right');
        }

        // so popup doesn't go off the top or bottom 
        const popupHeight = popup.offsetHeight;
        top = Math.max(10, Math.min(window.innerHeight - popupHeight - 10, top - (popupHeight / 2)));

        // Apply position
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;

        // remove popup when clicking anywhere else
        function handleClick(e) {
            if (!popup.contains(e.target) && e.target !== buttonElement) {
                popup.remove();
                document.removeEventListener('click', handleClick);
            }
        }

        setTimeout(() => {
            document.addEventListener('click', handleClick);
        }, 100);
    }

    // fetch description
    async function fetchDescription(address, buttonElement) {
        const url = `https://frontend-api.pump.fun/coins/${address}`;
        
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'fetchDescription',
                url: url
            });
            
            if (response.success && response.data && response.data.description) {
                showPopup(response.data.description, buttonElement);
            } else {
                showPopup('No description available', buttonElement);
            }
        } catch (error) {
            console.error('Error:', error);
            showPopup('Error fetching description', buttonElement);
        }
    }

    // add button to coin
    function addButtonToCoin(coinElement) {


        // look for an element with class CZ9XtNP_BJSquWvM6_r8 inside the coin element
        const buttonContainer = coinElement.querySelector('.CZ9XtNP_BJSquWvM6_r8');
        if (!buttonContainer || buttonContainer.querySelector('.custom-coin-button')) return;

        const button = document.createElement('button');
        button.className = 'custom-coin-button WONu4jRBwJmFo3FD6XwP c-btn c-btn--lt u-px-xs';
        button.style.cssText = `
            margin-left: 8px;
            background: #2d2d2d;
            border: 1px solid #444;
            color: white;
            cursor: pointer;
        `;

        button.innerHTML = `
            <div class="l-row u-align-items-center no-gutters u-w-100">
                <div class="u-d-flex u-align-items-center l-col-auto">
                    <span class="question-mark">?</span>
                </div>
            </div>
        `;

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const addressElement = coinElement.querySelector('.O1Yy1xXe2uVeuSuj862s');
            if (addressElement) {
                const address = addressElement.getAttribute('data-address');
                if (address) {
                    fetchDescription(address, button);
                }
            }
        });

        buttonContainer.appendChild(button);
    }




    // initialize and observe
    function initialize() {
        const coins = document.querySelectorAll('.sBVBv2HePq7qYTpGDmRM');
        coins.forEach(addButtonToCoin);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('sBVBv2HePq7qYTpGDmRM')) {
                            addButtonToCoin(node);
                        }
                        const coinElements = node.querySelectorAll('.sBVBv2HePq7qYTpGDmRM');
                        coinElements.forEach(addButtonToCoin);
                    }
                });
            });
        });

        const containers = document.querySelectorAll('.u-custom-scroll, .u-flex-grow-full');
        containers.forEach(container => {
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        });
    }



    
    // start 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 2000));
    } else {
        setTimeout(initialize, 2000);
    }

    // check for new coins
    setInterval(() => {
        const coins = document.querySelectorAll('.sBVBv2HePq7qYTpGDmRM');
        coins.forEach(addButtonToCoin);
    }, 5000);
})();