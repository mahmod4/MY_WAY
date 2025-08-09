// ================================
// Service Worker لأسواق الشادر
// ================================

const CACHE_NAME = 'shadar-store-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/styles.css',
  '/script.js',
  '/config.js',
  '/manifest.json',
  '/images/logo22.jpg',
  '/images/خلفية.jpg',
  '/images/فاكهة.jpeg',
  '/images/خضار.jpeg',
  '/images/خضار-متوضب.jpg'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: تم التثبيت');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: خطأ في التثبيت', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: تم التفعيل');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: حذف الكاش القديم', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', event => {
  // تجاهل طلبات POST
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع من الكاش إذا وجد
        if (response) {
          return response;
        }

        // محاولة جلب من الشبكة
        return fetch(event.request)
          .then(response => {
            // التحقق من أن الاستجابة صالحة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // نسخ الاستجابة للكاش
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // إرجاع صفحة خطأ إذا فشل الاتصال
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// معالجة الإشعارات (للمستقبل)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'تحديث جديد في أسواق الشادر!',
    icon: '/images/logo22.jpg',
    badge: '/images/logo22.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'استكشف المنتجات',
        icon: '/images/logo22.jpg'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/images/logo22.jpg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('أسواق الشادر', options)
  );
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/index.html#products')
    );
  } else if (event.action === 'close') {
    // إغلاق الإشعار فقط
  } else {
    // النقر على الإشعار الرئيسي
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 