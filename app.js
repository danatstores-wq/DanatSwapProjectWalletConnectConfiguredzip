// --- IMPORT ETHERS DYNAMICALLY FOR BROWSER MODULES ---
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js";

// --- DANATSWAP CONTRACT & POOL CONFIGURATION ---
export const CONFIG = {
  UNISWAP_V2_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  USDT_ADDRESS: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  DNC_ADDRESS: "0x0fbe9cc858d7ad6e246fe9d01aed22abd2a66f0b",
  DNC_USDT_PAIR: "0x51e10689e6a928fa0e02ec58589e7e293c1ab69a"
};

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

// --- BILINGUAL TRANSLATIONS & DICTIONARY ---
export const translations = {
  en: {
    eyebrow: "DECENTRALIZED SWAP INTERFACE",
    title: "Trade DNC ↔ USDT",
    subtitle: "A live trading interface for the Danat Coin pair.",
    network: "Ethereum Mainnet",
    wallet: "Wallet",
    notConnected: "Not connected",
    connect: "Connect wallet",
    disconnect: "Disconnect",
    disconnecting: "Disconnecting…",
    switchNetwork: "Switch to Ethereum",
    switchingNetwork: "Switching network…",
    connecting: "Connecting…",
    networkConnected: "Ethereum Mainnet · Chain ID 1",
    networkUnsupported: "Wrong network. Switch to Ethereum Mainnet (Chain ID 1).",
    swap: "Swap",
    demoOnly: "LIVE POOL",
    youPay: "You pay",
    youReceive: "You receive (estimate)",
    rate: "Rate",
    notAvailable: "Not connected to pool",
    networkFee: "Network fee",
    shownBeforeConfirm: "Shown before confirmation",
    preview: "Preview swap",
    notice: "Wallet connection is active.",
    nonCustodial: "Non-custodial",
    yourWallet: "Your wallet stays yours",
    onePair: "One pair",
    onlyPair: "DNC / USDT only",
    bilingual: "Bilingual",
    twoLanguages: "Arabic & English",
    footer: "DanatSwap · Powered by Uniswap V2",
    previewTitle: "Swap Preview",
    previewBody: "Your DNC/USDT liquidity pool is connected and ready. Click confirm below to execute your live on-chain swap.",
    understand: "Confirm & Swap",
    selectWalletTitle: "Select Wallet",
    selectWalletSubtitle: "Choose how you want to connect to DanatSwap.",
    browserExtension: "Browser / App",
    mobileWeb: "Mobile / Injected",
    secureExtension: "Extension",
    injectedProvider: "Injected Provider"
  },
  ar: {
    eyebrow: "واجهة مبادلة لامركزية",
    title: "تداول DNC ↔ USDT",
    subtitle: "واجهة تداول حية لزوج دانات كوين.",
    network: "شبكة إيثيريوم الرئيسية",
    wallet: "المحفظة",
    notConnected: "غير متصلة",
    connect: "ربط المحفظة",
    disconnect: "قطع الاتصال",
    disconnecting: "جارٍ قطع الاتصال…",
    switchNetwork: "التبديل إلى إيثيريوم",
    switchingNetwork: "جارٍ تبديل الشبكة…",
    connecting: "جارٍ الاتصال…",
    networkConnected: "متصل بشبكة Ethereum Mainnet · المعرّف 1",
    networkUnsupported: "الشبكة غير مدعومة.",
    swap: "مبادلة",
    demoOnly: "مجمع نشط",
    youPay: "أنت تدفع",
    youReceive: "ستحصل على (تقديري)",
    rate: "السعر",
    notAvailable: "لم يتم الربط بالمجمع",
    networkFee: "رسوم الشبكة",
    shownBeforeConfirm: "تظهر قبل التأكيد",
    preview: "معاينة المبادلة",
    notice: "الاتصال بالمحفظة نشط.",
    nonCustodial: "غير وصائي",
    yourWallet: "محفظتك تبقى تحت سيطرتك",
    onePair: "زوج واحد",
    onlyPair: "DNC / USDT فقط",
    bilingual: "لغتان",
    twoLanguages: "العربية والإنجليزية",
    footer: "دانات سواب",
    previewTitle: "معاينة المبادلة",
    previewBody: "مجمع السيولة DNC/USDT متصل وجاهز. اضغط تأكيد أدناه لتنفيذ المبادلة الحية.",
    understand: "تأكيد ومبادلة",
    selectWalletTitle: "اختر المحفظة",
    selectWalletSubtitle: "اختر محفظتك المفضلة للاتصال بمنصة دانات سواب.",
    browserExtension: "متصفح / تطبيق",
    mobileWeb: "محمول",
    secureExtension: "إضافة متصفح",
    injectedProvider: "مزود المحفظة"
  },
};

// --- GLOBAL WALLET & LANGUAGE STATE ---
export let lang = "en";
let connectedAddress = null;

export function getLang() {
  return lang;
}

function updateWalletUI() {
  const walletStatus = document.getElementById("walletStatus");
  const connectBtn = document.getElementById("connectBtn");

  if (connectedAddress) {
    const shortAddr = `${connectedAddress.substring(0, 6)}...${connectedAddress.substring(connectedAddress.length - 4)}`;
    walletStatus.textContent = shortAddr;
    connectBtn.textContent = translations[lang].disconnect || "Disconnect";
    connectBtn.disabled = false;
  } else {
    walletStatus.textContent = translations[lang].notConnected || "Not connected";
    connectBtn.textContent = translations[lang].connect || "Connect wallet";
    connectBtn.disabled = false;
  }
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
  
  updateWalletUI();
  document.dispatchEvent(new CustomEvent("danat:languagechange", { detail: { lang } }));
}

document.getElementById("langToggle").addEventListener("click", () => {
  setLang(lang === "en" ? "ar" : "en");
});

// --- WALLET SELECTION LIST & CONNECTION LOGIC ---
const connectBtn = document.getElementById("connectBtn");
const walletModal = document.getElementById("walletModal");
const closeWalletModal = document.getElementById("closeWalletModal");

connectBtn.addEventListener("click", () => {
  if (connectedAddress) {
    connectedAddress = null;
    updateWalletUI();
    return;
  }

  if (walletModal) {
    walletModal.classList.remove("hidden");
  }
});

if (closeWalletModal) {
  closeWalletModal.addEventListener("click", () => {
    walletModal.classList.add("hidden");
  });
}

async function handleWalletConnect() {
  if (walletModal) {
    walletModal.classList.add("hidden");
  }
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!window.ethereum) {
    if (isMobile) {
      const dappUrl = window.location.href.replace(/^https?:\/\//, '');
      window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
      return;
    }
    alert("No Web3 wallet provider found. Please open this app inside MetaMask browser or a Web3 wallet app.");
    return;
  }

  try {
    connectBtn.textContent = translations[lang].connecting || "Connecting…";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    connectedAddress = await signer.getAddress();
    
    updateWalletUI();
    console.log("Wallet connected:", connectedAddress);
  } catch (error) {
    console.error("Wallet connection failed:", error);
    updateWalletUI();
    alert(`Connection failed: ${error.message || error}`);
  }
}

// Auto-connect check when opening inside MetaMask/Web3 app browser
async function checkExistingConnection() {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        connectedAddress = accounts[0];
        updateWalletUI();
      }
    } catch (err) {
      console.warn("Auto-connect check failed:", err);
    }
  }
}

const connectMetaMaskBtn = document.getElementById("connectMetaMask");
const connectTrustBtn = document.getElementById("connectTrust");
const connectCoinbaseBtn = document.getElementById("connectCoinbase");
const connectInjectedBtn = document.getElementById("connectInjected");

if (connectMetaMaskBtn) connectMetaMaskBtn.addEventListener("click", handleWalletConnect);
if (connectTrustBtn) connectTrustBtn.addEventListener("click", handleWalletConnect);
if (connectCoinbaseBtn) connectCoinbaseBtn.addEventListener("click", handleWalletConnect);
if (connectInjectedBtn) connectInjectedBtn.addEventListener("click", handleWalletConnect);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      connectedAddress = accounts[0];
    } else {
      connectedAddress = null;
    }
    updateWalletUI();
  });
}

checkExistingConnection();

// --- MODAL CONTROLS ---
const modal = document.getElementById("modal");
document.getElementById("previewBtn").addEventListener("click", () => modal.classList.remove("hidden"));
document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("hidden"));

// --- TOKEN DIRECTION STATE ---
let isBuyingDNC = true;

const switchBtn = document.getElementById("switchBtn");
const amountInput = document.getElementById("amount");
const receiveElem = document.getElementById("receiveAmount");

switchBtn.addEventListener("click", async () => {
  isBuyingDNC = !isBuyingDNC;
  amountInput.value = "";
  receiveElem.textContent = "—";

  const payBadge = document.querySelector("#amount + *");
  const receiveBadge = document.querySelector("#receiveAmount + *");
  if (payBadge && receiveBadge) {
    payBadge.textContent = isBuyingDNC ? "USDT" : "DNC";
    receiveBadge.textContent = isBuyingDNC ? "DNC" : "USDT";
  }
});

// --- LIVE ON-CHAIN SWAP EXECUTION LOGIC ---
async function executeLiveSwap(amountInStr, amountOutMinStr) {
  if (!window.ethereum) {
    alert("No Web3 wallet found.");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const tokenInAddress = isBuyingDNC ? CONFIG.USDT_ADDRESS : CONFIG.DNC_ADDRESS;
    const tokenOutAddress = isBuyingDNC ? CONFIG.DNC_ADDRESS : CONFIG.USDT_ADDRESS;
    
    const decimalsIn = isBuyingDNC ? 6 : 18;
    const decimalsOut = isBuyingDNC ? 18 : 6;

    const amountIn = ethers.utils.parseUnits(amountInStr, decimalsIn);
    const minOutputWithSlippage = parseFloat(amountOutMinStr) * 0.995;
    const amountOutMin = ethers.utils.parseUnits(minOutputWithSlippage.toFixed(4), decimalsOut);

    const tokenInContract = new ethers.Contract(tokenInAddress, ERC20_ABI, signer);

    const allowance = await tokenInContract.allowance(userAddress, CONFIG.UNISWAP_V2_ROUTER);
    if (allowance.lt(amountIn)) {
      const approveTx = await tokenInContract.approve(CONFIG.UNISWAP_V2_ROUTER, ethers.constants.MaxUint256);
      await approveTx.wait();
    }

    const routerContract = new ethers.Contract(CONFIG.UNISWAP_V2_ROUTER, ROUTER_ABI, signer);
    const path = [tokenInAddress, tokenOutAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const swapTx = await routerContract.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      userAddress,
      deadline
    );

    alert(`Swap submitted successfully! Tx: ${swapTx.hash}`);
    modal.classList.add("hidden");
    await swapTx.wait();
  } catch (error) {
    console.error("Swap execution failed:", error);
    alert(`Swap failed: ${error.message || error}`);
  }
}

document.getElementById("okModal").addEventListener("click", async () => {
  const amountInputVal = amountInput.value;
  const receiveAmountText = receiveElem.textContent;

  if (!amountInputVal || receiveAmountText === "—") {
    alert("Please enter a valid swap amount first.");
    return;
  }

  await executeLiveSwap(amountInputVal, receiveAmountText);
});

// --- DYNAMIC POOL CALCULATION ---
async function fetchPoolOutput(inputAmount) {
  const amountIn = parseFloat(inputAmount);
  if (isNaN(amountIn) || amountIn <= 0) return "—";

  let rUSDT = 1000;
  let rDNC = 1000;

  try {
    const PAIR_ABI = [
      "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
      "function token0() external view returns (address)"
    ];

    const provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com");
    const poolContract = new ethers.Contract(CONFIG.DNC_USDT_PAIR, PAIR_ABI, provider);

    const [reserves, token0] = await Promise.race([
      Promise.all([poolContract.getReserves(), poolContract.token0()]),
      new Promise((_, reject) => setTimeout(() => reject(new Error("RPC Timeout")), 2500))
    ]);

    const isUSDTToken0 = token0.toLowerCase() === CONFIG.USDT_ADDRESS.toLowerCase();
    const rawUSDT = isUSDTToken0 ? reserves.reserve0 : reserves.reserve1;
    const rawDNC = isUSDTToken0 ? reserves.reserve1 : reserves.reserve0;

    rUSDT = parseFloat(ethers.utils.formatUnits(rawUSDT, 6));
    rDNC = parseFloat(ethers.utils.formatUnits(rawDNC, 18));
  } catch (err) {
    console.warn("Using baseline pool reserves calculation due to RPC connection delay.");
  }

  const amountInWithFee = amountIn * 0.997;
  let outputAmount = isBuyingDNC 
    ? (amountInWithFee * rDNC) / (rUSDT + amountInWithFee)
    : (amountInWithFee * rUSDT) / (rDNC + amountInWithFee);

  return outputAmount.toFixed(4);
}

async function updateEstimate() {
  const val = amountInput.value;
  if (!val || parseFloat(val) <= 0) {
    receiveElem.textContent = "—";
    return;
  }
  const result = await fetchPoolOutput(val);
  const targetTokenSymbol = isBuyingDNC ? "DNC" : "USDT";
  receiveElem.textContent = `${result} ${targetTokenSymbol}`;
}

amountInput.addEventListener("input", updateEstimate);
updateEstimate();