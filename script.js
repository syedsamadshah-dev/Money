// =================== Neon Falling Stars ===================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// Create small stars
let stars = [];
const starCount = 200; // more stars, small size

for(let i=0;i<starCount;i++){
  stars.push({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*1.5 + 0.5, // very small stars
    dy: Math.random()*1 + 0.5,   // falling speed
    color: ['#0ff','#f0f','#ff0'][Math.floor(Math.random()*3)]
  });
}

function animateStars(){
  ctx.fillStyle = "rgba(0,0,0,0.3)"; // faint trail effect
  ctx.fillRect(0,0,W,H);

  for(let s of stars){
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = s.color;
    ctx.fill();

    s.y += s.dy;

    // reset star to top when it falls below screen
    if(s.y > H){
      s.y = -2;
      s.x = Math.random()*W;
      s.color = ['#0ff','#f0f','#ff0'][Math.floor(Math.random()*3)];
      s.r = Math.random()*1.5 + 0.5;
      s.dy = Math.random()*1 + 0.5;
    }
  }

  requestAnimationFrame(animateStars);
}

animateStars();

// =================== Expense Tracker ===================
let expenses = JSON.parse(localStorage.getItem("expenses"))||[];
let summaryChart, monthlyChart;
document.getElementById("date").valueAsDate = new Date();

const addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', addExpense);

function formatCurrency(amount){
  return new Intl.NumberFormat('en-NP',{style:'currency',currency:'NPR'}).format(amount);
}

function addExpense(){
  let amount=document.getElementById("amount").value;
  let period=document.getElementById("period").value;
  let reason=document.getElementById("reason").value;
  let date=document.getElementById("date").value;
  if(!amount||!reason||!date){alert("Fill all fields!");return;}
  expenses.push({id:Date.now(),amount:parseFloat(amount),period,reason,date});
  localStorage.setItem("expenses",JSON.stringify(expenses));
  document.getElementById("amount").value="";
  document.getElementById("reason").value="";
  document.getElementById("date").valueAsDate=new Date();
  displayExpenses();
}

function deleteExpense(id){
  expenses=expenses.filter(e=>e.id!==id);
  localStorage.setItem("expenses",JSON.stringify(expenses));
  displayExpenses();
}

function displayExpenses(){
  let list=document.getElementById("expenseList");
  list.innerHTML="";
  let dayTotal=0,monthTotal=0,yearTotal=0;
  let monthlyTotals=new Array(12).fill(0);

  expenses.forEach(exp=>{
    let card=document.createElement("div");
    card.className="expense-card";
    card.innerHTML=`
      <strong>${formatCurrency(exp.amount)}</strong><br>
      ${exp.reason}<br>
      ${exp.period} | ${exp.date}
      <button class="delete" onclick="deleteExpense(${exp.id})">Delete</button>
    `;
    list.appendChild(card);

    if(exp.period==="Day")dayTotal+=exp.amount;
    if(exp.period==="Month")monthTotal+=exp.amount;
    if(exp.period==="Year")yearTotal+=exp.amount;

    let monthIndex=new Date(exp.date).getMonth();
    monthlyTotals[monthIndex]+=exp.amount;
  });

  document.getElementById("dayTotal").innerText=dayTotal.toFixed(2);
  document.getElementById("monthTotal").innerText=monthTotal.toFixed(2);
  document.getElementById("yearTotal").innerText=yearTotal.toFixed(2);

  updateCharts(dayTotal,monthTotal,yearTotal,monthlyTotals);
}

function updateCharts(day,month,year,monthlyTotals){
  const ctx1=document.getElementById('summaryChart').getContext('2d');
  if(summaryChart)summaryChart.destroy();
  summaryChart=new Chart(ctx1,{
    type:'bar',
    data:{labels:['Day','Month','Year'],datasets:[{label:'Summary (Rs)',data:[day,month,year],backgroundColor:['#0ff','#f0f','#ff0']}]}
  });

  const ctx2=document.getElementById('monthlyChart').getContext('2d');
  if(monthlyChart)monthlyChart.destroy();
  monthlyChart=new Chart(ctx2,{
    type:'line',
    data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets:[{label:'Monthly Breakdown (Rs)',data:monthlyTotals,borderColor:'#ff0',backgroundColor:'rgba(255,255,0,0.2)',fill:true,tension:0.3}]}
  });
}

displayExpenses();
