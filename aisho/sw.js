/* 相性チェックメモ — Service Worker
   方針: HTML本体はネットワーク優先（更新をすぐ反映）、
         アイコン等の静的ファイルはキャッシュ優先。
         オフライン時はキャッシュしたHTMLを返す。
   アプリを更新したら CACHE の版番号を上げること。 */
const CACHE = "aisho-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  const isDoc = req.mode === "navigate" || req.destination === "document";

  if (isDoc) {
    /* HTML: ネットワーク優先。成功したらキャッシュを更新。失敗したらキャッシュを返す。 */
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html").then(hit => hit || caches.match("./")))
    );
  } else {
    /* 静的ファイル: キャッシュ優先。無ければ取得してキャッシュに入れる。 */
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
  }
});
