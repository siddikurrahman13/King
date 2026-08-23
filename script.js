const defaultNames=['COURTOIS','ALBA','VAN DIJK','RÜDIGER','HAKIMI','MODRIĆ','RODRI','BELLINGHAM','MBAPPÉ','HAALAND','MESSI'];
const templates={
'433':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['CM',28,60],['DMF',50,66],['CM',72,60],['LW',20,30],['CF',50,20],['RW',80,30]],
'4213':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['DMF',38,63],['DMF',62,63],['AMF',50,48],['LWF',22,28],['CF',50,20],['RWF',78,28]],
'4312':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['CM',28,62],['DMF',50,67],['CM',72,62],['AMF',50,47],['SS',38,25],['CF',62,20]],
'442':[['GK',50,92],['LB',18,78],['CB',39,82],['CB',61,82],['RB',82,78],['LMF',20,58],['CM',40,62],['CM',60,62],['RMF',80,58],['CF',38,22],['CF',62,22]]
};
let players=[],selected=null;
const pitch=document.getElementById('pitch');
function createPlayers(){const f=document.getElementById('formation').value;players=templates[f].map((x,i)=>({name:defaultNames[i]||'PLAYER '+(i+1),pos:x[0],x:x[1],y:x[2],rating:Math.max(75,96-i)}));}
function render(){pitch.querySelectorAll('.player').forEach(x=>x.remove());players.forEach((p,i)=>{const el=document.createElement('div');el.className='player'+(selected===i?' selected':'');el.draggable=true;el.dataset.i=i;el.style.left=p.x+'%';el.style.top=p.y+'%';el.innerHTML=`<div class="name">${p.name}</div><div class="pos">${p.pos}</div><div class="rating">${p.rating}</div>`;el.onclick=()=>selectPlayer(i);el.ondragstart=e=>e.dataTransfer.setData('player',i);pitch.appendChild(el)});document.getElementById('formationText').textContent=document.getElementById('formation').selectedOptions[0].text+' • 11 Players';analyze();}
pitch.ondragover=e=>e.preventDefault();
pitch.ondrop=e=>{e.preventDefault();const i=+e.dataTransfer.getData('player');const r=pitch.getBoundingClientRect();players[i].x=Math.max(5,Math.min(95,(e.clientX-r.left)/r.width*100));players[i].y=Math.max(5,Math.min(95,(e.clientY-r.top)/r.height*100));render();};
function selectPlayer(i){selected=i;const p=players[i];document.getElementById('editorEmpty').hidden=true;document.getElementById('editorFields').hidden=false;playerName.value=p.name;playerPosition.value=p.pos;playerRating.value=p.rating;ratingPreview.textContent=p.rating;render();}
playerRating.oninput=()=>ratingPreview.textContent=playerRating.value;
updatePlayer.onclick=()=>{if(selected===null)return;const p=players[selected];p.name=playerName.value.trim()||'PLAYER';p.pos=playerPosition.value.trim().toUpperCase()||'POS';p.rating=+playerRating.value;render();toast('Player updated ✓');};
function analyze(){let groups={a:[],m:[],d:[]};players.forEach(p=>{if(['CF','SS','LW','RW','LWF','RWF'].includes(p.pos))groups.a.push(p.rating);else if(['CM','DMF','AMF','LMF','RMF'].includes(p.pos))groups.m.push(p.rating);else groups.d.push(p.rating)});const avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):70;const attack=avg(groups.a),mid=avg(groups.m),def=avg(groups.d),counter=Math.round(attack*.55+mid*.25+def*.2);setStat('attack',attack);setStat('mid',mid);setStat('def',def);setStat('counter',counter);suggest(attack,mid,def,counter);}
function setStat(id,v){document.getElementById(id+'Bar').style.width=v+'%';document.getElementById(id+'Value').textContent=v;}
function suggest(a,m,d,c){suggestion.textContent=d<80?'Your defensive line looks vulnerable. Consider stronger defenders or a deeper DMF.':m<a-5?'Your attack is strong, but midfield control could be improved.':c>=88?'Excellent counter-attacking potential. Use quick transitions and fast forwards.':'Your squad is balanced. Adjust player positions based on your opponent.';}
applyBtn.onclick=()=>{createPlayers();selected=null;document.getElementById('editorFields').hidden=true;document.getElementById('editorEmpty').hidden=false;render();};
formation.onchange=applyBtn.onclick;
saveBtn.onclick=()=>{localStorage.setItem('tactiverseV11',JSON.stringify({team:teamName.value,formation:formation.value,players}));toast('Squad saved successfully 💾');};
loadBtn.onclick=()=>{const s=JSON.parse(localStorage.getItem('tactiverseV11')||'null');if(!s)return toast('No saved squad found');teamName.value=s.team||teamName.value;formation.value=s.formation||'433';players=s.players||[];selected=null;render();toast('Saved squad loaded 📂');};
randomizeBtn.onclick=()=>{players.forEach(p=>p.rating=Math.floor(75+Math.random()*26));render();toast('Ratings randomized 🎲');};
resetBtn.onclick=()=>{if(confirm('Reset all saved data?')){localStorage.removeItem('tactiverseV11');createPlayers();selected=null;render();toast('Everything reset');}};
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800);}
createPlayers();render();