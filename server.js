const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 8080;
const KASSAL_KEY = process.env.KASSAL_KEY || '';

app.get('/api/search', async (req, res) => {
  res.header('Access-Control-Allow-Origin','*');
  try {
    const r = await fetch(`https://kassal.app/api/v1/products?search=${encodeURIComponent(req.query.q||'')}&size=30&unique=false`, {
      headers: { Authorization: 'Bearer ' + KASSAL_KEY }
    });
    res.json(await r.json());
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/offers', async (req, res) => {
  res.header('Access-Control-Allow-Origin','*');
  try {
    const r = await fetch(`https://squid-api.tjek.com/v2/offers/search?r_lat=63.4305&r_lng=10.3951&r_radius=30000&r_locale=nb_NO&query=${encodeURIComponent(req.query.q||'')}&limit=80`);
    res.json(await r.json());
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/status', async (req, res) => {
  res.header('Access-Control-Allow-Origin','*');
  res.json({ kassal: KASSAL_KEY.length > 0, eta: true });
});

app.get('*', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Handlehjelpen</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#f4f1ea;--surface:#fff;--s2:#ede9df;--border:#ddd8cc;--text:#1c1a16;--muted:#7a7367;--hint:#b0a898;--green:#1e5c3a;--gbg:#d4eddf;--red:#8b1e2f;--rbg:#fde8ec;--blue:#1a3c6e;--bbg:#dce8f8;--accent:#bf4e25}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
a{color:inherit}
header{background:var(--text);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.logo{font-family:'DM Serif Display',serif;font-size:1.6rem;color:#f4f1ea;font-weight:400;letter-spacing:-0.02em}
.logo span{color:#bf9c6e}
.hdr-sub{font-size:.72rem;color:#888078;margin-top:2px}
.pills{display:flex;gap:7px;flex-wrap:wrap}
.pill{font-size:.7rem;padding:3px 11px;border-radius:999px;border:1px solid;white-space:nowrap}
.p-ok{background:#1e3a10;color:#8ecf74;border-color:#3f5228}
.p-err{background:#3a1010;color:#e08080;border-color:#6a2828}
.p-gray{background:#252520;color:#888078;border-color:#3a3a34}
.wrap{max-width:1160px;margin:0 auto;padding:1.75rem 1.25rem;display:grid;grid-template-columns:300px 1fr;gap:1.75rem;align-items:start}
@media(max-width:760px){.wrap{grid-template-columns:1fr;padding:1rem}header{padding:1rem}}
.sidebar{display:flex;flex-direction:column;gap:1.25rem;position:sticky;top:1.25rem}
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem}
.ctitle{font-size:.67rem;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:.85rem}
.sgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:5px}
.schip{display:flex;align-items:center;gap:7px;padding:7px 9px;border-radius:8px;border:1px solid var(--border);background:var(--s2);cursor:pointer;font-size:.78rem;color:var(--muted);transition:all .15s;user-select:none}
.schip:hover{border-color:var(--text);color:var(--text)}
.schip.on{background:var(--text);color:#f4f1ea;border-color:var(--text)}
.schip input{display:none}
.sdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;opacity:.4}
.schip.on .sdot{opacity:1}
.srchwrap{position:relative;margin-bottom:.6rem}
.srchrow{display:flex;gap:7px}
.srchrow input{flex:1;height:42px;border:1px solid var(--border);border-radius:9px;padding:0 13px;font-family:'DM Sans',sans-serif;font-size:.9rem;background:var(--s2);color:var(--text);outline:none;transition:all .15s}
.srchrow input:focus{border-color:var(--text);background:#fff}
.srchrow input::placeholder{color:var(--hint)}
.badd{height:42px;padding:0 14px;border-radius:9px;border:none;background:var(--text);color:var(--bg);font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:500;cursor:pointer}
.drop{position:absolute;top:calc(100% + 5px);left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:11px;box-shadow:0 10px 30px rgba(0,0,0,.13);z-index:200;overflow:hidden;max-height:380px;overflow-y:auto;display:none}
.drop.open{display:block}
.dload{padding:11px 14px;font-size:.82rem;color:var(--hint);display:flex;align-items:center;gap:9px}
.mspin{width:14px;height:14px;border:1.5px solid var(--border);border-top-color:var(--muted);border-radius:50%;animation:spin .5s linear infinite;flex-shrink:0}
.dsec{padding:5px 14px 2px;font-size:.62rem;font-weight:500;text-transform:uppercase;letter-spacing:.09em;color:var(--hint);background:var(--s2);border-top:1px solid var(--border)}
.dsec:first-child{border-top:none}
.ditem{display:flex;align-items:center;gap:11px;padding:9px 14px;cursor:pointer;border-bottom:1px solid #f4f1ea;transition:background .1s}
.ditem:last-child{border-bottom:none}
.ditem:hover,.ditem.foc{background:var(--s2)}
.dimg{width:44px;height:44px;object-fit:contain;border-radius:7px;border:1px solid var(--border);background:var(--s2);flex-shrink:0}
.dph{width:44px;height:44px;border-radius:7px;border:1px solid var(--border);background:var(--s2);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:var(--hint);text-align:center;padding:3px}
.dinfo{flex:1;min-width:0}
.dname{font-size:.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.dsub{font-size:.7rem;color:var(--muted);margin-top:1px}
.dright{text-align:right;flex-shrink:0}
.dprice{font-size:.85rem;font-weight:500;color:var(--green);white-space:nowrap}
.dprice.gray{color:var(--muted)}
.dstores{font-size:.68rem;color:var(--hint);margin-top:1px}
.dempty{padding:16px;font-size:.82rem;color:var(--hint);text-align:center}
.ilist{display:flex;flex-direction:column;gap:5px;min-height:50px;margin-bottom:1rem;max-height:300px;overflow-y:auto}
.irow{display:flex;align-items:center;gap:9px;padding:8px 11px;background:var(--s2);border-radius:8px;animation:sIn .18s ease}
@keyframes sIn{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
.iimg{width:34px;height:34px;object-fit:contain;border-radius:5px;border:1px solid var(--border);background:#fff;flex-shrink:0}
.iph{width:34px;height:34px;border-radius:5px;border:1px solid var(--border);background:#fff;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:var(--hint);text-align:center}
.iinfo{flex:1;min-width:0}
.iname{font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.imeta{font-size:.7rem;color:var(--muted);margin-top:1px}
.qw{display:flex;align-items:center;gap:5px;flex-shrink:0}
.qb{width:24px;height:24px;border-radius:50%;border:1px solid var(--border);background:#fff;color:var(--text);font-size:.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center}
.qb:hover{background:var(--border)}
.qn{font-size:.8rem;font-weight:500;min-width:16px;text-align:center}
.xb{width:24px;height:24px;border-radius:50%;border:none;background:none;color:var(--hint);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.xb:hover{color:var(--red)}
.emph{font-size:.82rem;color:var(--hint);padding:14px 0;text-align:center}
.bgrp{display:flex;flex-direction:column;gap:7px}
.bacc{height:44px;border-radius:9px;border:none;background:var(--accent);color:#fff;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;cursor:pointer;transition:opacity .15s}
.bacc:hover:not(:disabled){opacity:.88}
.bacc:disabled{opacity:.4;cursor:default}
.bout{height:38px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.82rem;cursor:pointer;transition:all .15s;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px}
.bout:hover{background:var(--s2);color:var(--text);border-color:var(--text)}
#res{display:flex;flex-direction:column;gap:1.5rem}
.lbox{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:3rem;text-align:center}
.bigspin{width:36px;height:36px;border:2px solid var(--border);border-top-color:var(--text);border-radius:50%;margin:0 auto 1rem;animation:spin .65s linear infinite}
.lbox p{font-size:.9rem;color:var(--muted);margin-bottom:.4rem}
.lbox small{font-size:.78rem;color:var(--hint);display:block}
.sumrow{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.stat .sl{font-size:.67rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:5px}
.stat .sv{font-family:'DM Serif Display',serif;font-size:1.5rem;line-height:1;color:var(--text)}
.stat .ss{font-size:.74rem;color:var(--muted);margin-top:4px}
.tabs{display:flex;gap:6px;flex-wrap:wrap}
.tab{padding:7px 14px;border-radius:999px;border:1px solid var(--border);background:var(--surface);font-family:'DM Sans',sans-serif;font-size:.8rem;color:var(--muted);cursor:pointer;transition:all .15s;white-space:nowrap}
.tab:hover{border-color:var(--text);color:var(--text)}
.tab.act{background:var(--text);color:var(--bg);border-color:var(--text);font-weight:500}
.tsub{opacity:.65;margin-left:5px}
.dcard{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.dhead{padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:8px}
.dhn{font-size:1.05rem;font-weight:500}
.dht{font-family:'DM Serif Display',serif;font-size:1.4rem}
.badge{font-size:.68rem;font-weight:500;padding:3px 10px;border-radius:999px;margin-left:7px;vertical-align:middle}
.bg{background:var(--gbg);color:var(--green)}
.bd{background:var(--rbg);color:var(--red)}
.bb{background:var(--bbg);color:var(--blue)}
.pt{width:100%;border-collapse:collapse;font-size:.85rem}
.pt th{text-align:left;padding:7px 14px;color:var(--muted);font-weight:400;font-size:.67rem;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--border);background:var(--s2)}
.pt th:last-child,.pt td:last-child{text-align:right}
.pt td{padding:9px 14px;border-bottom:1px solid #f5f2eb;color:var(--text);vertical-align:middle}
.pt tr:last-child td{border-bottom:none}
.pt tr:hover td{background:#faf8f3}
.cg{color:var(--green);font-weight:500}
.cr{color:var(--red)}
.ch{color:var(--hint);font-style:italic;font-size:.78rem}
.dtag{display:inline-block;font-size:.62rem;font-weight:500;padding:2px 6px;border-radius:999px;margin-left:6px;vertical-align:middle}
.dtag-eta{background:var(--bbg);color:var(--blue)}
.dtag-sale{background:var(--gbg);color:var(--green)}
.rimg{width:28px;height:28px;object-fit:contain;border-radius:4px;vertical-align:middle;margin-right:7px;border:1px solid var(--border)}
.strike{text-decoration:line-through;color:var(--hint);font-size:.75rem;margin-left:5px}
.split-intro{font-size:.82rem;color:var(--muted);margin-bottom:1rem;line-height:1.6}
.spgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.spc{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem 1.1rem;display:flex;flex-direction:column}
.spstore{font-size:.95rem;font-weight:500;margin-bottom:2px}
.spcnt{font-size:.72rem;color:var(--muted);margin-bottom:9px;padding-bottom:7px;border-bottom:1px solid var(--border)}
.spitem{display:flex;align-items:center;gap:7px;font-size:.82rem;padding:5px 0;border-bottom:1px solid #f5f2eb}
.spitem:last-of-type{border-bottom:none}
.spimg{width:24px;height:24px;object-fit:contain;border-radius:3px;flex-shrink:0;border:1px solid var(--border)}
.spname{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sptag{font-size:.6rem;padding:1px 5px;border-radius:999px;white-space:nowrap;flex-shrink:0}
.sptag-eta{background:var(--bbg);color:var(--blue)}
.sptag-sale{background:var(--gbg);color:var(--green)}
.spprice{color:var(--muted);white-space:nowrap;flex-shrink:0}
.spfoot{margin-top:10px;padding-top:8px;border-top:1px solid var(--border)}
.sptot{display:flex;justify-content:space-between;font-size:.875rem;font-weight:500}
.disc{font-size:.74rem;color:var(--hint);text-align:center;line-height:1.7}
.disc a{color:var(--muted);text-decoration:underline}
</style>
</head>
<body>
<header>
  <div><div class="logo">Handle<span>hjelpen</span></div><div class="hdr-sub">Kassalapp produktsøk · eTilbudsavis ukenstilbud · Prissammenligning</div></div>
  <div class="pills">
    <div class="pill p-gray" id="pKassal">Kassalapp: sjekker…</div>
    <div class="pill p-gray" id="pEta">eTilbudsavis: sjekker…</div>
  </div>
</header>
<div class="wrap">
  <div class="sidebar">
    <div class="card"><div class="ctitle">Velg dine butikker</div><div class="sgrid" id="storeGrid"></div></div>
    <div class="card">
      <div class="ctitle">Handleliste</div>
      <div class="srchwrap" id="srchwrap">
        <div class="srchrow"><input type="text" id="srchInp" placeholder="Søk etter produkt…" autocomplete="off"/><button class="badd" onclick="addFreetext()">Legg til</button></div>
        <div class="drop" id="drop"></div>
      </div>
      <div style="font-size:.71rem;color:var(--hint);margin-bottom:.8rem;line-height:1.5">Skriv f.eks. «Yt yoghurt» og velg riktig variant</div>
      <div class="ilist" id="ilist"><div class="emph">Søk etter produkter ovenfor</div></div>
      <div class="bgrp">
        <button class="bacc" id="goBtn" onclick="go()">Finn beste priser</button>
        <a class="bout" href="https://etilbudsavis.no" target="_blank">Åpne eTilbudsavis →</a>
      </div>
    </div>
  </div>
  <div id="res">
    <div class="card" style="text-align:center;padding:3rem 2rem">
      <div style="font-family:'DM Serif Display',serif;font-size:1.25rem;color:var(--muted);margin-bottom:.6rem">Klar til å hjelpe!</div>
      <div style="font-size:.875rem;color:var(--hint);line-height:2">1. Velg butikkene du har i nærheten<br>2. Søk etter produkter og velg riktig variant<br>3. Trykk <strong style="color:var(--text)">Finn beste priser</strong></div>
    </div>
  </div>
</div>
<script>
const STORES=[{id:'REMA_1000',name:'Rema 1000',color:'#e63b2e'},{id:'KIWI',name:'Kiwi',color:'#f5a623'},{id:'MENY_NO',name:'Meny',color:'#c8002a'},{id:'COOP_EXTRA',name:'Coop Extra',color:'#e8340c'},{id:'COOP_OBS',name:'Obs',color:'#1269b0'},{id:'COOP_PRIX',name:'Coop Prix',color:'#009b3a'},{id:'COOP_MARKED',name:'Coop Marked',color:'#ff6600'},{id:'COOP_MEGA',name:'Coop Mega',color:'#e5001c'},{id:'SPAR_NO',name:'Spar',color:'#007a3d'},{id:'JOKER_NO',name:'Joker',color:'#cc0000'},{id:'BUNNPRIS',name:'Bunnpris',color:'#e4002b'}];
function etaMatch(n){if(!n)return null;n=n.toLowerCase();const m={'rema':'REMA_1000','kiwi':'KIWI','meny':'MENY_NO','extra':'COOP_EXTRA','obs':'COOP_OBS','prix':'COOP_PRIX','marked':'COOP_MARKED','mega':'COOP_MEGA','spar':'SPAR_NO','joker':'JOKER_NO','bunnpris':'BUNNPRIS'};for(const[k,v]of Object.entries(m))if(n.includes(k))return v;return null;}
let sel=new Set(['REMA_1000','KIWI','MENY_NO','COOP_EXTRA','COOP_OBS','COOP_PRIX']),items=[],etaOk=false,activeTab=0;
async function api(path){const r=await fetch(path);if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}
async function checkStatus(){
  try{const s=await api('/api/status');setPill('pKassal',s.kassal?'Kassalapp ✓':'Kassalapp: sjekk nøkkel',s.kassal?'pill p-ok':'pill p-err');}catch{setPill('pKassal','Server feil','pill p-err');}
  try{await api('/api/offers?q=melk');etaOk=true;setPill('pEta','eTilbudsavis ✓','pill p-ok');}catch{setPill('pEta','eTilbudsavis: feil','pill p-err');}
}
function setPill(id,t,c){const p=document.getElementById(id);p.textContent=t;p.className=c;}
function renderStores(){document.getElementById('storeGrid').innerHTML=STORES.map(s=>'<label class="schip'+(sel.has(s.id)?' on':'')+'"><input type="checkbox" '+(sel.has(s.id)?'checked':'')+' onchange="toggleS(\''+s.id+'\',this)"><span class="sdot" style="background:'+s.color+'"></span><span>'+s.name+'</span></label>').join('');}
function toggleS(id,cb){cb.checked?sel.add(id):sel.delete(id);renderStores();}
let acTimer=null,acQuery='',acRes=[],acIdx=-1;
const srchInp=document.getElementById('srchInp'),drop=document.getElementById('drop');
srchInp.addEventListener('input',()=>{const q=srchInp.value.trim();if(q.length<2){closeDrop();return;}acQuery=q;clearTimeout(acTimer);drop.className='drop open';drop.innerHTML='<div class="dload"><div class="mspin"></div>Søker…</div>';acTimer=setTimeout(()=>doSearch(q),350);});
srchInp.addEventListener('keydown',e=>{if(!drop.classList.contains('open'))return;if(e.key==='ArrowDown'){e.preventDefault();moveFocus(1);}else if(e.key==='ArrowUp'){e.preventDefault();moveFocus(-1);}else if(e.key==='Enter'){e.preventDefault();acIdx>=0&&acIdx<acRes.length?pickProduct(acRes[acIdx]):addFreetext();}else if(e.key==='Escape')closeDrop();});
document.addEventListener('click',e=>{if(!document.getElementById('srchwrap').contains(e.target))closeDrop();});
function closeDrop(){drop.className='drop';acIdx=-1;}
async function doSearch(q){if(q!==acQuery)return;try{const d=await api('/api/search?q='+encodeURIComponent(q));if(q!==acQuery)return;acRes=d.data||[];if(!acRes.length){drop.innerHTML='<div class="dempty">Ingen produkter funnet</div>';return;}const selIds=[...sel];const inSel=[],other=[];acRes.forEach(p=>{const gs=(p.store_prices||[]).map(sp=>sp.store?.group).filter(Boolean);gs.some(g=>selIds.includes(g))?inSel.push(p):other.push(p);});let html='';if(inSel.length){html+='<div class="dsec">I dine butikker ('+inSel.length+')</div>';inSel.forEach((p,i)=>{html+=pRow(p,i);});}if(other.length){html+='<div class="dsec">Andre butikker ('+other.length+')</div>';other.forEach((p,i)=>{html+=pRow(p,i+inSel.length);});}drop.className='drop open';drop.innerHTML=html;}catch{drop.innerHTML='<div class="dempty">Søkefeil</div>';}}
function pRow(p,idx){const selIds=[...sel];const sp=(p.store_prices||[]).filter(x=>selIds.includes(x.store?.group)).map(x=>x.price).filter(x=>x!=null);const ap=(p.store_prices||[]).map(x=>x.price).filter(x=>x!=null);const minP=sp.length?Math.min(...sp):ap.length?Math.min(...ap):null;const img=p.image?'<img class="dimg" src="'+esc(p.image)+'" alt="" onerror="this.style.display=\'none\'">':'<div class="dph">'+esc((p.name||'').slice(0,10))+'</div>';return'<div class="ditem" onclick="pickProduct(acRes['+idx+'])">'+img+'<div class="dinfo"><div class="dname">'+esc(p.name||'')+'</div><div class="dsub">'+esc(p.brand||'')+(p.weight?' · '+p.weight:'')+'</div></div><div class="dright"><div class="dprice'+(sp.length?'':' gray')+'">'+(minP!=null?'fra '+minP.toFixed(2)+' kr':'ingen pris')+'</div><div class="dstores">'+((p.store_prices||[]).length)+' butikker</div></div></div>';}
function moveFocus(dir){const rows=drop.querySelectorAll('.ditem');if(!rows.length)return;if(acIdx>=0)rows[acIdx]?.classList.remove('foc');acIdx=Math.max(0,Math.min(rows.length-1,acIdx+dir));rows[acIdx]?.classList.add('foc');rows[acIdx]?.scrollIntoView({block:'nearest'});}
function pickProduct(p){if(!p)return;closeDrop();srchInp.value='';if(items.find(i=>i.ean&&i.ean===p.ean)){items.find(i=>i.ean===p.ean).qty++;renderItems();return;}items.push({id:Date.now(),ean:p.ean||null,name:p.name||'',brand:p.brand||p.vendor||'',weight:p.weight||'',image:p.image||null,store_prices:p.store_prices||[],qty:1});renderItems();}
function addFreetext(){const v=srchInp.value.trim();if(!v)return;closeDrop();srchInp.value='';if(items.find(i=>i.name.toLowerCase()===v.toLowerCase()))return;items.push({id:Date.now(),ean:null,name:v,brand:'',weight:'',image:null,store_prices:[],qty:1});renderItems();}
function delItem(id){items=items.filter(i=>i.id!==id);renderItems();}
function adjQty(id,d){const it=items.find(i=>i.id===id);if(it)it.qty=Math.max(1,it.qty+d);renderItems();}
function renderItems(){const el=document.getElementById('ilist');if(!items.length){el.innerHTML='<div class="emph">Søk etter produkter ovenfor</div>';return;}el.innerHTML=items.map(it=>{const sp=(it.store_prices||[]).filter(x=>sel.has(x.store?.group)).map(x=>x.price).filter(x=>x!=null);const minP=sp.length?Math.min(...sp):null;const meta=[it.brand,it.weight,minP?'fra '+minP.toFixed(2)+' kr':null].filter(Boolean).join(' · ');const img=it.image?'<img class="iimg" src="'+esc(it.image)+'" alt="" onerror="this.style.display=\'none\'">':'<div class="iph">'+esc((it.name||'').slice(0,4))+'</div>';return'<div class="irow">'+img+'<div class="iinfo"><div class="iname">'+esc(it.name)+'</div><div class="imeta">'+esc(meta||'ingen pris ennå')+'</div></div><div class="qw"><button class="qb" onclick="adjQty('+it.id+',-1)">−</button><span class="qn">'+it.qty+'</span><button class="qb" onclick="adjQty('+it.id+',1)">+</button></div><button class="xb" onclick="delItem('+it.id+')">×</button></div>';}).join('');}
async function go(){if(!items.length)return;if(!sel.size){alert('Velg minst én butikk');return;}const btn=document.getElementById('goBtn');btn.disabled=true;btn.textContent='Henter priser…';document.getElementById('res').innerHTML='<div class="lbox"><div class="bigspin"></div><p>Henter priser og ukenstilbud…</p><small>Kassalapp + eTilbudsavis kombineres</small></div>';const storeList=STORES.filter(s=>sel.has(s.id));
await Promise.all(items.map(async it=>{if(!it.store_prices.length){try{const d=await api('/api/search?q='+encodeURIComponent(it.name));if(d.data?.length){it.store_prices=d.data[0].store_prices||[];if(!it.image)it.image=d.data[0].image||null;}}catch{}}}));
const etaMap={};if(etaOk){await Promise.all(items.map(async it=>{etaMap[it.id]={};try{const offers=await api('/api/offers?q='+encodeURIComponent(it.name));if(!Array.isArray(offers))return;offers.forEach(o=>{const sid=etaMatch(o.branding?.name);if(!sid||!sel.has(sid))return;const p=o.pricing?.price?o.pricing.price/100:null;if(!p)return;if(!etaMap[it.id][sid]||p<etaMap[it.id][sid])etaMap[it.id][sid]=p;});}catch{}}));}
const sd=storeList.map(s=>{const its=items.map(it=>{const sp=it.store_prices.find(p=>p.store?.group===s.id);const np=sp?sp.price:null,ep=etaMap[it.id]?.[s.id]??null;let fp=null,isEta=false,isSale=false;if(np!=null&&ep!=null){if(ep<np){fp=ep;isEta=true;isSale=true;}else fp=np;}else if(np!=null)fp=np;else if(ep!=null){fp=ep;isEta=true;}return{name:it.name,brand:it.brand,qty:it.qty,image:it.image,np,ep,fp,isEta,isSale};});const total=its.reduce((s,i)=>s+(i.fp!=null?i.fp*i.qty:0),0);return{...s,items:its,total};}).sort((a,b)=>a.total-b.total);
window._sd=sd;activeTab=0;renderResults(sd);btn.disabled=false;btn.textContent='Oppdater priser';}
function renderResults(sd){const area=document.getElementById('res');area.innerHTML='';const cheap=sd[0],pricey=sd[sd.length-1],etaCount=sd.reduce((n,s)=>n+s.items.filter(i=>i.isEta).length,0);const sum=document.createElement('div');sum.className='sumrow';sum.innerHTML='<div class="stat"><div class="sl">Billigst totalt</div><div class="sv">'+esc(cheap.name)+'</div><div class="ss">'+cheap.total.toFixed(2)+' kr</div></div><div class="stat"><div class="sl">Maks sparing</div><div class="sv">'+(pricey.total-cheap.total).toFixed(0)+' kr</div><div class="ss">vs. '+esc(pricey.name)+'</div></div><div class="stat"><div class="sl">Ukenstilbud funnet</div><div class="sv">'+etaCount+'</div><div class="ss">fra eTilbudsavis</div></div>';area.appendChild(sum);const tw=document.createElement('div');tw.className='tabs';tw.id='tabs';area.appendChild(tw);const dw=document.createElement('div');dw.id='dw';area.appendChild(dw);const sw=document.createElement('div');sw.className='card';sw.innerHTML='<div class="ctitle">Anbefalte handlelister per butikk</div><p class="split-intro">Varene fordeles dit de er billigst. <span class="dtag dtag-eta" style="margin-left:4px">eTilbudsavis</span> = ukenstilbud <span class="dtag dtag-sale" style="margin-left:8px">Salg</span> = billigere enn normalpris</p><div class="spgrid" id="spgrid"></div>';area.appendChild(sw);const dc=document.createElement('p');dc.className='disc';dc.innerHTML='Priser fra <a href="https://kassal.app" target="_blank">Kassalapp</a> · Ukenstilbud fra <a href="https://etilbudsavis.no" target="_blank">eTilbudsavis</a>';area.appendChild(dc);renderTabs(sd);renderDetail(sd);renderSplit(sd);}
function renderTabs(sd){document.getElementById('tabs').innerHTML=sd.map((s,i)=>{const ec=s.items.filter(x=>x.isEta).length;return'<button class="tab'+(i===activeTab?' act':'')+'" onclick="swTab('+i+')">'+esc(s.name)+'<span class="tsub">'+(ec?ec+' tilbud':s.total>0?s.total.toFixed(0)+' kr':'–')+'</span></button>';}).join('');}
function swTab(i){activeTab=i;renderTabs(window._sd);renderDetail(window._sd);}
function renderDetail(sd){const s=sd[activeTab],isBest=activeTab===0,isWorst=activeTab===sd.length-1;const pm={};items.forEach(it=>{const ps=sd.map(st=>st.items.find(si=>si.name===it.name)?.fp).filter(p=>p!=null);if(ps.length)pm[it.name]={min:Math.min(...ps),max:Math.max(...ps)};});const savedByEta=s.items.reduce((a,it)=>it.isSale&&it.np&&it.ep?a+(it.np-it.ep)*it.qty:a,0);const rows=s.items.map(it=>{const p=pm[it.name]||{};const cheap2=it.fp!=null&&p.min!=null&&Math.abs(it.fp-p.min)<0.005;const dear=it.fp!=null&&p.max!=null&&Math.abs(it.fp-p.max)<0.005&&p.max!==p.min;const priceTd=it.fp!=null?'<span class="'+(cheap2?'cg':dear?'cr':'')+'">'+it.fp.toFixed(2)+' kr</span>':'<span class="ch">ikke tilgj.</span>';const thumb=it.image?'<img class="rimg" src="'+esc(it.image)+'" alt="" onerror="this.style.display=\'none\'">':'';const brand=it.brand?'<span style="font-size:.7rem;color:var(--hint);margin-left:5px">'+esc(it.brand)+'</span>':'';const etaTag=it.isEta?'<span class="dtag dtag-eta">eTilbudsavis</span>':'';const saleTag=it.isSale?'<span class="dtag dtag-sale">Salg</span>':'';const strike=it.isSale&&it.np?'<span class="strike">'+it.np.toFixed(2)+' kr</span>':'';return'<tr><td>'+thumb+esc(it.name)+brand+etaTag+saleTag+strike+'</td><td>'+it.qty+'</td><td>'+priceTd+'</td><td>'+(it.fp!=null?(it.fp*it.qty).toFixed(2)+' kr':'—')+'</td></tr>';}).join('');document.getElementById('dw').innerHTML='<div class="dcard"><div class="dhead"><div><span class="dhn">'+esc(s.name)+'</span>'+(isBest?'<span class="badge bg">Billigst</span>':'')+(isWorst&&sd.length>1?'<span class="badge bd">Dyrest</span>':'')+(savedByEta>0.5?'<span class="badge bb">Sparer '+savedByEta.toFixed(0)+' kr på tilbud</span>':'')+'</div><span class="dht">'+(s.total>0?s.total.toFixed(2)+' kr':'–')+'</span></div><table class="pt"><thead><tr><th>Vare</th><th>Ant.</th><th>Pris/stk</th><th>Sum</th></tr></thead><tbody>'+rows+'</tbody></table></div>';}
function renderSplit(sd){const sm={};items.forEach(it=>{let best=null,bestP=Infinity,bEta=false,bSale=false;sd.forEach(s=>{const si=s.items.find(i=>i.name===it.name);if(si&&si.fp!=null&&si.fp<bestP){bestP=si.fp;best=s;bEta=si.isEta;bSale=si.isSale;}});if(!best)return;if(!sm[best.id])sm[best.id]={store:best,its:[]};sm[best.id].its.push({name:it.name,qty:it.qty,price:bestP,image:it.image,isEta:bEta,isSale:bSale});});const priceyTot=sd[sd.length-1].total;const splitTot=Object.values(sm).reduce((a,x)=>a+x.its.reduce((b,i)=>b+i.price*i.qty,0),0);const grid=document.getElementById('spgrid');if(!Object.keys(sm).length){grid.innerHTML='<p style="font-size:.82rem;color:var(--hint)">Ingen prisdata tilgjengelig</p>';return;}let html='<div class="spc" style="background:var(--s2);border:1.5px solid var(--accent)"><div class="spstore" style="color:var(--accent)">Optimal handlerunde</div><div class="spcnt">'+Object.keys(sm).length+' butikk'+(Object.keys(sm).length!==1?'er':'')+' totalt</div><div class="spitem"><span class="spname">Total handletur</span><span class="spprice" style="font-weight:500;color:var(--text)">'+splitTot.toFixed(2)+' kr</span></div><div class="spitem"><span class="spname">Du sparer vs. dyrest</span><span class="spprice" style="color:var(--green);font-weight:500">'+(priceyTot-splitTot).toFixed(2)+' kr</span></div></div>';html+=Object.values(sm).map(x=>{const tot=x.its.reduce((a,i)=>a+i.price*i.qty,0);const ec=x.its.filter(i=>i.isEta).length;return'<div class="spc"><div class="spstore">'+esc(x.store.name)+'</div><div class="spcnt">'+x.its.length+' vare'+(x.its.length!==1?'r':'')+(ec?' · '+ec+' tilbud':'')+'</div>'+x.its.map(i=>'<div class="spitem">'+(i.image?'<img class="spimg" src="'+esc(i.image)+'" alt="" onerror="this.style.display=\'none\'">':'')+'<span class="spname">'+(i.qty>1?i.qty+'× ':'')+esc(i.name)+'</span>'+(i.isEta?'<span class="sptag sptag-eta">eTilbudsavis</span>':'')+(i.isSale?'<span class="sptag sptag-sale">Salg</span>':'')+'<span class="spprice">'+(i.price*i.qty).toFixed(2)+' kr</span></div>').join('')+'<div class="spfoot"><div class="sptot"><span>Sum</span><span>'+tot.toFixed(2)+' kr</span></div></div></div>';}).join('');grid.innerHTML=html;}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
renderStores();renderItems();checkStatus();
</script>
</body>
</html>`);
});

app.listen(PORT, () => console.log('Kjører på port ' + PORT));
