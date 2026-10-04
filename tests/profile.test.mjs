import {test} from 'node:test';
import assert from 'node:assert/strict';
const p=await import('../lib/profile.ts').catch(()=>({}));
test('nickname is trimmed and rejects empty, controls and overlong names',()=>{assert.equal(typeof p.normalizeNickname,'function'); assert.equal(p.normalizeNickname(' 豆沙包 '),'豆沙包');for(const v of ['',null,'a\nb','啊'.repeat(21)])assert.throws(()=>p.normalizeNickname(v));});
test('draft keys isolate accounts and survive nickname changes',()=>{assert.equal(typeof p.draftKey,'function');assert.notEqual(p.draftKey('alice','2026-09-17'),p.draftKey('bob','2026-09-17'));assert.equal(p.draftKey('alice','2026-09-17'),p.draftKey('alice','2026-09-17'));assert.throws(()=>p.draftKey('','2026-09-17'));});
