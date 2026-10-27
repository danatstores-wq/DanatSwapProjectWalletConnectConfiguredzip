import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet } from "@reown/appkit/networks";
import { getLang, translations } from "../app.js";
import {
  getReownFeedbackKey,
  getWalletErrorKey,
  normalizeChainId,
  shortenAddress,
} from "./wallet-state.js";

const connectButton = document.getElementById("connectBtn");
const networkButton = document.getElementById("networkBtn");
const walletStatus = document.getElementById("walletStatus");
const networkStatus = document.getElementById("walletNetworkStatus");
const walletFeedback = document.getElementById("walletFeedback");
const projectId = (import.meta.env.VITE_REOWN_PROJECT_ID || "").trim();

let appKit;
let connectedAddress;
let connected = false;
let chainId;
let initializationFailed = false;

function text(key) {
  return translations[getLang()][key];
}

function showFeedback(key) {
  walletFeedback.textContent = text(key);
  walletFeedback.hidden = false;
}

function clearFeedback() {
  walletFeedback.textContent = "";
  walletFeedback.hidden = true;
}

function renderWallet() {
  const labels = translations[getLang()];
  const onMainnet = normalizeChainId(chainId) === 1;

  if (!connected || !connectedAddress) {
    walletStatus.textContent = labels.notConnected;
    walletStatus.removeAttribute("title");
    networkStatus.hidden = true;
    connectButton.textContent = labels.connect;
    connectButton.setAttribute("aria-label", labels.connect);
    networkButton.hidden = true;
    return;
  }

  walletStatus.textContent = shortenAddress(connectedAddress);
  walletStatus.title = connectedAddress;
  networkStatus.hidden = false;
  networkStatus.textContent = onMainnet ? labels.networkConnected : labels.networkUnsupported;
  networkStatus.classList.toggle("is-warning", !onMainnet);

  connectButton.textContent = labels.disconnect;
  connectButton.setAttribute("aria-label", labels.disconnect);
  networkButton.hidden = onMainnet;
  networkButton.textContent = labels.switchNetwork;
}

function setAccountState(account) {
  connected = Boolean(account?.isConnected);
  connectedAddress = account?.address || undefined;
  const caipChainId = account?.caipAddress?.match(/^eip155:(\d+):/);
  if (caipChainId) chainId = Number(caipChainId[1]);
  renderWallet();
}

function handleReownEvent(state) {
  const event = state?.data;
  if (event?.event === "CONNECT_SUCCESS") clearFeedback();
  if (event?.event === "USER_REJECTED" && connected) {
    showFeedback("switchNetworkError");
    return;
  }
  const feedbackKey = getReownFeedbackKey(event);
  if (feedbackKey) showFeedback(feedbackKey);
}

async function handleWalletAction() {
  if (!appKit) {
    showFeedback(initializationFailed ? "walletSetupFailed" : "projectIdMissing");
    return;
  }

  clearFeedback();
  const action = connected ? "disconnect" : "connect";
  try {
    if (action === "connect") {
      await appKit.open({ view: "Connect", namespace: "eip155" });
    } else {
      await appKit.disconnect("eip155");
    }
  } catch (error) {
    showFeedback(getWalletErrorKey(error, action));
  }
}

async function handleNetworkAction() {
  if (!appKit) {
    showFeedback(initializationFailed ? "walletSetupFailed" : "projectIdMissing");
    return;
  }

  clearFeedback();
  try {
    await appKit.switchNetwork(mainnet, { throwOnFailure: true });
  } catch (error) {
    showFeedback(getWalletErrorKey(error, "switchNetwork"));
  }
}

connectButton.addEventListener("click", handleWalletAction);
networkButton.addEventListener("click", handleNetworkAction);
document.addEventListener("danat:languagechange", renderWallet);

if (!projectId) {
  renderWallet();
} else {
  try {
    appKit = createAppKit({
      adapters: [new EthersAdapter()],
      networks: [mainnet],
      defaultNetwork: mainnet,
      projectId,
      defaultAccountTypes: { eip155: "eoa" },
      metadata: {
        name: "Danat Swap",
        description: "Bilingual Danat Swap wallet connection",
        url: window.location.origin,
        icons: [`${window.location.origin}/logo.jpg`],
      },
      enableMobileFullScreen: true,
      enableCoinbase: true,
      themeMode: "dark",
      themeVariables: {
        "--w3m-accent": "#e9bd4d",
        "--w3m-color-mix": "#070707",
        "--w3m-color-mix-strength": 28,
        "--w3m-border-radius-master": "12px",
      },
      features: {
        analytics: false,
        allWallets: true,
        email: false,
        socials: false,
        swaps: false,
        send: false,
        receive: false,
        onramp: false,
        history: false,
      },
    });

    appKit.subscribeAccount(setAccountState, "eip155");
    appKit.subscribeNetwork((network) => {
      chainId = network.chainId;
      renderWallet();
    });
    appKit.subscribeEvents(handleReownEvent);

    connected = appKit.getIsConnectedState();
    connectedAddress = appKit.getAddress("eip155");
    chainId = appKit.getChainId();
    renderWallet();
  } catch {
    initializationFailed = true;
    renderWallet();
    showFeedback("walletSetupFailed");
  }
}
