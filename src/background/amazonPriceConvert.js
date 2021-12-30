function localExhangeRate(cur) {
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
  
    if (!p.includes('.') && !p.includes(',')) {
      p += '.00'
    }
  
    // Strip symbols from number
    if (p.indexOf('.') > p.indexOf(',')) {
      const cents = p.split('.')[1]
      const dollars = p.split(`.${cents}`)[0].split(',').join('')
  
      p = `${dollars}.${cents}`
    } else {
      const cents = p.split(',')[1]
      const dollars = p.split(`,${cents}`)[0].split('.').join('')
  
      p = `${dollars}.${cents}`
    }
  
    p = parseFloat(p).toFixed(2)
  
    return p
  }

  localExhangeRate('gbp').then(exchange => {
    items.each((i, val) => {
      const priceObj = $(val).find('.a-price-whole').first()
      const price = getPrice(priceObj)
  
      const converted = Number(Number(price) / Number(exchange)).toFixed(2)

      priceObj.text(`$${converted.toLocaleString()}`)
    })
  })
}
