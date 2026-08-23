const formations={
  '433':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['CM',30,58],['DMF',50,64],['CM',70,58],['LW',22,30],['CF',50,20],['RW',78,30]],
  '4213':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['DMF',38,62],['DMF',62,62],['AMF',50,48],['LWF',22,28],['CF',50,20],['RWF',78,28]],
  '4312':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['CM',28,62],['DMF',50,66],['CM',72,62],['AMF',50,46],['SS',38,24],['CF',62,20]],
  '442':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['LMF',22,57],['CM',42,60],['CM',58,60],['RMF',78,57],['CF',38,22],['CF',62,22]]
};
const names=['COURTOIS','ALBA','VAN DIJK','RÜDIGER','HAKIMI','MODRIĆ','RODRI','BELLINGHAM','MBAPPÉ','HAALAND','MESSI'];
const pitch=document.getElementById('pitch');

function render(){
  pitch.innerHTML='';
  const data=formations[document.getElementById('formation').value];
  data.forEach((p,i)=>{
    const el=document.createElement('div');
    el.className='player'; el.draggable=true; el.dataset.index=i;
    el.style.left=p[1]+'%'; el.style.top=p[2]+'%';
    el.innerHTML=`${names[i]||'PLAYER'}<span>${p[0]}</span>`;
    el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',i));
    pitch.appendChild(el);
  });
  analyze();
}
pitch.addEventListener('dragover',e=>e.preventDefault());
pitch.addEventListener('drop',e=>{
  e.preventDefault(); const i=e.dataTransfer.getData('text/plain');
  const rect=pitch.getBoundingClientRect();
  const x=Math.max(5,Math.min(95,(e.clientX-rect.left)/rect.width*100));
  const y=Math.max(5,Math.min(95,(e.clientY-rect.top)/rect.height*100));
  const f=formations[document.getElementById('formation').value]; f[i][1]=x; f[i][2]=y;
  render();
});
function analyze(){
  const f=document.getElementById('formation').value;
  const base={433:[84,82,78,86],4213:[87,79,80,91],4312:[83,88,82,76],442:[81,84,85,80]}[f];
  setStats(base);
  document.getElementById('suggestion').textContent =
    f==='4213'?'Excellent counter-attacking shape. Keep your double pivot compact.':
    f==='4312'?'Strong central presence. Be careful: your wings can become exposed.':
    f==='442'?'A stable structure. Use wide midfielders to support both attack and defense.':
    'Balanced shape. Quick switches to the wings can create dangerous overloads.';
}
function setStats(v){
  [['attack',v[0]],['mid',v[1]],['def',v[2]],['counter',v[3]]].forEach(([id,val])=>{
    document.getElementById(id+'Bar').style.width=val+'%';
    document.getElementById(id+'Value').textContent=val;
  });
}
document.getElementById('applyBtn').onclick=render;
document.getElementById('formation').onchange=render;
document.getElementById('randomizeBtn').onclick=()=>setStats([0,0,0,0].map(()=>Math.floor(70+Math.random()*26)));
document.getElementById('resetBtn').onclick=()=>{localStorage.removeItem('tactiverse');location.reload()};
document.getElementById('saveBtn').onclick=()=>{
  localStorage.setItem('tactiverse',JSON.stringify({team:document.getElementById('teamName').value,formation:document.getElementById('formation').value,formations}));
  document.getElementById('saveBtn').textContent='✓ Saved!';
  setTimeout(()=>document.getElementById('saveBtn').textContent='💾 Save Squad',1500);
};
const saved=JSON.parse(localStorage.getItem('tactiverse')||'null');
if(saved){document.getElementById('teamName').value=saved.team||'My Dream Team';document.getElementById('formation').value=saved.formation||'433';}
render();