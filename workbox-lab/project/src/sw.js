importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    workbox.precaching.precacheAndRoute([]);

    workbox.routing.registerRoute(
        /(.*)articles(.*)\.(?:png|gif|jpg)/,
        workbox.strategies.cacheFirst({
            cacheName: 'images-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                })
            ]
        })
    );

    const articleHandler = workbox.strategies.networkFirst({
        cacheName: 'articles-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 50,
            })
        ]
    });

    workbox.routing.registerRoute(/(.*)article(.*)\.html/, args => {
        return articleHandler.handle(args);
    });

    const articleHandler = workbox.strategies.networkFirst({
        cacheName: 'articles-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 50,
            })
        ]
    });

    workbox.routing.registerRoute(/(.*)article(.*)\.html/, args => {
        return articleHandler.handle(args)
            .then(response => {
                if (!response) {
                    return caches.match('pages/offline.html');
                } else if (response.status === 404) {
                    return caches.match('pages/404.html');
                }
                return response;
            });

    });


    workbox.routing.registerRoute(/(.*)pages\/post(.*)\.html/, args => {
        console.log('test');
        return postHandler.handle(args).then(response => {
            if (response.status === 404) {
                return caches.match('pages/404.html');
            }
            return response;
        })
            .catch(function () {
                return caches.match('pages/offline.html');
            });
    });


} else {
    console.log(`Boo! Workbox didn't load 😬`);

}

