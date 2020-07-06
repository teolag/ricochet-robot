const results = {}
const startedTimers = {}

export function time(name: string, fn) {
  const start = new Date().getTime();
  const resp = fn()
  const end = new Date().getTime();
  results[name] = (results[name] || 0) + end-start
  if(!name.startsWith('total-')) {
    results['total-' + name] = (results['total-' + name] || 0) + end-start
  }
  return resp
}

export function startTimer(name: string) {
  startedTimers[name] = new Date().getTime()
}

export function pauseTimer(name: string) {
  const from = startedTimers[name]
  const to = new Date().getTime()
  results[name] = (results[name] || 0) + to-from
  if(!name.startsWith('total-')) {
    results['total-' + name] = (results['total-' + name] || 0) + to-from
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
