function localExchangeRate(cur) {
  return new Promise((resolve) => {
    chrome.storage.local.get([`${cur}Exchange`], (res) => {
      resolve(res[`${cur}Exchange`] || 1)
    })
  })
}

if (document.baseURI?.match(/https:\/\/www\.amazon\./)?.length > 0) {
  const items = $('.s-card-container').length > 0 ? $('.s-card-container') : $('.s-result-item')

  // TODO we will have a mapping of what currency each TLD uses. For now lets assume JP for amazon.jp
  function getPrice(val) {
    let p = $(val).text().trim()
    p = '' + p
    let currencySymbol = p.replace(/[,.]+/g, '').replace(/\d/g, '')
    if (currencySymbol) p = p.replace(currencySymbol, '')
  
    let result = p.replace(/[^0-9]/g, '');
    if (/[,\.]\d{2}$/.test(p)) {
        result = result.replace(/(\d{2})$/, '.$1');
    }
  
    return result
  }

  // Find what currency it needs to be converted from
  chrome.storage.local.get(['countryCurrencies'], (result) => {
    if (!result?.countryCurrencies) return;
    const curs = result.countryCurrencies
    const country = document.baseURI.split('amazon.')[1].split('/')[0]
    const currency = curs[country]

    // If we don't have a currency for this country, return
    if (!currency) return;

    // Grab the exchange rate from local storage
    localExchangeRate(currency).then((exchange) => {
      items.each((i, val) => {
        const priceObj = $(val).find('.a-price-whole').first()
        const price = getPrice(priceObj)
    
        const converted = Number(Number(exchange) / Number(price)).toFixed(2)
  
        priceObj.text(`$${converted.toLocaleString()}`)
      })
    })
  });
}
