const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function validate(book,index,root){
 const errors=[],ids=new Set(),routes=new Set();
 for(const chapter of book){if(!chapter.id||ids.has(chapter.id))errors.push('duplicate/missing chapter '+chapter.id);ids.add(chapter.id);const items=new Set();for(const item of chapter.items||[]){if(!item.id||items.has(item.id))errors.push('duplicate/missing lesson '+chapter.id+'/'+item.id);items.add(item.id);routes.add(chapter.id+'/'+item.id);if(!item.title||!item.html||!item.text)errors.push('incomplete lesson '+item.id);}for(const q of chapter.exam||[])if(!items.has(q.item))errors.push('unknown exam lesson '+q.item);}
 for(const chapter of book)for(const item of chapter.items||[])for(const m of item.html.matchAll(/href=["']#([^"']+)["']/g)){const target=m[1];if(!ids.has(target)&&!routes.has(target)&&!['home','quiz','final','search','glossary','paths'].includes(target))errors.push('unknown internal link '+target);}
 const assets=[...index.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))\?v=(\d+)["']/g)];if(assets.length!==3||new Set(assets.map(x=>x[2])).size!==1)errors.push('asset versions differ');
 for(const a of assets)if(!fs.existsSync(path.join(root,a[1])))errors.push('missing asset '+a[1]);return errors;
}
function load(root){const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),ctx,{timeout:5000});return ctx.window.BOOK;}
module.exports={validate,load};
if(require.main===module){const root=path.resolve(__dirname,'..'),book=load(root),errors=validate(book,fs.readFileSync(path.join(root,'index.html'),'utf8'),root);if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Validated '+book.length+' chapters and '+book.reduce((n,c)=>n+c.items.length,0)+' lessons');}
