const translations = {
en:{
eyebrow:"DECENTRALIZED SWAP INTERFACE",title:"Trade DNC ↔ USDT",subtitle:"A preview interface for the Danat Coin pair.",network:"Ethereum Mainnet · Demo",
wallet:"Wallet",notConnected:"Not connected",connect:"Connect wallet",swap:"Swap",demoOnly:"DEMO ONLY",youPay:"You pay",youReceive:"You receive (estimate)",
rate:"Rate",notAvailable:"Not connected to pool",networkFee:"Network fee",shownBeforeConfirm:"Shown before confirmation",preview:"Preview swap",
notice:"This is a visual demo. No wallet connection or real trade is performed.",nonCustodial:"Non-custodial",yourWallet:"Your wallet stays yours",onePair:"One pair",onlyPair:"DNC / USDT only",bilingual:"Bilingual",twoLanguages:"Arabic & English",
footer:"Prototype · Trading disabled",previewTitle:"Preview only",previewBody:"The pool address and verified token contracts have not been configured. No transaction will be sent.",understand:"Understood",connectDemo:"Wallet connection is not enabled in this prototype."
},
ar:{
eyebrow:"واجهة مبادلة لامركزية",title:"تداول DNC ↔ USDT",subtitle:"واجهة تجريبية لزوج دانات كوين.",network:"شبكة إيثيريوم الرئيسية · تجريبي",
wallet:"المحفظة",notConnected:"غير متصلة",connect:"ربط المحفظة",swap:"مبادلة",demoOnly:"تجريبي فقط",youPay:"أنت تدفع",youReceive:"ستحصل على (تقديري)",
rate:"السعر",notAvailable:"لم يتم الربط بالمجمع",networkFee:"رسوم الشبكة",shownBeforeConfirm:"تظهر قبل التأكيد",preview:"معاينة المبادلة",
notice:"هذه نسخة تجريبية للواجهة فقط. لا يتم ربط المحفظة أو تنفيذ أي تداول فعلي.",nonCustodial:"غير وصائي",yourWallet:"محفظتك تبقى تحت سيطرتك",onePair:"زوج واحد",onlyPair:"DNC / USDT فقط",bilingual:"لغتان",twoLanguages:"العربية والإنجليزية",
footer:"نسخة أولية · التداول معطّل",previewTitle:"معاينة فقط",previewBody:"لم تتم إضافة عنوان المجمع وعقود الرموز التي تم التحقق منها. لن تُرسل أي معاملة.",understand:"فهمت",connectDemo:"ربط المحفظة غير مفعّل في هذه النسخة التجريبية."
}};
let lang = "en";
function setLang(next){
  lang=next; document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.textContent=translations[lang][key]});
  document.getElementById("langToggle").textContent=lang==="en"?"العربية":"English";
}
document.getElementById("langToggle").addEventListener("click",()=>setLang(lang==="en"?"ar":"en"));
const modal=document.getElementById("modal");
document.getElementById("previewBtn").addEventListener("click",()=>modal.classList.remove("hidden"));
document.getElementById("closeModal").addEventListener("click",()=>modal.classList.add("hidden"));
document.getElementById("okModal").addEventListener("click",()=>modal.classList.add("hidden"));
document.getElementById("connectBtn").addEventListener("click",()=>{modal.classList.remove("hidden");document.querySelector('[data-i18n="previewTitle"]').textContent=lang==="ar"?"ربط المحفظة غير متاح":"Wallet connection unavailable";document.querySelector('[data-i18n="previewBody"]').textContent=translations[lang].connectDemo;});
document.getElementById("amount").addEventListener("input",()=>{document.getElementById("receiveAmount").textContent="—";});
document.getElementById("switchBtn").addEventListener("click",()=>{const pay=document.querySelector('[data-i18n="youPay"]');pay.textContent=lang==="ar"?"أنت تدفع":"You pay";document.getElementById("receiveAmount").textContent="—";});
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
