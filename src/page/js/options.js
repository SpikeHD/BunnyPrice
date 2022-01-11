document.addEventListener('DOMContentLoaded', function() {
  const out = document.getElementById('output');

  document.getElementById('ebay-shipping').addEventListener('change', (evt) => {
    const ebayOn = evt.target.checked;
    out.innerHTML = ebayOn;
  });

  // default amazon country-specific currencies
  const currencies = {
    'com': 'usd',
    'ca': 'cad',
    'co.uk': 'gbp',
    'de': 'eur',
    'fr': 'eur',
    'it': 'eur',
    'es': 'eur',
    'co.jp': 'jpy',
    'com.au': 'aud',
    'com.br': 'brl',
    'cn': 'cny',
    'in': 'inr',
  }

  chrome.storage.local.get(['countryCurrencies'], (result) => {
    if (!result?.countryCurrencies) {
      chrome.storage.local.set({ countryCurrencies: currencies })
    }
  });
});

// chrome.storage.local.get(['key'], (results) => {
//   document.getElementById('btn').innerHTML = results.key;
// })


// chrome.storage.local.set({ key: 'test' }, () => {})