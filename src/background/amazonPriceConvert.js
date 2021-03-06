const REGEX_UNWANTED_CHARACTERS = /[^\d\-.,]/g
const REGEX_DASHES_EXCEPT_BEGINNING = /(?!^)-/g

function formatNumber(number) {
  const sanitizedNumber = number
    .replace(REGEX_UNWANTED_CHARACTERS, '')
    .replace(REGEX_DASHES_EXCEPT_BEGINNING, '')

  // Handle only thousands separator
  if (
    ((sanitizedNumber.match(/,/g) ?? []).length >= 2 && !sanitizedNumber.includes('.')) ||
    ((sanitizedNumber.match(/\./g) ?? []).length >= 2 && !sanitizedNumber.includes(','))
  ) {
    return sanitizedNumber.replace(/[.,]/g, '')
  }
  return sanitizedNumber.replace(/,/g, '')
}

function localExchangeRate(cur) {
  return new Promise((resolve) => {
    chrome.storage.local.get([`${cur}Exchange`], (res) => {
      resolve(res[`${cur}Exchange`] || 1)
    })
  })
}

function getPrice(val) {
  let p = $(val).text().trim()
  p = '' + p
  let currencySymbol = p.replace(/[,.]+/g, '').replace(/\d/g, '')
  if (currencySymbol) p = p.replace(currencySymbol, '')

  return parseFloat(formatNumber(p))
}

function priceReplace(result) {
  if (document.baseURI?.match(/https:\/\/www\.amazon\./)?.length > 0) {
    const items = $('.s-card-container').length > 0 ? $('.s-card-container') : $('.s-result-item')

    if (!result?.countryCurrencies) return
    const curs = result.countryCurrencies
    const country = document.baseURI.split('amazon.')[1].split('/')[0]
    const currency = curs[country]

    // If we don't have a currency for this country, return
    if (!currency) return

    // Grab the exchange rate from local storage
    localExchangeRate(currency).then((exchange) => {
      items.each((i, val) => {
        const priceObj = $(val).find('.a-price-whole').first()
        const cents = $(val).find('.a-price-fraction').first()
        const priceSymbol = $(val).find('.a-price-symbol').first()

        // I don't want to bother with the symbols and cents right now
        cents.remove()
        priceSymbol.remove()

        const price = getPrice(priceObj)
        const converted = (parseFloat(price) / parseFloat(exchange)).toFixed(2)
  
        priceObj.text(`$${converted.toLocaleString()}`)
      })
    })
  }
}

chrome.storage.local.get(['countryCurrencies', 'amazonEnabled'], (result) => {
  if (!result?.amazonEnabled) return
  
  priceReplace(result)

  let lastURL = window.location.href

  setInterval(() => {
    if (window.location.href === lastURL) return

    lastURL = window.location.href
    priceReplace(result)
  }, 1000)
})