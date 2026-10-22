import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateBank,createRound,submitGuess,score} from '../public/projects/itemle/build-core.js';
import {dailyItem,restore,compare} from '../public/projects/itemle/core.js';
const bank=JSON.parse(fs.readFileSync(new URL('../public/projects/itemle/build-data.json',import.meta.url)));
test('deployed Builddle snapshot validates and supports a complete round',()=>{validateBank(bank);const r=createRound(bank,'complete','hard',()=>0);const won=submitGuess(r,r.answerId,bank);assert.equal(won.status,'won');assert.equal(score(won),200);for(const b of bank.builds)assert.ok(fs.existsSync(new URL(`../public/projects/itemle/assets/champions/${b.champion}.png`,import.meta.url)));});
test('deployed recipe mode keeps deterministic daily selection and saved guesses',()=>{const {items}=JSON.parse(fs.readFileSync(new URL('../public/projects/itemle/data.json',import.meta.url)));const answer=dailyItem(items,'2026-10-21');assert.equal(answer.id,dailyItem(items,'2026-10-21').id);assert.deepEqual(restore(JSON.stringify([answer.id]),items,answer),[answer.id]);assert.equal(compare(answer,answer).correct,true);});
test('all new static page scripts, styles, and local module imports exist',()=>{for(const page of ['itemle/index.html','itemle/builddle.html','math-ascension/index.html']){const url=new URL(`../public/projects/${page}`,import.meta.url),html=fs.readFileSync(url,'utf8');for(const [,ref] of html.matchAll(/(?:src|href)="([^"#]+\.(?:mjs|js|css))"/g))assert.ok(fs.existsSync(new URL(ref,url)),ref);}});
