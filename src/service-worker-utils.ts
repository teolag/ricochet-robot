let isRefreshing = false
const isServiceWorkerSupported = 'serviceWorker' in navigator

export async function registerServiceWorker() {
  if (!isServiceWorkerSupported) {
    console.warn("Client: Service worker not available")
    return
  }

  navigator.serviceWorker.oncontrollerchange = onActiveWorkerChange
  navigator.serviceWorker.onmessage = onIncommingMessage

  console.debug("Client: Register service worker")
  const registration = await navigator.serviceWorker.register('sw.js')
  console.debug("Client: Service worker registered")
  
  if (!navigator.serviceWorker.controller) {
    console.debug("Client: No active worker found")
  } else if (registration.waiting) {
    newWorkerInstalled(registration.waiting)
  } else if (registration.installing) {
    console.debug("Client: New worker is beeing installed, track it")
    trackInstalling(registration.installing)
  } else {
    console.debug("Client: Listen for new workers")
    registration.onupdatefound = e => {
      console.debug("Client: New worker found, track installation")
      trackInstalling(registration.installing)
    }
  }
}

function trackInstalling(worker: ServiceWorker) {
  worker.onstatechange = () => {
    console.debug("Client: State changed", worker.state)
    if (worker.state === 'installed') {
      newWorkerInstalled(worker)
    }
  }
}

function newWorkerInstalled(worker: ServiceWorker) {
  console.debug("Client: New worker installed, activate it!")
  worker.postMessage({action: 'skipWaiting'})
}

function onActiveWorkerChange(e) {
  if (isRefreshing) return
  isRefreshing = true
  console.debug("Client: New worker active, reload page")
  location.reload()
}

function onIncommingMessage(e) {
  console.debug("Client: Message from client:", e.data)
}