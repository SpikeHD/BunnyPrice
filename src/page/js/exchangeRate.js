document.addEventListener('DOMContentLoaded', function() {
  function grabExchangeRate(base, convert) {
    return new Promise((resolve) => {
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${base}.json`).then((res) => res.json().then((body) => {
        resolve(body[base][convert])
      }))
    })


    // const prop = `${convert}LastGrab`;
  
    // chrome.storage.local.get([prop], (grab) => {
    //   const lastGrabbed = grab[prop]
    //   const lastGrabbedDate = lastGrabbed ? new Date(lastGrabbed) : new Date()
    //   const today = new Date()
    
    //   lastGrabbedDate.setMonth(today.getMonth() - 1)
      
    //   // New month? Update our local conversion cache
    //   if (!lastGrabbed || (lastGrabbed && lastGrabbedDate.getMonth() !== today.getMonth())) {

    //   }
    // })
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

  document.getElementById('cur-refresh').addEventListener('click', (elm) => {
    // Spin that bitch
    elm.target.style.animation = 'spin 1s ease-in-out'

    setTimeout(() => elm.target.style.animation = 'none', 2000)

    let val = document.getElementById('cur-refresh-val').value
    if (!val) return

    chrome.storage.local.get(['baseCurrency'], (result) => {
      if (!result?.baseCurrency) return
      grabExchangeRate(result.baseCurrency, val).then((rate) => {
        val = val.toLowerCase()
        chrome.storage.local.set({ [`${val}Exchange`]: rate })
      })
    })
  })

  document.getElementById('currency').addEventListener('change', (evt) => {
    const currency = evt.target.value
    chrome.storage.local.set({ baseCurrency: currency })
  })
})