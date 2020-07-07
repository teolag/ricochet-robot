const results = {}
const startedTimers = {}

export function startTimer(name: string) {
  startedTimers[name] = process ? process.hrtime() : new Date().getTime()
}

export function pauseTimer(name: string) {
  let ms: number
  if(process) {
    const hr = process.hrtime(startedTimers[name])
    ms = hr[0]*1000 + hr[1]/1000000
  } else {
    const from = startedTimers[name]
    const to = new Date().getTime()
    ms = to-from
  }
  results[name] = (results[name] || 0) + ms
  if(!name.startsWith('total-')) {
    results['total-' + name] = (results['total-' + name] || 0) + ms
  }
}

export function getAndClear() {
  const out = {}
  Object.entries(results).forEach(([key, value]) => {
    if(key.startsWith('total-')) return
    out[key] = value
    results[key] = 0
  })
  return out
}

export function getTotals() {
  const out = {}
  Object.entries(results).forEach(([key, value]) => {
    if(!key.startsWith('total-')) return
    out[key] = value
  })
  return out
}
