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
    const price = $(val).text().trim()
    return price.replace(/^\D+/g, '').replace(',', '')
  }

  localExhangeRate('jpy').then(exchange => {
    items.each((i, val) => {
      const priceObj = $(val).find('.a-price-whole').first()
      const price = getPrice(priceObj)
  
      const converted = Number(Number(price) / Number(exchange)).toFixed(2)

      priceObj.text(`$${converted.toLocaleString()}`)
    })
  })
}
