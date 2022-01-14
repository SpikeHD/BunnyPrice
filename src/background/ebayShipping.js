function priceParse(price) {
  //console.log(price.replace(/^\D+/g, '').replace(',', ''))
  //console.log(price)
  return price.replace(/^\D+/g, '').replace(',', '')
}

chrome.storage.local.get(['ebayEnabled'], (res) => {
  if (!res.ebayEnabled) return

  if (document.baseURI?.match(/https:\/\/www\.ebay\./)?.length > 0) {
    // Sometimes the lists are different. Beats me as to why
    var list = $('#ListViewInner').length > 0 ? $('#ListViewInner') : $('.srp-results')
  
    list.children('li').each((i, val) => {
      // Get the objects, there are (from what I've seen) two different possibilities. Maybe there are more, idk
      var shipObj = $(val).find('.lvshipping').length > 0 ? $(val).find('.lvshipping') : $(val).find('.s-item__shipping')
      var priceObj = $(val).find('.lvprice').length > 0 ? $(val).find('.lvprice') : $(val).find('.s-item__price')

      // Get the currency for consistency
      var currency = $(priceObj).text().trim().split('$')[0]
      var price = parseFloat(priceParse(priceObj.text().trim()))
      var shipping = parseFloat(priceParse(shipObj.text().trim()))
  
      // If there is a shipping price (parseFloat returns null if there isn't any float), change it up
      if (shipping) {
        $(shipObj).text(`Shipping was: $${shipping}`)
        $(priceObj).text(`${currency} $${(Math.round((price+shipping + Number.EPSILON) * 100)/100).toFixed(2)}`)
      }
    })
  }
})

