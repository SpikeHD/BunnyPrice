document.addEventListener('DOMContentLoaded', function() {
  // Show list of supported currencies
  const curList = document.getElementById('cur-list')

  // Set default state of checkboxes
  chrome.storage.local.get(['ebayEnabled', 'amazonEnabled'], (res) => {
    if (res?.ebayEnabled) {
      const checkbox = document.getElementById('ebay-shipping')
      checkbox.click()
    }

    if (res?.amazonEnabled) {
      const checkbox = document.getElementById('amazon-convert')
      checkbox.click()
    }
  })

  // Turn ebay shipping combiner on and off
  document.getElementById('ebay-shipping').addEventListener('change', (evt) => {
    const ebayOn = evt.target.checked
    chrome.storage.local.set({ ebayEnabled: ebayOn })
  })

    // Turn amazon price converter on and off
    document.getElementById('amazon-convert').addEventListener('change', (evt) => {
      const amazonOn = evt.target.checked
      chrome.storage.local.set({ amazonEnabled: amazonOn })
    })

  // Search through currency list
  document.getElementById('cur-refresh-val').addEventListener('keyup', (evt) => {
    listSearch(evt.target)
  })

  // Show list when focused
  document.getElementById('cur-refresh-val').addEventListener('focus', (evt) => {
    curList.style.display = 'block'
  })

  // Hide list when not focused
  document.getElementById('cur-refresh-val').addEventListener('blur', (evt) => {
    // Stinky hack to allow clicking the list items before it disappears
    setTimeout(() => {
      curList.style.display = 'none'
    }, 100)
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

  // First time check for country currencies
  chrome.storage.local.get(['countryCurrencies'], (result) => {
    if (!result?.countryCurrencies) {
      chrome.storage.local.set({ countryCurrencies: currencies })
    }
  })

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
    item.addEventListener('click', (evt) => {
      const val = evt.target.innerHTML
      document.getElementById('cur-refresh-val').value = val
    })
  }
})

function listSearch(input) {
  let list = input.parentNode.getElementsByTagName('ul')[0]
  if (input.value.length <= 0) {
    list.childNodes.forEach((child) => {
      child.style.display = 'block'
    })
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