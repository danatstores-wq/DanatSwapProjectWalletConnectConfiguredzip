export const translations = {
  en: {
    eyebrow: "DECENTRALIZED SWAP INTERFACE",
    title: "Trade DNC ↔ USDT",
    subtitle: "A preview interface for the Danat Coin pair.",
    network: "Ethereum Mainnet · Demo",
    wallet: "Wallet",
    notConnected: "Not connected",
    connect: "Connect wallet",
    disconnect: "Disconnect",
    switchNetwork: "Switch to Ethereum",
    connecting: "Connecting…",
    networkConnected: "Ethereum Mainnet · Chain ID 1",
    networkUnsupported: "Wrong network. Switch to Ethereum Mainnet (Chain ID 1).",
    projectIdMissing: "Wallet connection is not configured. Add VITE_REOWN_PROJECT_ID to the project environment variables.",
    walletSetupFailed: "Wallet connection could not start. Check the project configuration and reload.",
    connectionRejected: "Connection was declined. No wallet was connected.",
    connectionError: "Could not connect. Check your wallet or network and try again.",
    disconnectError: "Could not disconnect the wallet. Please try again.",
    switchNetworkError: "Could not switch networks. Select Ethereum Mainnet in your wallet and try again.",
    swap: "Swap",
    demoOnly: "DEMO ONLY",
    youPay: "You pay",
    youReceive: "You receive (estimate)",
    rate: "Rate",
    notAvailable: "Not connected to pool",
    networkFee: "Network fee",
    shownBeforeConfirm: "Shown before confirmation",
    preview: "Preview swap",
    notice: "Wallet connection is available. No token trade is performed.",
    nonCustodial: "Non-custodial",
    yourWallet: "Your wallet stays yours",
    onePair: "One pair",
    onlyPair: "DNC / USDT only",
    bilingual: "Bilingual",
    twoLanguages: "Arabic & English",
    footer: "Prototype · Trading disabled",
    previewTitle: "Preview only",
    previewBody: "The pool address and verified token contracts have not been configured. No transaction will be sent.",
    understand: "Understood",
  },
  ar: {
    eyebrow: "واجهة مبادلة لامركزية",
    title: "تداول DNC ↔ USDT",
    subtitle: "واجهة تجريبية لزوج دانات كوين.",
    network: "شبكة إيثيريوم الرئيسية · تجريبي",
    wallet: "المحفظة",
    notConnected: "غير متصلة",
    connect: "ربط المحفظة",
    disconnect: "قطع الاتصال",
    switchNetwork: "التبديل إلى إيثيريوم",
    connecting: "جارٍ الاتصال…",
    networkConnected: "متصل بشبكة Ethereum Mainnet · المعرّف 1",
    networkUnsupported: "الشبكة غير مدعومة. بدّل إلى Ethereum Mainnet (المعرّف 1).",
    projectIdMissing: "إعداد الاتصال غير مكتمل. أضف VITE_REOWN_PROJECT_ID إلى متغيرات بيئة المشروع.",
    walletSetupFailed: "تعذر بدء الاتصال بالمحفظة. تحقق من إعدادات المشروع وأعد تحميل الصفحة.",
    connectionRejected: "تم رفض طلب الاتصال. لم يتم ربط المحفظة.",
    connectionError: "تعذر الاتصال. تحقق من محفظتك أو شبكتك ثم أعد المحاولة.",
    disconnectError: "تعذر قطع اتصال المحفظة. أعد المحاولة.",
    switchNetworkError: "تعذر تبديل الشبكة. اختر Ethereum Mainnet في محفظتك ثم أعد المحاولة.",
    swap: "مبادلة",
    demoOnly: "تجريبي فقط",
    youPay: "أنت تدفع",
    youReceive: "ستحصل على (تقديري)",
    rate: "السعر",
    notAvailable: "لم يتم الربط بالمجمع",
    networkFee: "رسوم الشبكة",
    shownBeforeConfirm: "تظهر قبل التأكيد",
    preview: "معاينة المبادلة",
    notice: "يمكن ربط المحفظة. لا يتم تنفيذ أي تداول للعملات.",
    nonCustodial: "غير وصائي",
    yourWallet: "محفظتك تبقى تحت سيطرتك",
    onePair: "زوج واحد",
    onlyPair: "DNC / USDT فقط",
    bilingual: "لغتان",
    twoLanguages: "العربية والإنجليزية",
    footer: "نسخة أولية · التداول معطّل",
    previewTitle: "معاينة فقط",
    previewBody: "لم تتم إضافة عنوان المجمع وعقود الرموز التي تم التحقق منها. لن تُرسل أي معاملة.",
    understand: "فهمت",
  },
};

export let lang = "en";

export function getLang() {
  return lang;
}

function setLang(next) {
  lang = next;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[lang][key]) element.textContent = translations[lang][key];
  });
  document.getElementById("langToggle").textContent = lang === "en" ? "العربية" : "English";
  document.dispatchEvent(new CustomEvent("danat:languagechange", { detail: { lang } }));
}

document.getElementById("langToggle").addEventListener("click", () => {
  setLang(lang === "en" ? "ar" : "en");
});

const modal = document.getElementById("modal");
document.getElementById("previewBtn").addEventListener("click", () => modal.classList.remove("hidden"));
document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("hidden"));
document.getElementById("okModal").addEventListener("click", () => modal.classList.add("hidden"));

document.getElementById("amount").addEventListener("input", () => {
  document.getElementById("receiveAmount").textContent = "—";
});

document.getElementById("switchBtn").addEventListener("click", () => {
  document.getElementById("receiveAmount").textContent = "—";
});
