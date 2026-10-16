// Mouvement Juste — fonctionnement hors ligne
const CACHE="mj-fa580b6a4d";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const isPage=r.mode==="navigate";
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(isPage?"index.html":r,{ignoreSearch:isPage});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(isPage?"index.html":r,res.clone());return res}).catch(()=>hit);
    return hit||net;
  }));
});
