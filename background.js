chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'fetchDescription') {
        fetch(request.url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Origin': 'https://photon-sol.tinyastro.io'
            }
        })
        .then(response => response.json())
        .then(data => sendResponse({ success: true, data: data }))
        .catch(error => sendResponse({ success: false, error: error.toString() }));
        return true; // Will respond asynchronously
    }
});