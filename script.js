let accounts = {
"4829": { bank:"SBI Bank", balance:10000, limit:10000, history:[] },
"9173": { bank:"HDFC Bank", balance:15000, limit:10000, history:[] },
"3508": { bank:"ICICI Bank", balance:20000, limit:10000, history:[] },
"7641": { bank:"Axis Bank", balance:25000, limit:10000, history:[] },
"5294": { bank:"PNB Bank", balance:12000, limit:10000, history:[] }
};

let current = null;
let generatedOTP = "";

function openPage(id){
document.querySelectorAll('.page').forEach(p=>p.style.display="none");
document.getElementById(id).style.display="block";

if(id==="qrPage") generateQR();
if(id==="historyPage") loadHistory();
if(id==="lastFivePage") loadLastFive();
}

function sendOTP(){
let mobile=document.getElementById("mobileInput").value;
if(mobile.length!==10||isNaN(mobile)){
document.getElementById("mobileMsg").innerText="Enter valid 10 digit number!";
return;
}
generatedOTP=Math.floor(1000+Math.random()*9000);
alert("Your OTP is: "+generatedOTP);
openPage("otpPage");
}

function verifyOTP(){
let entered=document.getElementById("otpInput").value;
if(entered==generatedOTP){
openPage("loginPage");
}else{
document.getElementById("otpMsg").innerText="Invalid OTP!";
}
}

function login(){
let pin=document.getElementById("pinInput").value;
if(!accounts[pin]){
document.getElementById("loginMsg").innerText="Invalid PIN!";
return;
}
current=accounts[pin];
document.getElementById("welcomeText").innerText="Welcome to "+current.bank;
document.getElementById("bal").innerText=current.balance;
document.getElementById("limit").innerText=current.limit;
openPage("homePage");
}

function deposit(){
let amt=parseInt(document.getElementById("depAmt").value);
if(amt>0){
current.balance+=amt;
current.history.push("Deposit ₹"+amt);
document.getElementById("bal").innerText=current.balance;
}
openPage("homePage");
}

function withdrawAmt(){
let amt=parseInt(document.getElementById("wdAmt").value);
if(amt>0&&amt<=current.balance){
if(amt>current.limit){alert("Limit exceeded");return;}
current.balance-=amt;
current.limit-=amt;
current.history.push("Withdraw ₹"+amt);
document.getElementById("bal").innerText=current.balance;
document.getElementById("limit").innerText=current.limit;
}
openPage("homePage");
}

function internalTransfer(){
let amt=parseInt(document.getElementById("intAmt").value);
let pin=document.getElementById("intPin").value;
if(accounts[pin]&&amt>0&&amt<=current.balance){
current.balance-=amt;
accounts[pin].balance+=amt;
current.history.push("Internal Transfer ₹"+amt);
}
openPage("homePage");
}

function externalTransfer(){
let amt=parseInt(document.getElementById("extAmt").value);
let bank=document.getElementById("extBank").value;
if(amt>0&&amt<=current.balance){
current.balance-=amt;
current.history.push("External Transfer to "+bank+" ₹"+amt);
}
openPage("homePage");
}

function loadHistory(){
document.getElementById("historyList").innerHTML=
current.history.map(x=>`<p>${x}</p>`).join('');
}

function loadLastFive(){
let last=current.history.slice(-5);
document.getElementById("lastFiveList").innerHTML=
last.map(x=>`<p>${x}</p>`).join('');
}

function changePIN(){
let np=document.getElementById("newPIN").value;
if(!np||accounts[np]){alert("Invalid/New PIN Exists");return;}
accounts[np]=current;
delete accounts[Object.keys(accounts).find(k=>accounts[k]===current)];
current.history.push("PIN Changed");
alert("PIN Updated!");
openPage("homePage");
}

function generateQR(){
document.getElementById("qrBox").innerHTML="";
new QRCode(document.getElementById("qrBox"),JSON.stringify(current));
}

function logout(){
current=null;
document.getElementById("pinInput").value="";
openPage("mobilePage");
}

function downloadPDF(){
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.setFontSize(18);
doc.text("ATM Account Statement",20,20);

doc.setFontSize(12);
doc.text("Bank: "+current.bank,20,40);
doc.text("Balance: ₹ "+current.balance,20,50);
doc.text("Daily Limit Left: ₹ "+current.limit,20,60);

doc.text("Transaction History:",20,80);

let y=90;

if(current.history.length===0){
doc.text("No transactions available.",20,y);
}else{
current.history.forEach((item,index)=>{
doc.text((index+1)+". "+item,20,y);
y+=10;
});
}

doc.save("ATM_Statement.pdf");
}