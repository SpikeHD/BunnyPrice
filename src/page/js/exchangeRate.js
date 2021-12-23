function grabExchangeRate(base, convert) {
  return new Promise((resolve, reject) => {
    const prop = `${convert}LastGrab`;

    browser.storage.local.get(prop).then((grab) => {
      const lastGrabbed = grab[prop]
      const lastGrabbedDate = lastGrabbed ? new Date(lastGrabbed) : new Date()
      const today = new Date()
  
      lastGrabbedDate.setMonth(today.getMonth() - 1)
    
      // New month? Update our local conversion cache
      if (!lastGrabbed || (lastGrabbed && lastGrabbedDate.getMonth() !== today.getMonth())) {
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${base}.json`).then((res) => res.json().then((body) => {
          resolve(body)
        }))
      }
    })
  })
}