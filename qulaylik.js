(function(){
'use strict';
if(window.__qz)return;window.__qz=1;
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var st={a:LS.get('qz_a','new'),f:+LS.get('qz_f','0')||0,c:+LS.get('qz_c','0')||0};
var RX=/[şŞçÇöÖğĞ]/;
var UP=/[A-ZÇŞÖĞ]/;
function tr(s){return s.replace(/[şŞçÇöÖğĞ]/g,function(c,i,str){
 switch(c){
  case 'ş':return 'sh';case 'ç':return 'ch';case 'ö':return 'oʻ';case 'ğ':return 'gʻ';
  case 'Ö':return 'Oʻ';case 'Ğ':return 'Gʻ';
  default:{var up=UP.test(str.charAt(i+1))||UP.test(str.charAt(i-1));var b=c==='Ş'?'S':'C';return up?b+'H':b+'h'}
 }})}
var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,CODE:1};
var AT=['placeholder','title','alt','aria-label'];
var rec=[],arec=[],T0=null;
function skip(n){var p=n.parentNode;if(!p||SKIP[p.nodeName])return true;return !!(p.closest&&p.closest('[data-noalpha]'))}
function conv(n){var v=n.nodeValue;if(!v||!RX.test(v)||skip(n))return;var c=tr(v);rec.push([n,v,c]);n.nodeValue=c}
function attrs(root){var L=[];if(root.nodeType!==1)return;L.push(root);var q=root.querySelectorAll('[placeholder],[title],[alt],[aria-label]');for(var i=0;i<q.length;i++)L.push(q[i]);
 for(var j=0;j<L.length;j++){var e=L[j];if(e.closest&&e.closest('[data-noalpha]'))continue;for(var k=0;k<AT.length;k++){var v=e.getAttribute(AT[k]);if(v&&RX.test(v)){var c=tr(v);arec.push([e,AT[k],v,c]);e.setAttribute(AT[k],c)}}}}
function walk(root){if(root.nodeType===3){conv(root);return}if(root.nodeType!==1||SKIP[root.nodeName])return;
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),a=[],n;while((n=w.nextNode()))a.push(n);for(var i=0;i<a.length;i++)conv(a[i]);attrs(root)}
function revert(){for(var i=0;i<rec.length;i++){var r=rec[i];if(r[0].nodeValue===r[2])r[0].nodeValue=r[1]}rec=[];
 for(var j=0;j<arec.length;j++){var q=arec[j];if(q[0].getAttribute(q[1])===q[3])q[0].setAttribute(q[1],q[2])}arec=[]}
function applyAlpha(){
 if(st.a==='std'){walk(document.documentElement);if(T0===null&&RX.test(document.title)){T0=document.title;document.title=tr(T0)}}
 else{revert();if(T0!==null){document.title=T0;T0=null}}
 labelA()}
var mo=new MutationObserver(function(ms){if(st.a!=='std')return;
 for(var i=0;i<ms.length;i++){var m=ms[i];if(m.type==='childList'){for(var j=0;j<m.addedNodes.length;j++)walk(m.addedNodes[j])}else if(m.type==='characterData'){conv(m.target)}}});

var css='#qz{position:fixed;right:20px;top:13px;z-index:2147483000;font-family:"Times New Roman",Times,serif;display:flex;gap:8px;align-items:center}'
+'#qz .qzb{height:42px;min-width:42px;padding:0 12px;border-radius:21px;border:1px solid rgba(255,255,255,.3);background:#0f2a5c;color:#fff;font:700 14px "Times New Roman",Times,serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3);display:inline-flex;align-items:center;justify-content:center;gap:6px}'
+'#qz .qzb:hover{background:#17398a}'
+'#qz .qzp{position:absolute;right:0;left:auto;top:52px;width:300px;max-width:calc(100vw - 24px);box-sizing:border-box;background:#fff;color:#0f172a;border:1px solid #cbd5e1;border-radius:14px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-size:15px}'
+'#qz .qzp[hidden]{display:none}'
+'#qz .qzt{font-weight:700;margin-bottom:6px}#qz .qzl{color:#475569;margin:10px 0 6px;font-size:14px}'
+'#qz .qzr{display:flex;gap:6px}#qz .qzr button{flex:1;padding:9px 4px;border:1px solid #cbd5e1;border-radius:8px;background:#f8fafc;color:#0f172a;font:700 14px "Times New Roman",Times,serif;cursor:pointer}'
+'#qz .qzr button.on{background:#0f2a5c;border-color:#0f2a5c;color:#fff}'
+'#qz .qzn{color:#b45309;font-size:13px;margin-top:6px}'
+'#qz .qzx{margin-top:12px;width:100%;padding:9px;border:0;background:#e2e8f0;border-radius:8px;color:#0f172a;font:700 14px "Times New Roman",Times,serif;cursor:pointer}'
+'html.qz-f1 body{zoom:1.12}html.qz-f2 body{zoom:1.28}'
+'html.qz-c1 body,html.qz-c1 body *{background:#000!important;background-image:none!important;color:#fff!important;border-color:#ff0!important;box-shadow:none!important;text-shadow:none!important}'
+'html.qz-c1 body a,html.qz-c1 body a *{color:#ff0!important}'
+'html.qz-c2{filter:grayscale(1)}'
+'@media print{#qz{display:none}}';

var box,bA,bV,P,bS,note;
function $(s){return box.querySelector(s)}
function labelA(){if(!bA)return;if(st.a==='std'){bA.textContent='Ş · Ç · Ö · Ğ';bA.title='Yangi alifboga ötiş (ş, ç, ö, ğ)'}else{bA.textContent='Sh · Ch · Oʻ · Gʻ';bA.title='Standart alifboga oʻtish (sh, ch, oʻ, gʻ)'}}
function paint(){var h=document.documentElement;h.classList.remove('qz-f1','qz-f2','qz-c1','qz-c2');if(st.f)h.classList.add('qz-f'+st.f);if(st.c)h.classList.add('qz-c'+st.c);
 if(!box)return;var b=box.querySelectorAll('[data-f]');for(var i=0;i<b.length;i++)b[i].classList.toggle('on',+b[i].getAttribute('data-f')===st.f);
 b=box.querySelectorAll('[data-c]');for(var j=0;j<b.length;j++)b[j].classList.toggle('on',+b[j].getAttribute('data-c')===st.c)}
function build(){
 var st0=document.createElement('style');st0.id='qz-css';st0.textContent=css;document.head.appendChild(st0);
 box=document.createElement('div');box.id='qz';
 box.innerHTML='<button type="button" class="qzb" id="qzA" data-noalpha></button>'
 +'<button type="button" class="qzb" id="qzV" aria-label="Köriş imkoniyati" title="Köriş imkoniyati"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg></button>'
 +'<div class="qzp" id="qzP" hidden><div class="qzt">Köriş imkoniyati çeklanganlar uçun</div>'
 +'<div class="qzl">Şrift ölçami:</div><div class="qzr"><button type="button" data-f="0">A</button><button type="button" data-f="1">A+</button><button type="button" data-f="2">A++</button></div>'
 +'<div class="qzl">Ranglar kontrasti:</div><div class="qzr"><button type="button" data-c="0">Oddiy</button><button type="button" data-c="1">Kontrast</button><button type="button" data-c="2">Oq-qora</button></div>'
  +'<button type="button" class="qzx" id="qzX">Asliga qaytariş</button></div>';
 document.documentElement.appendChild(box);
 bA=$('#qzA');bV=$('#qzV');P=$('#qzP');
 bA.addEventListener('click',function(){st.a=st.a==='std'?'new':'std';LS.set('qz_a',st.a);applyAlpha()});
 bV.addEventListener('click',function(e){e.stopPropagation();P.hidden=!P.hidden});
 P.addEventListener('click',function(e){e.stopPropagation();var t=e.target;
  if(t.hasAttribute('data-f')){st.f=+t.getAttribute('data-f');LS.set('qz_f',st.f);paint()}
  else if(t.hasAttribute('data-c')){st.c=+t.getAttribute('data-c');LS.set('qz_c',st.c);paint()}
  else if(t.id==='qzX'){st.f=0;st.c=0;LS.set('qz_f',0);LS.set('qz_c',0);paint()}});
 document.addEventListener('click',function(){if(P)P.hidden=true});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&P)P.hidden=true});
 paint();labelA();
 if(st.a==='std')applyAlpha();
 mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
}
function init(){build()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('load',function(){if(st.a==='std')applyAlpha()});
})();
