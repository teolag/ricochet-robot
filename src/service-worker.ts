export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn("Service worker not available")
    return
  }

  
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', e => {
    const serviceWorkerContainer = e.target as ServiceWorkerContainer
    if(!serviceWorkerContainer.controller) {
      console.debug("Client: NO Controller =(")
      return
    }
    if (refreshing) return
    refreshing = true
    console.debug("Client: RELOAD")
    location.reload()
  })

  navigator.serviceWorker.onmessage = function(e) {
    console.debug("Client: Message form Client:", e.data);
  }

  console.debug("Client: Register service worker")
  const registration = await navigator.serviceWorker.register('sw.js')

  console.debug("Client: Service worker registered")
  
  if (!navigator.serviceWorker.controller) {
    // no service worker active, first visit
    console.debug("Client: First visit?")
    return
  }

  if (registration.waiting) {
    console.debug("Client: New worker ready to be installed");
    updateReady(registration.waiting);
  } else if (registration.installing) {
    console.debug("Client: New worker is beeing installed");
    trackInstalling(registration.installing);
  } else {
    registration.onupdatefound = e => {
      console.debug("Client: New worker found, track installation");
      trackInstalling(registration.installing);
    }
  }
}

function trackInstalling(worker: ServiceWorker) {
  worker.onstatechange = () => {
    console.debug("Client: State changed", worker.state);
    if (worker.state === 'installed') {
      updateReady(worker);
    }
  }
}

function updateReady(worker: ServiceWorker) {
  console.debug("Client: Update ready, send skip soooon!");
  setTimeout(() => worker.postMessage({action: 'skipWaiting'}), 1000)
}