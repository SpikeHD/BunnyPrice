document.addEventListener('DOMContentLoaded', function() {
  const out = document.getElementById('output');

  document.getElementById('ebay-shipping').addEventListener('change', (evt) => {
    const ebayOn = evt.target.checked;
    out.innerHTML = ebayOn;
  });
});

// chrome.storage.local.get(['key'], (results) => {
//   document.getElementById('btn').innerHTML = results.key;
// })


// chrome.storage.local.set({ key: 'test' }, () => {})