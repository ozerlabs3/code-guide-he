const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const {validate,load}=require('../scripts/validate-content.cjs');const root=path.resolve(__dirname,'..'),index=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('current book has valid IDs, quiz references, links and matching assets',()=>assert.deepEqual(validate(load(root),index,root),[]));
const sample=()=>[{id:'chapter',items:[{id:'lesson',title:'Title',html:'<p>Text</p>',text:'Text'}],exam:[{item:'lesson'}]}];
test('duplicate lesson is rejected',()=>{const b=sample();b[0].items.push({...b[0].items[0]});assert(validate(b,index,root).some(x=>x.includes('duplicate')));});
test('unknown quiz reference is rejected',()=>{const b=sample();b[0].exam[0].item='missing';assert(validate(b,index,root).some(x=>x.includes('exam')));});
test('broken internal lesson link is rejected',()=>{const b=sample();b[0].items[0].html='<a href="#chapter/missing">x</a>';assert(validate(b,index,root).some(x=>x.includes('internal')));});
test('mixed asset versions are rejected',()=>assert(validate(sample(),index.replace(/app\.js\?v=\d+/,'app.js?v=999'),root).some(x=>x.includes('versions'))));
