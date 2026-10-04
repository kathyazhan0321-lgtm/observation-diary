import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';
import * as diary from '../lib/diary.ts';
import * as profile from '../lib/profile.ts';
function fixture(){
 const sql=new DatabaseSync(':memory:');
 for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(`drizzle/${file}`,'utf8'));
 let user=null;
 const env={DB:{prepare(query){
   return {bind(...args){
     const stmt=sql.prepare(query);
     return {
       async all(){return {results:stmt.all(...args)}},
       async first(){return stmt.get(...args)||null},
       async run(){return {meta:{changes:Number(stmt.run(...args).changes)}}}
     };
   }};
 }}};
 function load(file){const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const exports={};new Function('require','exports',code)(name=>{if(name==='cloudflare:workers')return {env};if(name.includes('chatgpt-auth'))return {getChatGPTUser:async()=>user};if(name==='@/lib/diary')return diary;if(name==='@/lib/profile')return profile;throw Error(name)},exports);return exports;}
 return {diary:load('app/api/diary/route.ts'),profile:load('app/api/profile/route.ts'),as(id){user=id?{userId:id}:null},close(){sql.close()}};
}
const req=(path,body,origin='https://diary.test')=>new Request(`https://diary.test/api/${path}`,{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(body)});
test('actual routes isolate two accounts, ignore supplied user ID and reject stale writes',async()=>{const f=fixture();try{
 assert.equal((await f.diary.GET()).status,401);
 f.as('alice');const body={date:'2026-10-03',content:'Alice private',metrics:{mood:4},revision:0,userId:'bob'};
 assert.equal((await f.diary.POST(req('diary',body))).status,200);
 f.as('bob');assert.deepEqual((await (await f.diary.GET()).json()).entries,[]);
 assert.equal((await f.diary.POST(req('diary',{...body,revision:1,content:'overwrite'}))).status,409);
 assert.equal((await f.diary.POST(req('diary',{...body,content:'Bob private'}))).status,200);
 f.as('alice');const data=await (await f.diary.GET()).json();assert.equal(data.entries[0].content,'Alice private');assert.equal(data.userId,'alice');
 assert.equal((await f.diary.POST(req('diary',body))).status,409);
 assert.equal((await f.diary.POST(req('diary',{...body,revision:1},'https://attacker.test'))).status,403);
 }finally{f.close()}});
test('nickname persists per account and cannot change ownership',async()=>{const f=fixture();try{
 assert.equal((await f.profile.POST(req('profile',{nickname:'hello'}))).status,401);
 f.as('alice');assert.equal((await f.profile.POST(req('profile',{nickname:' 春天 ',userId:'bob'}))).status,200);
 assert.equal((await (await f.diary.GET()).json()).nickname,'春天');
 f.as('bob');assert.equal((await (await f.diary.GET()).json()).nickname,'观察者');
 assert.equal((await f.profile.POST(req('profile',{nickname:''}))).status,400);
 assert.equal((await f.profile.POST(req('profile',{nickname:'Bob'},'https://attacker.test'))).status,403);
 }finally{f.close()}});
