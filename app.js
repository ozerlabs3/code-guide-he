(function(){
var B=window.BOOK,app=document.getElementById('app'),drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim'),bar=document.querySelector('#bar i');
var KEY='kodrshet-done-v2',done={};
try{done=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
var QK='kodrshet-quiz-v2',qs={};try{qs=JSON.parse(localStorage.getItem(QK)||'{}')}catch(e){}
var PK='kodrshet-passed-v1',passed={};try{passed=JSON.parse(localStorage.getItem(PK)||'{}')}catch(e){}
function qsave(){try{localStorage.setItem(QK,JSON.stringify(qs))}catch(e){}}
function psave(){try{localStorage.setItem(PK,JSON.stringify(passed))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var all=[];B.forEach(function(c,ci){c.i=ci;c.items.forEach(function(it,ii){it.ch=c;it.ii=ii;all.push(it)})});
var total=all.length;
function cdone(c){return passed[c.id]?c.items.length:0}
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
 h+='<hr><a href="#/">דף הבית</a><a href="#/paths">מסלולי לימוד</a><a href="#/glossary">מילון מושגים</a><a href="#/exam">מבחן מסכם</a><a href="#/search">חיפוש</a>';
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
function view(html,title,cur){app.innerHTML='<div class="fade">'+html+'</div>';document.title=(title?title+' | ':'')+'מדריך הקוד והרשת בעברית';buildDrawer(cur);window.scrollTo({top:0,behavior:'instant'});setBar();hydrate();app.focus({preventScroll:true})}
function home(){
 var s=sum(),h='<section class="hero"><h1>לדעת מה קורה מאחורי הקלעים</h1><p>מדריך מקיף בעברית לעולם התכנות והאינטרנט. מהשאלה "מה זה שרת" ועד אבטחה, פריסה ובינה מלאכותית. בשפה פשוטה, עם דוגמאות.</p><a class="btn" href="#/'+B[0].id+'">מתחילים מהפרק הראשון</a> <a class="btn alt" href="#/search">חיפוש</a><div class="stats"><span>'+B.length+' פרקים</span><span>'+total+' מושגים</span><span>'+(s?s+' נקראו':'בחינם ובלי הרשמה')+'</span></div></section>';
 h+='<h2 class="sec">כל הפרקים</h2><div class="grid">';
 B.forEach(function(c,i){var d=cdone(c),p=Math.round(d/c.items.length*100);h+='<a class="card t'+(i%2+1)+'" href="#/'+c.id+'"><span class="num">פרק '+(i+1)+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p><div class="meta"><span>'+c.items.length+' מושגים</span><span class="prog"><i style="width:'+p+'%"></i></span><span>'+p+'%</span></div></a>'});
 h+='</div><h2 class="sec">לא יודעים מאיפה להתחיל</h2><div class="grid">';
 paths.slice(0,2).forEach(function(p){h+=pathHtml(p)});
 h+='</div><h2 class="sec">רוצים לבדוק את עצמכם</h2><a class="card quizcard" href="#/exam"><span class="num">מבחן מסכם</span><h3>20 שאלות מכל הפרקים</h3><p>שאלות תרחישיות מכל הפרקים, שונות משאלות התרגול. בכל פעם מבחן אחר.</p></a><p style="margin-top:14px"><a href="#/paths">כל מסלולי הלימוד</a> | <a href="#/glossary">מילון מושגים</a></p><footer class="f">נבנה ב-OzerLabs. ההתקדמות שלך נשמרת רק בטלפון שלך.</footer>';
 view(h,'',null);
}
function pathHtml(p){return '<div class="path"><b>'+esc(p.t)+'</b><small>'+esc(p.d)+'</small><div class="chips">'+p.c.map(function(id){var c=byId(id);return '<a class="chip" href="#/'+id+'">'+esc(c.title)+'</a>'}).join('')+'</div></div>'}
function pathsView(){var h='<h1 class="ct">מסלולי לימוד</h1><p class="lead">לא חייבים לקרוא הכול לפי הסדר. בחרו מסלול לפי מה שמעניין אתכם עכשיו.</p><div class="grid">'+paths.map(pathHtml).join('')+'</div>';view(h,'מסלולי לימוד',null)}
function chapter(c){
 var h='<div class="crumb"><a href="#/">בית</a> / פרק '+(c.i+1)+'</div><h1 class="ct">'+esc(c.title)+'</h1><p class="lead">'+esc(c.desc)+'</p><div class="toc">';
 c.items.forEach(function(it){h+='<a href="#/'+c.id+'/'+it.id+'" class="'+(done[it.id]?'done':'')+'" data-t="'+it.id+'"><span class="tick">'+(done[it.id]?'&#10003;':'')+'</span><span>'+esc(it.title)+'</span></a>'});
 h+='</div>';
 c.items.forEach(function(it){h+=itemHtml(it)});
 var nq=chQs(c).length;if(nq)h+='<a class="card quizcard" href="#/quiz/'+c.id+'"><span class="num">מבחן הפרק</span><h3>בדקו מה למדתם</h3><p>'+nq+' שאלות תרחישיות על הפרק הזה, שונות משאלות התרגול. אפשר לחזור ולנסות שוב.</p></a>';
 var pv=B[c.i-1],nx=B[c.i+1];
 h+='<div class="pager">'+(pv?'<a href="#/'+pv.id+'"><small>הפרק הקודם</small>'+esc(pv.title)+'</a>':'')+(nx?'<a class="nx" href="#/'+nx.id+'"><small>הפרק הבא</small>'+esc(nx.title)+'</a>':'<a class="nx" href="#/glossary"><small>סיום</small>למילון המושגים</a>')+'</div>';
 view(h,c.title,c.id);
}
function itemHtml(it){return '<article class="item" id="'+it.id+'"><h2>'+esc(it.title)+'</h2><p class="def">'+esc(it.def)+'</p>'+it.html+qHtml(it)+'<button class="mark'+(done[it.id]?' on':'')+'" data-id="'+it.id+'"><span class="box">'+(done[it.id]?'&#10003;':'')+'</span><span>'+(done[it.id]?'סימנתי כנקרא':'סמן כנקרא')+'</span></button></article>'}
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
 function k(t){return t.replace(/^[^\p{L}\p{N}]+/u,'')}var items=all.slice().sort(function(a,b){return k(a.title).localeCompare(k(b.title),'he')}),h='<h1 class="ct">מילון מושגים</h1><p class="lead">'+total+' מושגים בסדר אלפביתי. הקשה על מושג פותחת את ההסבר המלא.</p>',last='';
 items.forEach(function(it){var l=k(it.title).charAt(0).toUpperCase();if(l!==last){h+='<div class="letter" dir="auto">'+esc(l)+'</div>';last=l}h+='<div class="gl"><a href="#/'+it.ch.id+'/'+it.id+'"><b>'+esc(it.title)+'</b><span>'+esc(it.def)+'</span></a></div>'});
 view(h,'מילון מושגים',null);
}
function route(){
 openD(false);
 var p=location.hash.replace(/^#\/?/,'').split('/'),a=p[0];
 if(!a)return home();
 if(a==='glossary')return glossary();
 if(a==='paths')return pathsView();
 if(a==='quiz')return quizView(p[1]);
 if(a==='exam')return quizView('all');
 if(a==='search')return searchView(decodeURIComponent(p[1]||''));
 var c=byId(a);if(!c){return view('<h1 class="ct">הדף לא נמצא</h1><p class="lead">אולי הקישור ישן. <a href="#/">חזרה לדף הבית</a></p>','לא נמצא',null)}
 chapter(c);
 if(p[1]){var el=document.getElementById(p[1]);if(el)setTimeout(function(){el.scrollIntoView({behavior:'instant',block:'start'})},60)}
}

function shuf(a,seed){a=a.slice();var x=seed||1;function r(){x=(x*1664525+1013904223)%4294967296;return x/4294967296}for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function hsh(s){var h=7;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function chQs(c){return (c.exam||[]).map(function(q,i){var it=c.items.filter(function(it){return it.id===q.item})[0]||c.items[0];return {q:q,id:'exam:'+c.id+'#'+i,it:it}})}
function qHtml(it){if(!it.q)return '';return it.q.map(function(q,i){return qBlock(q,it.id+'#'+i,false)}).join('')}
function qBlock(q,id,full){
 var opts=shuf([q.a].concat(q.w),hsh(id)+(full?Math.floor(Math.random()*1e6):0)),st=qs[id];
 var h='<div class="qz" data-q="'+id+'"><b>'+(full?'':'בדקו את עצמכם')+'</b><p class="qq">'+esc(q.q)+'</p>';
 opts.forEach(function(o){h+='<button class="opt" data-a="'+(o===q.a?1:0)+'">'+esc(o)+'</button>'});
 return h+'<div class="exp" hidden></div></div>'}
function findQ(id){var p=id.split('#');if(p[0].indexOf('exam:')===0){return byId(p[0].slice(5)).exam[+p[1]]}var it=all.filter(function(i){return i.id===p[0]})[0];return it.q[+p[1]]}
document.addEventListener('click',function(e){
 var o=e.target.closest('.opt');if(!o)return;var box=o.closest('.qz');if(box.classList.contains('answered'))return;
 var id=box.dataset.q,q=findQ(id),ok=o.dataset.a==='1';box.classList.add('answered');
 box.querySelectorAll('.opt').forEach(function(b){if(b.dataset.a==='1')b.classList.add('right');b.disabled=true});
 if(!ok)o.classList.add('wrong');
 var ex=box.querySelector('.exp');ex.hidden=false;ex.innerHTML='<strong>'+(ok?'נכון.':'לא בדיוק.')+'</strong> '+esc(q.e);
 qs[id]=ok?(qs[id]===0?0:1):0;qsave();
 if(box.dataset.cb)window.__qcb(ok);
});
var Q=null;
function quizView(which){
 var pool,title;
 if(which==='all'){pool=[];B.forEach(function(c){pool=pool.concat(chQs(c))});pool=shuf(pool,Math.floor(Math.random()*1e9)).slice(0,20);title='מבחן מסכם'}
 else{var c=byId(which);if(!c)return route404();pool=shuf(chQs(c),Math.floor(Math.random()*1e9));title='מבחן: '+c.title}
 Q={pool:pool,i:0,score:0,wrong:[],title:title,which:which};qStep();
}
function route404(){view('<h1 class="ct">הדף לא נמצא</h1><p class="lead"><a href="#/">חזרה לדף הבית</a></p>','לא נמצא',null)}
function qStep(){
 var n=Q.pool.length;
 if(Q.i>=n){if(Q.which!=='all'&&n>0&&Q.score===n){passed[Q.which]=true;psave()}var pct=Math.round(Q.score/n*100),msg=pct>=90?'מצוין. אתם שולטים בחומר.':pct>=70?'יפה מאוד. עוד קצת תרגול ואתם שם.':pct>=50?'התחלה טובה. כדאי לעבור שוב על הפרקים החלשים.':'זה בסדר. חוזרים לפרק, קוראים ומנסים שוב.';
  var h='<div class="crumb"><a href="#/">בית</a></div><h1 class="ct">'+esc(Q.title)+'</h1><div class="score"><div class="big">'+Q.score+' מתוך '+n+'</div><p>'+msg+'</p></div>';
  if(Q.wrong.length){h+='<h2 class="sec">כדאי לחזור על</h2>';Q.wrong.forEach(function(w){h+='<a class="res" href="#/'+w.it.ch.id+'/'+w.it.id+'"><b>'+esc(w.it.title)+'</b><span>'+esc(w.q.q)+'</span></a>'})}
  h+='<div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="again">מבחן חדש</button><a class="btn alt" href="#/'+(Q.which==='all'?'':Q.which)+'">'+(Q.which==='all'?'לדף הבית':'חזרה לפרק')+'</a></div>';
  view(h,Q.title,null);document.getElementById('again').onclick=function(){quizView(Q.which)};return}
 var cur=Q.pool[Q.i],h='<div class="crumb"><a href="#/'+(Q.which==='all'?'':Q.which)+'">יציאה</a> / '+esc(Q.title)+'</div><div class="prog" style="margin:6px 0 18px"><i style="width:'+Math.round(Q.i/n*100)+'%"></i></div><p class="lead" style="margin:0 0 6px">שאלה '+(Q.i+1)+' מתוך '+n+'</p>';
 h+=qBlock(cur.q,cur.id,true).replace('data-q="','data-cb="1" data-q="')+'<div id="nxt" style="margin-top:16px" hidden><button class="btn" id="nb">'+(Q.i+1>=n?'לתוצאה':'השאלה הבאה')+'</button></div>';
 view(h,Q.title,null);
 window.__qcb=function(ok){if(ok)Q.score++;else Q.wrong.push(cur);document.getElementById('nxt').hidden=false;document.getElementById('nb').onclick=function(){Q.i++;qStep()}};
}

/* ---- labs ---- */
function hydrate(){app.querySelectorAll('.lab').forEach(function(el){var f=LABS[el.dataset.lab];if(f&&!el.dataset.on){el.dataset.on=1;f(el)}})}
function lab(el,title,sub,body){el.innerHTML='<div class="labh"><b>נסו בעצמכם</b><span>'+esc(title)+'</span></div><p class="labs">'+esc(sub)+'</p>'+body}
var LABS={
requestJourney:function(el){lab(el,'המסע של שמירה','הדגמה מקומית. בכל לחיצה מתקדמים שלב; אין בקשת רשת אמיתית ואין נתונים אישיים.','<div class="journey-track" aria-hidden="true"><span></span></div><p class="journey-status" aria-live="polite"></p><button class="btn" data-step>הצעד הבא</button> <button class="btn alt" data-reset>התחל מחדש</button>');var steps=['מוכנים: השינוי עדיין לא נשלח.','הלקוח שלח בקשה. השמירה עדיין לא אומתה.','השרת בדק הרשאה וקלט ושמר את הנתון בדוגמה.','התשובה חזרה. עכשיו אפשר לאמת את המזהה שהתקבל.','הלקוח עדכן את המסך. זהו שלב נפרד מהשמירה.'],n=0,o=el.querySelector('.journey-status'),dot=el.querySelector('.journey-track span'),next=el.querySelector('[data-step]');function draw(){o.textContent=steps[n];dot.style.left=(n*23)+'%';next.disabled=n===steps.length-1;next.textContent=n===steps.length-1?'המסע הושלם':'הצעד הבא'}next.onclick=function(){if(n<steps.length-1)n++;draw()};el.querySelector('[data-reset]').onclick=function(){n=0;draw()};draw()},

 locationQuality:function(el){lab(el,'האם המדידה מתאימה לשמירה?','סימולציה בלבד: לא מבקשים מיקום ולא שולחים נתונים. הספים כאן הם בחירה לימודית, לא תקן.','<label>דיוק במטרים<input class="in" type="number" min="0" step="any" value="25" data-field="accuracy"></label><label>גיל המדידה בשניות<input class="in" type="number" min="0" step="any" value="10" data-field="age"></label><label class="chk"><input type="checkbox" checked> הרשאה ניתנה</label><div class="out" aria-live="polite"></div>');
  var a=el.querySelector('[data-field="accuracy"]'),t=el.querySelector('[data-field="age"]'),p=el.querySelector('[type="checkbox"]'),o=el.querySelector('.out');function run(){var x=+a.value,y=+t.value,msg,ok=false;if(!p.checked)msg='אין הרשאה: לא שומרים מיקום ולא משנים את הנתון הקודם.';else if(a.value.trim()===''||t.value.trim()===''||!Number.isFinite(x)||!Number.isFinite(y)||x<=0||y<0)msg='נדרש דיוק חיובי וגיל מדידה של אפס ומעלה.';else if(y>60)msg='המדידה ישנה לפי כלל המעבדה (מעל 60 שניות). מבקשים מדידה חדשה.';else if(x>50)msg='הדיוק נמוך לפי כלל המעבדה (יותר מ-50 מטר). שומרים את הנקודה הקודמת ומציעים ניסיון חוזר.';else{ok=true;msg='עברה את ספי המעבדה. זה עדיין לא מוכיח שאתם ביעד או שהשמירה הצליחה.'}o.innerHTML='<p class="'+(ok?'good':'bad')+'">'+esc(msg)+'</p>'}a.oninput=t.oninput=p.onchange=run;run()},
 categoryMigration:function(el){lab(el,'מיגרציה קטנה עם ריצה חוזרת','שלוש רשומות דמה נשארות רק בדף הזה. משנים סוג בלבד, שומרים את יתר השדות ומנסים שוב.','<button class="btn" data-action="preview">תצוגה מקדימה</button> <button class="btn alt" data-action="apply">הפעל על נתוני הדמה</button> <button class="btn alt" data-action="reset">אפס מעבדה</button><div class="out" aria-live="polite"></div>');
  var original=[{id:'demo-1',type:'legacy',visits:2},{id:'demo-2',type:'chain',visits:5},{id:'demo-3',type:'legacy',visits:0}],rows,o=el.querySelector('.out');function reset(){rows=original.map(function(r){return Object.assign({},r)})}function draw(msg){o.innerHTML='<p>'+esc(msg)+'</p><table><tr><th>מזהה</th><th>סוג</th><th>ביקורים</th></tr>'+rows.map(function(r){return '<tr><td dir="ltr">'+esc(r.id)+'</td><td dir="ltr">'+esc(r.type)+'</td><td>'+r.visits+'</td></tr>'}).join('')+'</table>'}el.addEventListener('click',function(e){var b=e.target.closest('[data-action]');if(!b)return;var n=rows.filter(function(r){return r.type==='legacy'}).length;if(b.dataset.action==='reset'){reset();draw('המעבדה אופסה.')}else if(b.dataset.action==='preview')draw(n+' רשומות מתאימות לעדכון. עדיין לא השתנה דבר.');else{rows.forEach(function(r){if(r.type==='legacy')r.type='independent'});draw('עודכנו '+n+' רשומות. המזהים ומספרי הביקורים לא השתנו. לחצו שוב ובדקו כמה עודכנו הפעם.')}});reset();draw('קודם צפו ברשומות שמועמדות לעדכון. ריצה שנייה אינה משנה שוב רשומות שכבר הוסבו.')},

 url:function(el){lab(el,'פירוק כתובת URL','הדביקו כתובת וראו ממה היא בנויה.','<input class="in" dir="ltr" value="https://example.com/stores?city=rehovot&sort=name#map"><div class="out"></div>');
  var i=el.querySelector('input'),o=el.querySelector('.out');function run(){try{var u=new URL(i.value.trim()),rows=[['פרוטוקול',u.protocol.replace(':','')],['דומיין',u.hostname],['פורט',u.port||'ברירת מחדל'],['נתיב',u.pathname],['עוגן',u.hash||'אין']];var ps=[];u.searchParams.forEach(function(v,k){ps.push(k+' = '+v)});rows.splice(4,0,['פרמטרים',ps.length?ps.join(' | '):'אין']);o.innerHTML='<table>'+rows.map(function(r){return '<tr><th>'+r[0]+'</th><td dir="ltr">'+esc(r[1])+'</td></tr>'}).join('')+'</table>'}catch(e){o.innerHTML='<p class="bad">זו לא כתובת תקינה. צריך להתחיל ב-https://</p>'}}
  i.oninput=run;run()},
 json:function(el){lab(el,'בדיקת JSON','כתבו או שנו את הטקסט. רואים מיד אם הוא תקין.','<textarea class="in code" dir="ltr" rows="6" spellcheck="false">{"name": "חנות לדוגמה א", "visited": true, "tags": ["גדול", "מרכז"]}</textarea><div class="out"></div>');
  var t=el.querySelector('textarea'),o=el.querySelector('.out');function run(){try{var v=JSON.parse(t.value);o.innerHTML='<p class="good">תקין. כך זה נראה מסודר:</p><pre dir="ltr"><code>'+esc(JSON.stringify(v,null,2))+'</code></pre>'}catch(e){o.innerHTML='<p class="bad">לא תקין. בדקו מרכאות כפולות, פסיקים וסוגריים.</p><p dir="ltr" class="small">'+esc(e.message)+'</p>'}}
  t.oninput=run;run()},
 status:function(el){var C={200:['הצלחה','הבקשה עברה והשרת החזיר תוכן.'],201:['נוצר','משהו חדש נוצר בהצלחה.'],204:['אין תוכן','הצליח, אבל אין מה להחזיר.'],301:['הועבר לצמיתות','הכתובת התחלפה. הדפדפן עובר לחדשה.'],304:['לא השתנה','אפשר להשתמש בעותק השמור.'],400:['בקשה לא תקינה','משהו בבקשה שלך שגוי.'],401:['לא מחובר','צריך להזדהות קודם.'],403:['אין הרשאה','השרת יודע מי אתה, אבל אסור לך.'],404:['לא נמצא','אין משאב בכתובת הזאת.'],408:['הבקשה לקחה יותר מדי זמן','השרת ויתר על ההמתנה.'],418:['אני קומקום','בדיחת אפריל מ-1998.'],429:['יותר מדי בקשות','עברת את המגבלה. חכו קצת.'],500:['שגיאת שרת','משהו נשבר בצד השרת.'],502:['שער לא תקין','שרת אחד קיבל תשובה לא טובה מאחר.'],503:['השירות לא זמין','השרת עמוס או בתחזוקה.'],504:['שער פג זמן','שרת אחד לא קיבל תשובה בזמן.']};
  lab(el,'מילון קודי סטטוס','הקלידו קוד או לחצו על אחד.','<input class="in" type="number" inputmode="numeric" dir="ltr" value="404"><div class="chips" style="margin:10px 0">'+Object.keys(C).map(function(k){return '<button class="chip cb" data-c="'+k+'">'+k+'</button>'}).join('')+'</div><div class="out"></div>');
  var i=el.querySelector('input'),o=el.querySelector('.out');function run(){var c=+i.value,g=C[c];var cat=c>=500?'תקלה בשרת':c>=400?'טעות בצד הלקוח':c>=300?'הפניה':c>=200?'הצלחה':'לא מוכר';o.innerHTML=g?'<div class="stat"><b dir="ltr">'+c+'</b> '+g[0]+'<p>'+g[1]+'</p><small>קבוצה: '+cat+'</small></div>':'<p class="small">'+(c?'קוד בקבוצת "'+cat+'". לא מופיע ברשימה הקצרה שלנו.':'הקלידו מספר.')+'</p>'}
  i.oninput=run;el.addEventListener('click',function(e){var b=e.target.closest('.cb');if(b){i.value=b.dataset.c;run()}});run()},
 http:function(el){lab(el,'סימולטור בקשות','בחרו מתודה וכתובת. זה שרת דמה בתוך הדף, בלי רשת אמיתית.','<div class="row"><select class="in" id="m"><option>GET</option><option>POST</option><option>DELETE</option></select><select class="in" id="p" dir="ltr"><option>/stores</option><option>/stores/17</option><option>/stores/999</option><option>/admin</option><option>/crash</option></select></div><label class="chk"><input type="checkbox" id="l"> אני מחובר</label><button class="btn" id="go" style="margin-top:8px">שלח בקשה</button><div class="out"></div>');
  var o=el.querySelector('.out');el.querySelector('#go').onclick=function(){var m=el.querySelector('#m').value,p=el.querySelector('#p').value,lg=el.querySelector('#l').checked,s,b;
   if(p==='/crash'){s=500;b={error:'משהו נשבר בשרת'}}else if(p==='/admin'){if(!lg){s=401;b={error:'צריך להתחבר'}}else{s=403;b={error:'אין לך הרשאה'}}}
   else if(p==='/stores'){if(m==='GET'){s=200;b=[{id:17,name:'חנות לדוגמה א'},{id:18,name:'חנות לדוגמה ב'}]}else if(m==='POST'){if(!lg){s=401;b={error:'צריך להתחבר'}}else{s=201;b={id:19,name:'חנות חדשה'}}}else{s=405;b={error:'מתודה לא מותרת'}}}
   else if(p==='/stores/17'){if(m==='GET'){s=200;b={id:17,name:'חנות לדוגמה א'}}else if(m==='DELETE'){if(!lg){s=401;b={error:'צריך להתחבר'}}else{s=200;b={deleted:17}}}else{s=405;b={error:'מתודה לא מותרת'}}}
   else{s=404;b={error:'לא נמצא'}}
   o.innerHTML='<pre dir="ltr"><code>'+esc(m+' '+p+(lg?'\nAuthorization: Bearer ***':''))+'</code></pre><div class="stat '+(s<300?'ok':'no')+'"><b dir="ltr">'+s+'</b></div><pre dir="ltr"><code>'+esc(JSON.stringify(b,null,2))+'</code></pre>'}},
 js:function(el){lab(el,'הרצת JavaScript','כתבו קוד ולחצו הרץ. console.log מציג בחלון למטה. הכל רץ אצלכם בטלפון.','<textarea class="in code" dir="ltr" rows="7" spellcheck="false">function double(n) {\n  return n * 2;\n}\nconsole.log(double(21));\nfor (let i = 1; i <= 3; i++) {\n  console.log("סיבוב " + i);\n}</textarea><button class="btn" id="run" style="margin-top:8px">הרץ</button><pre class="out" dir="ltr"><code></code></pre>');
  var t=el.querySelector('textarea'),o=el.querySelector('.out code');el.querySelector('#run').onclick=function(){o.textContent='';var src='var __o=[];var console={log:function(){__o.push([].map.call(arguments,function(a){try{return typeof a==="object"?JSON.stringify(a):String(a)}catch(e){return String(a)}}).join(" "));postMessage({l:__o[__o.length-1]})}};try{'+t.value+'\n}catch(e){postMessage({e:String(e)})}postMessage({d:1})';
   var w,u;try{u=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));w=new Worker(u)}catch(e){o.textContent='הדפדפן לא מאפשר הרצה כאן.';return}
   var tm=setTimeout(function(){w.terminate();o.textContent+='\n(נעצר אחרי 2 שניות. אולי לולאה אינסופית?)'},2000);
   w.onmessage=function(m){var d=m.data;if(d.l!==undefined)o.textContent+=d.l+'\n';if(d.e)o.textContent+='שגיאה: '+d.e+'\n';if(d.d){clearTimeout(tm);w.terminate();if(!o.textContent)o.textContent='(אין פלט. הוסיפו console.log)'}};
   w.onerror=function(e){clearTimeout(tm);o.textContent+='שגיאה: '+e.message+'\n'}}},
 html:function(el){lab(el,'HTML חי','שנו את הקוד וראו את התוצאה מיד.','<textarea class="in code" dir="ltr" rows="6" spellcheck="false"><h2>שלום עולם</h2>\n<p>זו <b>פסקה</b> עם <a href="#">קישור</a>.</p>\n<button>לחצו עליי</button></textarea><iframe class="pv" sandbox title="תצוגה מקדימה"></iframe>');
  var t=el.querySelector('textarea'),f=el.querySelector('iframe');function run(){f.srcdoc='<html dir="rtl"><body style="font:16px system-ui;padding:12px;background:#fff;color:#222">'+t.value+'</body></html>'}t.oninput=run;run()},
 css:function(el){lab(el,'CSS חי','שנו צבע, פינות ורווחים וראו מה קורה לכרטיס.','<textarea class="in code" dir="ltr" rows="7" spellcheck="false">.card {\n  background: #fbf6ec;\n  color: #25362f;\n  border-radius: 16px;\n  padding: 16px;\n  border: 2px solid #5f8a76;\n}</textarea><iframe class="pv" sandbox title="תצוגה מקדימה"></iframe>');
  var t=el.querySelector('textarea'),f=el.querySelector('iframe');function run(){f.srcdoc='<html dir="rtl"><style>body{font:16px system-ui;padding:14px;margin:0;background:#eee}'+t.value.replace(/<\/?style/gi,'')+'</style><body><div class="card"><h3 style="margin:0 0 6px">כרטיס לדוגמה</h3><p style="margin:0">שנו את ה-CSS ותראו אותי משתנה.</p></div></body></html>'}t.oninput=run;run()},
 password:function(el){lab(el,'בודק חוזק סיסמה','ההערכה נעשית בטלפון שלכם ולא נשלחת לשום מקום. אל תכתבו סיסמה אמיתית.','<input class="in" dir="ltr" value="Tel-Aviv2026" autocomplete="off"><div class="meter"><i></i></div><div class="out"></div>');
  var i=el.querySelector('input'),m=el.querySelector('.meter i'),o=el.querySelector('.out'),common=['123456','12345678','password','qwerty','111111','abc123','iloveyou','123123','000000','admin','letmein','israel','welcome'];
  function run(){var v=i.value,n=v.length,pool=0;if(/[a-z]/.test(v))pool+=26;if(/[A-Z]/.test(v))pool+=26;if(/[0-9]/.test(v))pool+=10;if(/[^a-zA-Z0-9]/.test(v))pool+=32;var bits=n&&pool?n*Math.log2(pool):0,lc=v.toLowerCase();var isC=common.some(function(c){return lc.indexOf(c)>-1});if(isC)bits=Math.min(bits,18);if(/^(.)\1+$/.test(v))bits=Math.min(bits,10);
   var lvl=bits<28?['חלשה מאוד','#c44']:bits<40?['חלשה','#d77']:bits<60?['סבירה','#d9a441']:bits<80?['חזקה','#7aa37d']:['חזקה מאוד','#3f7a5c'];
   var t=bits<28?'שניות':bits<40?'דקות עד שעות':bits<60?'ימים עד שנים':bits<80?'אלפי שנים':'מעבר לכל חישוב מעשי';
   m.style.width=Math.min(100,bits/80*100)+'%';m.style.background=lvl[1];
   var tips=[];if(n<12)tips.push('הארוכו לפחות ל-12 תווים');if(isC)tips.push('יש ברשימת הסיסמאות הנפוצות');if(!/[0-9]/.test(v)||!/[a-zA-Z]/.test(v))tips.push('שלבו אותיות ומספרים');tips.push('הכי טוב: ארבע מילים אקראיות, ייחודית לכל שירות');
   o.innerHTML=n?'<p><b style="color:'+lvl[1]+'">'+lvl[0]+'</b> | הערכה גסה של זמן ניחוש: '+t+'</p><ul>'+tips.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>':'<p class="small">הקלידו משהו.</p>'}
  i.oninput=run;run()},
 cron:function(el){lab(el,'מסביר cron','חמישה שדות: דקה, שעה, יום בחודש, חודש, יום בשבוע. כתבו ביטוי וראו מתי ירוץ.','<input class="in" dir="ltr" value="*/15 8-18 * * 0-4"><div class="chips" style="margin:10px 0">'+['*/10 * * * *','0 8 * * *','30 7 * * 0-4','0 0 1 * *'].map(function(x){return '<button class="chip cb" dir="ltr">'+x+'</button>'}).join('')+'</div><div class="out"></div>');
  var i=el.querySelector('input'),o=el.querySelector('.out');
  function parse(f,min,max){var s={};f.split(',').forEach(function(p){var st=1,r=p;if(p.indexOf('/')>-1){var q=p.split('/');r=q[0];st=+q[1]}var a,b;if(r==='*'){a=min;b=max}else if(r.indexOf('-')>-1){var z=r.split('-');a=+z[0];b=+z[1]}else{a=+r;b=p.indexOf('/')>-1?max:a}if(isNaN(a)||isNaN(b)||isNaN(st)||st<1||a<min||b>max)throw 1;for(var x=a;x<=b;x+=st)s[x]=1});return s}
  function run(){var f=i.value.trim().split(/\s+/);if(f.length!==5){o.innerHTML='<p class="bad">צריך בדיוק חמישה שדות.</p>';return}
   try{var mi=parse(f[0],0,59),ho=parse(f[1],0,23),dm=parse(f[2],1,31),mo=parse(f[3],1,12),dw=parse(f[4],0,7);if(dw[7])dw[0]=1}catch(e){o.innerHTML='<p class="bad">אחד השדות לא תקין.</p>';return}
   var d=new Date();d.setSeconds(0,0);d.setMinutes(d.getMinutes()+1);var res=[],n=0;var dmAny=f[2]==='*',dwAny=f[4]==='*';while(res.length<5&&n<600000){var okD=dmAny&&dwAny?true:dmAny?dw[d.getDay()]:dwAny?dm[d.getDate()]:(dm[d.getDate()]||dw[d.getDay()]);if(mi[d.getMinutes()]&&ho[d.getHours()]&&mo[d.getMonth()+1]&&okD)res.push(new Date(d));d.setMinutes(d.getMinutes()+1);n++}
   var fmt=function(x){return x.toLocaleString('he-IL',{weekday:'long',day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'})};
   o.innerHTML=res.length?'<p><b>ההרצות הקרובות:</b></p><ul>'+res.map(function(x){return '<li>'+fmt(x)+'</li>'}).join('')+'</ul>':'<p class="bad">לא נמצאה הרצה בטווח הקרוב.</p>'}
  i.oninput=run;el.addEventListener('click',function(e){var b=e.target.closest('.cb');if(b){i.value=b.textContent;run()}});run()}
};

window.addEventListener('hashchange',route);route();
})();
