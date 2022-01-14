document.addEventListener('DOMContentLoaded', function() {
  function grabExchangeRate(base, convert) {
    return new Promise((resolve) => {
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${base}.json`).then((res) => res.json().then((body) => {
        console.log(body)
        resolve(body[base][convert])
      }))
    })
  }

  chrome.storage.local.get(['baseCurrency'], (result) => {
    let res = result?.baseCurrency

    // First time check
    if (!result || !result.baseCurrency) {
      chrome.storage.local.set({ baseCurrency: 'cad' })
      res = 'cad'
    }

    document.getElementById('currency').value = res
  })

  document.getElementById('cur-conv-refresh').addEventListener('click', (elm) => {
    let val = document.getElementById('currency').value?.toLowerCase()

    if (val) chrome.storage.local.set({ baseCurrency: val })
  })

  document.getElementById('cur-refresh').addEventListener('click', (elm) => {
    // Spin that bitch
    elm.target.style.animation = 'spin 1s ease-in-out'

    setTimeout(() => elm.target.style.animation = 'none', 2000)

    let val = document.getElementById('cur-refresh-val').value
    if (!val) return

    val = val.toLowerCase()

    chrome.storage.local.get(['baseCurrency'], (result) => {
      if (!result?.baseCurrency) return
      grabExchangeRate(result.baseCurrency, val).then((rate) => {
        chrome.storage.local.set({ [`${val}Exchange`]: rate })
      })
    })
  })

  document.getElementById('currency').addEventListener('change', (evt) => {
    const currency = evt.target.value
    chrome.storage.local.set({ baseCurrency: currency })
  })
})