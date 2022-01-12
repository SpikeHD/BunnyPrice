document.addEventListener('DOMContentLoaded', function() {
  const out = document.getElementById('output')

  document.getElementById('ebay-shipping').addEventListener('change', (evt) => {
    const ebayOn = evt.target.checked
    out.innerHTML = ebayOn
  })

  document.getElementById('cur-refresh-val').addEventListener('keyup', (evt) => {
    listSearch(evt.target)
  })

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
  })

  // Show list of supported currencies
  const curList = document.getElementById('cur-list')
  const filteredCurs = Object.values(currencies)
    .filter((val, ind, self) => self.indexOf(val) === ind)
    .map((val) => val.toUpperCase())

  filteredCurs.forEach((val) => {
    curList.innerHTML += '<li class="cur-item">' + val + '</li>'
  })


  // Make list items clickable
  const listItems = document.getElementsByClassName('cur-item')

  for (let i = 0; i < listItems.length; i++) {
    const item = listItems.item(i)
    console.log(item)
    item.addEventListener('click', (evt) => {
      const val = evt.target.innerHTML
      document.getElementById('cur-refresh-val').value = val
    })
  }
})

function listSearch(input) {
  let list = input.parentNode.getElementsByTagName('ul')[0]
  if (input.value.length <= 0) {
    list.style.display = 'none'
  } else {
    list.style.display = 'block'

    list.childNodes.forEach((child) => {
      if (child.innerHTML.toLowerCase().indexOf(input.value.toLowerCase()) > -1) {
        child.style.display = 'block'
      } else {
        child.style.display = 'none'
      }
    })
  }
}

// chrome.storage.local.get(['key'], (results) => {
//   document.getElementById('btn').innerHTML = results.key;
// })


// chrome.storage.local.set({ key: 'test' }, () => {})