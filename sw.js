// Service Worker — 컨텐츠 마스터즈
// 오프라인 작동 + PWA 설치 트리거

const CACHE_NAME = 'content-masters-v327';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.png',
  './hero-trophy.png'
];

// 설치 시 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// 활성화 시 이전 캐시 정리
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// fetch — 네트워크 우선, 실패 시 캐시
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // 개인 페이지(u.html)·편집기(edit.html)는 서비스워커가 가로채지 않고 그대로 통과
  // (안 그러면 네트워크 실패 시 index.html로 튕겨서 페이지가 안 보임)
  const _url = new URL(e.request.url);
  if (_url.pathname.endsWith('/u.html') || _url.pathname.endsWith('/edit.html')) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 새 응답을 캐시에 저장
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || caches.match('./index.html')))
  );
});
