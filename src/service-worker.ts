// Service Worker stuff
if ('serviceWorker' in navigator) {
	console.log("SW: register service worker");
	navigator.serviceWorker.register('sw.js')
		.then(function(registration) {
			console.log(`SW: service worker registered`);

			// no service worker active, first visit
			if (!navigator.serviceWorker.controller) {
				console.log("SW: first visit");
				//return;
			}

			if (registration.waiting) {
				console.log("SW: new worker ready");
				updateReady(registration.waiting);
				return;
			}

			if (registration.installing) {
				console.log("SW: new worker installing");
				trackInstalling(registration.installing);
				return;
			}

			registration.addEventListener('updatefound', function(e) {
				console.log("SW: new worker found, track installation", e);
				if(registration.installing) {
					trackInstalling(registration.installing);
				}
			});
		})
		.catch(function(err) {
			console.log("Service worker registration failed : ", err);
		})
	;

	let refreshing = false;
	navigator.serviceWorker.addEventListener('controllerchange', function() {
		console.log("SW: Refresh page!", refreshing);
		if (refreshing) return;
		const reload = confirm("New version available! Do you want to reload?")
		if(reload) window.location.reload();
		refreshing = true;
	});

	var trackInstalling = function(worker: ServiceWorker) {
		// var indexController = this;
		worker.addEventListener('statechange', function() {
			console.log("SW: STATE CHANGE", worker.state);
			if (worker.state == 'installed') {
				updateReady(worker);
			}
		});
	};

	var updateReady = function(worker: ServiceWorker) {
		console.log("SW: Update ready!");
		worker.postMessage({action: 'skipWaiting'});
	};

	navigator.serviceWorker.onmessage = function(e) {
		console.log("SW: Message form SW:", e.data);
	}
}


window.addEventListener('beforeinstallprompt', (e: Event) => {
	e.preventDefault();
	const deferredPrompt = e;

	/*
	const installButton = document.getElementById("install-button")
	installButton.hidden = false
	installButton.addEventListener("click", () => {
		deferredPrompt.prompt()
	})
	*/
	
});
