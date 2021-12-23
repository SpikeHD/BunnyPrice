browser.storage.local.set({'jpyExchange': 88.233285})

function localExhangeRate(cur) {
  return new Promise((resolve) => {
    browser.storage.local.get(`${cur}Exchange`).then((res) => {
      resolve(res[`${cur}Exchange`] || 1)
    })
  })
}

if (document.baseURI?.match(/https:\/\/www\.amazon\./)?.length > 0) {
  document.body.style.border = "5px solid green";
  const items = $('.s-card-container')

  document.body.style.border = "5px solid red";

  // TODO we will have a mapping of what currency each TLD uses. For now lets assume JP for amazon.jp
  function getPrice(val) {
    const price = $(val).text().trim()
    return price.replace(/^\D+/g, '').replace(',', '')
  }

  localExhangeRate('cad', 'jpy').then(exchange => {

    // TESTING TODO: REMOVE
    exchange = 88.233285

    items.each((i, val) => {
      const priceObj = $(val).find('.a-price-whole').first()
      const price = getPrice(priceObj)
  
      // console.log(price)
      // console.log(exchange)
  
      const converted = Number(Number(price) / Number(exchange)).toFixed(2)

      priceObj.text(`$${converted.toLocaleString()}`)
    })
  })
}
