import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Renderer} from '../web/renderer.mjs';
const catalog=JSON.parse(fs.readFileSync(new URL('../web/assets/catalog.json',import.meta.url)));
function renderer(){const r=new Renderer({getContext:()=>({})},{catalog}),draws=[];r.sprite=(...args)=>draws.push(args);return{r,draws};}
test('soldier directional walk mapping cannot override attack, ranged attack or death',()=>{for(const [state,frame]of [['walk',2],['attack',7],['ranged_attack',50],['death',23]]){const{r,draws}=renderer();r.entity('soldier_barrack_1',{x:512,y:384},{state,time:0});assert.equal(draws[0][1],'soldiers_123_'+String(frame).padStart(4,'0'));}});
test('single-shot actions hold their final frame instead of looping while cooldown runs',()=>{const{r,draws}=renderer();r.entity('soldier_barrack_3',{x:0,y:0},{state:'attack',time:2});assert.equal(draws[0][1],'soldiers_123_0097');});
test('discontinuous source animation ranges skip unused frames',()=>{const{r}=renderer();assert.equal(r.frame('hero_elves_archer_shoot',10/30,false),'archer_hero_0074');assert.equal(r.frame('hero_elves_archer_shoot',99,false),'archer_hero_0079');assert.equal(r.frame('soldier_catha_raise',0,false),'catha_hero_0453');});
test('the barracks door uses five opening and four closing frames at 30 fps',()=>{const{r}=renderer();for(const n of [1,2,3]){assert.equal(r.frame(`tower_barrack_${n}_door_open`,1,false),`barracks_towers_layer2_${String((n-1)*25+5).padStart(4,'0')}`);assert.equal(r.frame(`tower_barrack_${n}_door_close`,1,false),`barracks_towers_layer2_${String(n*25).padStart(4,'0')}`);}});

test('native side-view enemies face right without mirroring, left with mirroring',async()=>{const{enemyDirection}=await import('../web/renderer.mjs');assert.deepEqual(enemyDirection(1,0),{facing:'RightLeft',flip:false,quadrant:4});assert.deepEqual(enemyDirection(-1,0),{facing:'RightLeft',flip:true,quadrant:2});assert.equal(enemyDirection(0,1).facing,'Up');assert.equal(enemyDirection(0,-1).facing,'Down');});
test('enemy direction uses original 45-degree sectors and 10-degree hysteresis',async()=>{const{enemyDirection}=await import('../web/renderer.mjs'),at=(degrees,previous)=>enemyDirection(Math.cos(degrees*Math.PI/180),Math.sin(degrees*Math.PI/180),previous);const right=at(0),up=at(90);assert.equal(at(50).facing,'Up');assert.equal(at(50,right).facing,'RightLeft');assert.equal(at(56,right).facing,'Up');assert.equal(at(40,up).facing,'Up');assert.equal(at(34,up).facing,'RightLeft');assert.equal(enemyDirection(0,0,up),up);});
