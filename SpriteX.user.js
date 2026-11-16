// ==UserScript==
// @name         SpriteX Lite
// @namespace    spritex.lite.public
// @version      1.3.19
// @description  SpriteX Lite is offline
// @match        https://starve.io/*
// @run-at       document-start
// @grant        none
// @noframes
// @updateURL    https://raw.githubusercontent.com/applexdlol/spritex-lite/refs/heads/main/SpriteX.meta.js
// @downloadURL  https://raw.githubusercontent.com/applexdlol/spritex-lite/refs/heads/main/SpriteX.user.js
// ==/UserScript==
(function(){
 const edition="Lite",deadline=1794877220000;
 let offset=0,closed=false,timer,root;
 function paint(){
  if(!document.documentElement)return;
  const left=Math.max(0,deadline-(Date.now()+offset)),offline=edition==='Lite'||left===0;
  if(!root){root=document.createElement('div');root.id='spritex-shutdown-notice';root.style.cssText='position:fixed;inset:0;z-index:2147483647;';const shadow=root.attachShadow({mode:'open'});shadow.innerHTML='<style>:host{font:16px system-ui,sans-serif;color:white}*{box-sizing:border-box}.screen{min-height:100dvh;background:radial-gradient(ellipse at top,#a10b20,#270007 80%);display:flex;align-items:center;justify-content:center;padding:32px}.card{width:min(780px,100%);text-align:center}.label{letter-spacing:.2em;font-size:14px;font-weight:800;color:#ffb4bd}h1{font-size:clamp(36px,7vw,76px);line-height:1.05;margin:20px 0}p{color:#ffdce1;line-height:1.6}.time{font:800 clamp(32px,6vw,64px) ui-monospace,monospace;margin:24px 0;font-variant-numeric:tabular-nums}button{font:700 16px system-ui;padding:15px 24px;border-radius:12px;border:1px solid #ff7a8c;color:white;background:#a51d32;cursor:pointer}.banner{position:fixed;top:8px;left:50%;transform:translateX(-50%);border:1px solid #ff6479;border-radius:12px;background:#8c0b20;padding:10px 18px;white-space:nowrap;font-weight:700;max-width:95vw;cursor:pointer}</style><div class="screen"><div class="card"><div class="label">SPRITEX SERVICE SHUTDOWN</div><h1></h1><p class="copy"></p><div class="time" role="timer"></div><p class="date"></p><button type="button"></button></div></div><div class="banner" hidden></div>';shadow.querySelector('button').onclick=()=>{if(edition==='Lite'||Date.now()+offset>=deadline){root.remove();clearInterval(timer);return;}closed=true;paint();};shadow.querySelector('.banner').onclick=()=>{closed=false;paint();};document.documentElement.append(root);}
  const shadow=root.shadowRoot,h=Math.floor(left/3600000),m=Math.floor(left/60000)%60,s=Math.floor(left/1000)%60,value=[h,m,s].map(v=>String(v).padStart(2,'0')).join(':');
  shadow.querySelector('h1').textContent=offline?'SpriteX '+edition+' is offline':'SpriteX is shutting down';
  shadow.querySelector('.copy').textContent=offline?'SpriteX is no longer available. Disable the userscript to continue playing Starve.io without SpriteX.':'SpriteX Pro and Beta will stop working when this countdown ends. This notice appears on every reload.';
  shadow.querySelector('.time').textContent=offline?'SERVICE OFFLINE':value;
  shadow.querySelector('.date').textContent=offline?'': 'Shutdown: '+new Date(deadline).toLocaleString(undefined,{timeZoneName:'short'});
  shadow.querySelector('button').textContent=offline?'Dismiss notice — SpriteX stays offline':'Continue until shutdown';
  shadow.querySelector('.screen').hidden=closed&&!offline;shadow.querySelector('.screen').style.display=closed&&!offline?'none':'flex';shadow.querySelector('.banner').hidden=!closed||offline;shadow.querySelector('.banner').textContent='SpriteX shuts down in '+value;
  root.style.pointerEvents=closed&&!offline?'none':'auto';shadow.querySelector('.banner').style.pointerEvents='auto';
 }
 const start=()=>{paint();timer=setInterval(paint,1000);};if(document.documentElement)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
 if(edition!=='Lite'){
  fetch('https://spritex-keys.applexd2021.workers.dev/service-status',{cache:'no-store',credentials:'omit'}).then(r=>r.json()).then(data=>{if(Number.isFinite(data.serverNow))offset=data.serverNow-Date.now();paint();}).catch(()=>{});
  const check=setInterval(()=>{if(Date.now()+offset>=deadline){clearInterval(check);try{window.__spriteXEarlyCapture?.cleanup();}catch{}location.reload();}},1000);
 }
})();
