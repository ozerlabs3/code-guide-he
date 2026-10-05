(function(){
var B=window.BOOK,app=document.getElementById('app'),drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim'),bar=document.querySelector('#bar i');
var KEY='kodrshet-done-v1',done={};
try{done=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var all=[];B.forEach(function(c,ci){c.i=ci;c.items.forEach(function(it,ii){it.ch=c;it.ii=ii;all.push(it)})});
var total=all.length;
function cdone(c){return c.items.filter(function(i){return done[i.id]}).length}
function sum(){return Object.keys(done).filter(function(k){return done[k]}).length}
var paths=[
 {t:'מסלול למתחילים מוחלטים',d:'מבינים מה קורה מאחורי אתר ומה הכלים הבסיסיים.',c:['internet','servers','code','frontend']},
 {t:'מסלול בונים אתר ושולחים לאוויר',d:'מהקוד ועד כתובת חיה שכל אחד יכול לפתוח.',c:['frontend','git','deploy','domains']},
 {t:'מסלול שרת, נתונים ואבטחה',d:'מה קורה מאחורי הקלעים כשיש משתמשים ומידע.',c:['http','backend','data','security','keys']},
 {t:'מסלול אוטומציה ובינה מלאכותית',d:'לגרום לדברים לקרות לבד, ולחבר מודלים לתוכנה.',c:['cloud','automation','ai']}
];
function byId(id){return B.filter(function(c){return c.id===id})[0]}
function buildDrawer(cur){
 var h='<h3>פרקים</h3>';
 B.forEach(function(c,i){h+='<a href="#/'+c.id+'" class="'+(cur===c.id?'cur ':'')+(cdone(c)===c.items.length?'done':'')+'"><span class="n">'+(i+1)+'</span><span>'+esc(c.title)+'</span></a>'});
 h+='<hr><a href="#/">דף הבית</a><a href="#/paths">מסלולי לימוד</a><a href="#/glossary">מילון מושגים</a><a href="#/search">חיפוש</a>';
 drawer.innerHTML=h;
}
function openD(o){drawer.classList.toggle('on',o);scrim.classList.toggle('on',o);document.getElementById('menuBtn').setAttribute('aria-expanded',o)}
document.getElementById('menuBtn').onclick=function(){openD(!drawer.classList.contains('on'))};
scrim.onclick=function(){openD(false)};
document.getElementById('searchBtn').onclick=function(){location.hash='#/search'};
drawer.addEventListener('click',function(e){if(e.target.closest('a'))openD(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')openD(false)});
function setBar(){var h=document.documentElement,m=h.scrollHeight-h.clientHeight;bar.style.width=(m>0?Math.min(100,h.scrollTop/m*100):0)+'%'}
window.addEventListener('scroll',setBar,{passive:true});
function view(html,title,cur){app.innerHTML='<div class="fade">'+html+'</div>';document.title=(title?title+' | ':'')+'מדריך הקוד והרשת בעברית';buildDrawer(cur);window.scrollTo(0,0);setBar();app.focus({preventScroll:true})}
function home(){
 var s=sum(),h='<section class="hero"><h1>לדעת מה קורה מאחורי הקלעים</h1><p>מדריך מקיף בעברית לעולם התכנות והאינטרנט. מהשאלה "מה זה שרת" ועד אבטחה, פריסה ובינה מלאכותית. בשפה פשוטה, עם דוגמאות.</p><a class="btn" href="#/'+B[0].id+'">מתחילים מהפרק הראשון</a> <a class="btn alt" href="#/search">חיפוש</a><div class="stats"><span>'+B.length+' פרקים</span><span>'+total+' מושגים</span><span>'+(s?s+' נקראו':'בחינם ובלי הרשמה')+'</span></div></section>';
 h+='<h2 class="sec">כל הפרקים</h2><div class="grid">';
 B.forEach(function(c,i){var d=cdone(c),p=Math.round(d/c.items.length*100);h+='<a class="card t'+(i%2+1)+'" href="#/'+c.id+'"><span class="num">פרק '+(i+1)+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p><div class="meta"><span>'+c.items.length+' מושגים</span><span class="prog"><i style="width:'+p+'%"></i></span><span>'+p+'%</span></div></a>'});
 h+='</div><h2 class="sec">לא יודעים מאיפה להתחיל</h2><div class="grid">';
 paths.slice(0,2).forEach(function(p){h+=pathHtml(p)});
 h+='</div><p style="margin-top:14px"><a href="#/paths">כל מסלולי הלימוד</a> | <a href="#/glossary">מילון מושגים</a></p><footer class="f">נבנה ב-OzerLabs. ההתקדמות שלך נשמרת רק בטלפון שלך.</footer>';
 view(h,'',null);
}
function pathHtml(p){return '<div class="path"><b>'+esc(p.t)+'</b><small>'+esc(p.d)+'</small><div class="chips">'+p.c.map(function(id){var c=byId(id);return '<a class="chip" href="#/'+id+'">'+esc(c.title)+'</a>'}).join('')+'</div></div>'}
function pathsView(){var h='<h1 class="ct">מסלולי לימוד</h1><p class="lead">לא חייבים לקרוא הכול לפי הסדר. בחרו מסלול לפי מה שמעניין אתכם עכשיו.</p><div class="grid">'+paths.map(pathHtml).join('')+'</div>';view(h,'מסלולי לימוד',null)}
function chapter(c){
 var h='<div class="crumb"><a href="#/">בית</a> / פרק '+(c.i+1)+'</div><h1 class="ct">'+esc(c.title)+'</h1><p class="lead">'+esc(c.desc)+'</p><div class="toc">';
 c.items.forEach(function(it){h+='<a href="#/'+c.id+'/'+it.id+'" class="'+(done[it.id]?'done':'')+'" data-t="'+it.id+'"><span class="tick">'+(done[it.id]?'&#10003;':'')+'</span><span>'+esc(it.title)+'</span></a>'});
 h+='</div>';
 c.items.forEach(function(it){h+=itemHtml(it)});
 var pv=B[c.i-1],nx=B[c.i+1];
 h+='<div class="pager">'+(pv?'<a href="#/'+pv.id+'"><small>הפרק הקודם</small>'+esc(pv.title)+'</a>':'')+(nx?'<a class="nx" href="#/'+nx.id+'"><small>הפרק הבא</small>'+esc(nx.title)+'</a>':'<a class="nx" href="#/glossary"><small>סיום</small>למילון המושגים</a>')+'</div>';
 view(h,c.title,c.id);
}
function itemHtml(it){return '<article class="item" id="'+it.id+'"><h2>'+esc(it.title)+'</h2><p class="def">'+esc(it.def)+'</p>'+it.html+'<button class="mark'+(done[it.id]?' on':'')+'" data-id="'+it.id+'"><span class="box">'+(done[it.id]?'&#10003;':'')+'</span><span>'+(done[it.id]?'סימנתי כנקרא':'סמן כנקרא')+'</span></button></article>'}
app.addEventListener('click',function(e){var b=e.target.closest('.mark');if(!b)return;var id=b.dataset.id;done[id]=!done[id];if(!done[id])delete done[id];save();b.classList.toggle('on',!!done[id]);b.querySelector('.box').innerHTML=done[id]?'&#10003;':'';b.querySelector('span:last-child').textContent=done[id]?'סימנתי כנקרא':'סמן כנקרא';var t=app.querySelector('.toc a[data-t="'+id+'"]');if(t){t.classList.toggle('done',!!done[id]);t.querySelector('.tick').innerHTML=done[id]?'&#10003;':''}buildDrawer(location.hash.split('/')[1])});
function hl(s,q){if(!q)return esc(s);var r=esc(s),k=esc(q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return r.replace(new RegExp('('+k+')','gi'),'<mark>$1</mark>')}
function searchView(q){
 var h='<h1 class="ct">חיפוש</h1><input class="q" id="qi" type="search" placeholder="חפשו מושג, למשל: API, סיסמה, DNS" autocomplete="off" enterkeyhint="search" value="'+esc(q||'')+'"><div id="out"></div>';
 view(h,'חיפוש',null);var qi=document.getElementById('qi');
 function run(){var v=qi.value.trim().toLowerCase(),o=document.getElementById('out');if(v.length<2){o.innerHTML='<p class="lead" style="margin-top:14px">'+total+' מושגים ב-'+B.length+' פרקים. התחילו להקליד.</p>';return}
  var r=[];all.forEach(function(it){var sc=0,t=it.title.toLowerCase();if(t.indexOf(v)>-1)sc+=10;if(it.def.toLowerCase().indexOf(v)>-1)sc+=4;if(it.text.toLowerCase().indexOf(v)>-1)sc+=1;if(sc)r.push([sc,it])});
  r.sort(function(a,b){return b[0]-a[0]});
  o.innerHTML=r.length?r.slice(0,40).map(function(x){var it=x[1];return '<a class="res" href="#/'+it.ch.id+'/'+it.id+'"><small>'+esc(it.ch.title)+'</small><b>'+hl(it.title,v)+'</b><span>'+hl(it.def,v)+'</span></a>'}).join(''):'<p class="lead" style="margin-top:14px">לא נמצא מושג כזה. נסו מילה אחרת.</p>'}
 qi.oninput=run;run();if(!q)qi.focus();
}
function glossary(){
 var items=all.slice().sort(function(a,b){return a.title.localeCompare(b.title,'he')}),h='<h1 class="ct">מילון מושגים</h1><p class="lead">'+total+' מושגים בסדר אלפביתי. הקשה על מושג פותחת את ההסבר המלא.</p>',last='';
 items.forEach(function(it){var l=it.title.charAt(0).toUpperCase();if(l!==last){h+='<div class="letter" dir="auto">'+esc(l)+'</div>';last=l}h+='<div class="gl"><a href="#/'+it.ch.id+'/'+it.id+'"><b>'+esc(it.title)+'</b><span>'+esc(it.def)+'</span></a></div>'});
 view(h,'מילון מושגים',null);
}
function route(){
 openD(false);
 var p=location.hash.replace(/^#\/?/,'').split('/'),a=p[0];
 if(!a)return home();
 if(a==='glossary')return glossary();
 if(a==='paths')return pathsView();
 if(a==='search')return searchView(decodeURIComponent(p[1]||''));
 var c=byId(a);if(!c){return view('<h1 class="ct">הדף לא נמצא</h1><p class="lead">אולי הקישור ישן. <a href="#/">חזרה לדף הבית</a></p>','לא נמצא',null)}
 chapter(c);
 if(p[1]){var el=document.getElementById(p[1]);if(el)setTimeout(function(){el.scrollIntoView();window.scrollBy(0,-62)},30)}
}
window.addEventListener('hashchange',route);route();
})();
