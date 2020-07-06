export default (function() {
  const results = {}

  function time(name: string, fn) {
    const start = new Date().getTime();
    const resp = fn()
    const end = new Date().getTime();
    results[name] = (results[name] || 0) + end-start
    if(!name.startsWith('total-')) {
      results['total-' + name] = (results['total-' + name] || 0) + end-start
    }
    return resp
  }

  function getAndClear() {
    const out = {}
    Object.entries(results).forEach(([key, value]) => {
      if(key.startsWith('total-')) return
      out[key] = value
      results[key] = 0
    })
    return out
  }
  
  function getTotals() {
    const out = {}
    Object.entries(results).forEach(([key, value]) => {
      if(!key.startsWith('total-')) return
      out[key] = value
    })
    return out
  }

  return {
    time, getAndClear, getTotals
  }
}())