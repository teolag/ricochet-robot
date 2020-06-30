// Service Worker stuff
if ('serviceWorker' in navigator) {
	console.debug("SW: Register service worker");
	navigator.serviceWorker.register('sw.js')
		.then(function(registration) {
			console.debug("SW: Service worker registered");

			// no service worker active, first visit
			if (!navigator.serviceWorker.controller) {
				console.debug("SW: First visit");
				//return;
			}

			if (registration.waiting) {
				console.debug("SW: New worker ready");
				updateReady(registration.waiting);
				return;
			}

			if (registration.installing) {
				console.debug("SW: New worker installing");
				trackInstalling(registration.installing);
				return;
			}

			registration.addEventListener('updatefound', function(e) {
				console.debug("SW: New worker found, track installation", e);
				if(registration.installing) {
					trackInstalling(registration.installing);
				}
			});
		})
		.catch(function(err) {
			console.debug("SW: Service worker registration failed : ", err);
		})
	;

	let refreshing = false;
	navigator.serviceWorker.addEventListener('controllerchange', function() {
		console.debug("SW: Refresh page!", refreshing);
		if (refreshing) return;
		const reload = confirm("New version available! Do you want to reload?")
		if(reload) window.location.reload();
		refreshing = true;
	});

	var trackInstalling = function(worker: ServiceWorker) {
		worker.addEventListener('statechange', function() {
			console.debug("SW: Installation state changed", worker.state);
			if (worker.state === 'installed') {
				updateReady(worker);
			}
		});
	};

	var updateReady = function(worker: ServiceWorker) {
		console.debug("SW: Update ready!");
		worker.postMessage({action: 'skipWaiting'});
	};

	navigator.serviceWorker.onmessage = function(e) {
		console.debug("SW: Message form SW:", e.data);
	}
}
