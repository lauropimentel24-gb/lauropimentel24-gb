const map = [
 '#####################',
 '#.........#.........#',
 '#.###.###.#.###.###.#',
 '#...................#',
 '#.###.#.#####.#.###.#',
 '#.....#...#...#.....#',
 '#.###.###.#.###.###.#',
 '#...................#',
 '#.###.#.#####.#.###.#',
 '#.....#.......#.....#',
 '#####################'
];
const dirs = {left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]};
const angles = {left:Math.PI,right:0,up:-Math.PI/2,down:Math.PI/2};
const canvas=document.querySelector('canvas'), ctx=canvas.getContext('2d');
const start=document.querySelector('#start'), msg=document.querySelector('#msg'), score=document.querySelector('#score');
const key=(x,y)=>x+','+y;
let player,ghosts,pellets,direction,queued,ticks,points,state,timer;
function reset(){
 player=[1,1]; ghosts=[[19,9],[19,1]]; pellets=new Set();
 map.forEach((row,y)=>[...row].forEach((cell,x)=>{if(cell==='.')pellets.add(key(x,y));}));
 pellets.delete('1,1'); direction=queued='right'; ticks=points=0; state='ready'; score.textContent='0 pontos'; draw();
}
function draw(){
 ctx.fillStyle='#08131f';ctx.fillRect(0,0,672,352);
 map.forEach((row,y)=>[...row].forEach((c,x)=>{
  if(c==='#'){ctx.fillStyle='#1c3e51';ctx.fillRect(x*32+1,y*32+1,30,30);ctx.fillStyle='#376372';ctx.fillRect(x*32+1,y*32+1,30,2);}
  if(pellets.has(key(x,y))){ctx.fillStyle='#94eab4';ctx.fillRect(x*32+14,y*32+14,4,4);}
 }));
 ghosts.forEach(([x,y],i)=>{
  x=x*32+16;y=y*32+16;ctx.fillStyle=i?'#76d9fd':'#ff96bd';ctx.beginPath();ctx.arc(x,y,12,Math.PI,Math.PI*2);ctx.lineTo(x+12,y+11);ctx.lineTo(x+6,y+8);ctx.lineTo(x,y+12);ctx.lineTo(x-6,y+8);ctx.lineTo(x-12,y+12);ctx.fill();
  ctx.fillStyle='#102038';ctx.fillRect(x-6,y-3,3,5);ctx.fillRect(x+2,y-3,3,5);
 });
 const x=player[0]*32+16,y=player[1]*32+16,face=angles[direction],gap=ticks%2?.16:.64;
 ctx.fillStyle='#ffda77';ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,13,face+gap,face+Math.PI*2-gap);ctx.fill();
}
function next(p,d){return [p[0]+dirs[d][0],p[1]+dirs[d][1]];}
function open([x,y]){return map[y]?.[x]==='.';}
function stop(message,ended){
 clearInterval(timer);state=ended?'over':'paused';msg.textContent=message;start.textContent=ended?'Jogar de novo':'Continuar';draw();
}
function hit(){return ghosts.some(([x,y])=>x===player[0]&&y===player[1]);}
function tick(){
 ticks++;if(open(next(player,queued)))direction=queued;
 const step=next(player,direction);if(open(step))player=step;
 if(hit())return stop('O fantasma te pegou!',true);
 if(pellets.delete(key(...player))){points+=10;score.textContent=points+' pontos';}
 if(!pellets.size)return stop('Você limpou o labirinto!',true);
 if(ticks%3===0)ghosts=ghosts.map(p=>{
  const choices=Object.keys(dirs).map(d=>next(p,d)).filter(open);
  choices.sort((a,b)=>Math.hypot(a[0]-player[0],a[1]-player[1])-Math.hypot(b[0]-player[0],b[1]-player[1]));
  return Math.random()<.78?choices[0]:choices[Math.floor(Math.random()*choices.length)];
 });
 if(hit())return stop('O fantasma te pegou!',true);
 draw();
}
start.onclick=()=>{
 if(state==='running')return stop('Jogo pausado.',false);
 if(state==='over')reset();
 state='running';msg.textContent='Jogo em andamento.';start.textContent='Pausar';canvas.focus({preventScroll:true});timer=setInterval(tick,185);
};
const keys={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
document.addEventListener('keydown',e=>{if(state==='running'&&keys[e.key]&&e.target.closest('section')){e.preventDefault();queued=keys[e.key];}});
document.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{queued=b.dataset.dir;});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='running')stop('Jogo pausado.',false);});
reset();
const grid=document.querySelector('.grid'),detail=document.querySelector('#detail');
let current;
function select(b){
 if(current){current.setAttribute('aria-pressed','false');current.tabIndex=-1;}
 current=b;b.setAttribute('aria-pressed','true');b.tabIndex=0;detail.textContent=b.title;
}
for(const day of weeks.flat()){
 const b=document.createElement('button');
 b.title=day.day.split('-').reverse().join('/')+' · '+day.count+(day.count===1?' contribuição':' contribuições');
 b.setAttribute('aria-label',b.title);b.setAttribute('aria-pressed','false');b.tabIndex=-1;b.dataset.active=String(day.count>0);
 b.onclick=()=>select(b);grid.append(b);
}
select([...grid.children].reverse().find(b=>b.dataset.active==='true')||grid.lastElementChild);
grid.addEventListener('keydown',e=>{
 const offsets={ArrowRight:7,ArrowLeft:-7,ArrowUp:-1,ArrowDown:1};
 if(!(e.key in offsets))return;e.preventDefault();
 const buttons=[...grid.children],b=buttons[Math.max(0,Math.min(buttons.length-1,buttons.indexOf(current)+offsets[e.key]))];select(b);b.focus();
});
