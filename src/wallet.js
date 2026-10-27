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
let mainnet;
let connectedAddress;
let connected = false;
let chainId;
let busyAction;
let initPromise = null;

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

  connectButton.disabled = Boolean(busyAction);
  networkButton.disabled = Boolean(busyAction);

  if (!connected || !connectedAddress) {
    walletStatus.textContent = labels.notConnected;
    walletStatus.removeAttribute("title");
    networkStatus.hidden = true;
    networkButton.hidden = true;
    connectButton.textContent = busyAction === "connect" ? labels.connecting : labels.connect;
    connectButton.setAttribute("aria-label", connectButton.textContent);
    return;
  }

  walletStatus.textContent = shortenAddress(connectedAddress);
  walletStatus.title = connectedAddress;
  networkStatus.hidden = false;
  networkStatus.textContent = onMainnet ? labels.networkConnected : labels.networkUnsupported;
  networkStatus.classList.toggle("is-warning", !onMainnet);

  connectButton.textContent = busyAction === "disconnect" ? labels.disconnecting : labels.disconnect;
  connectButton.setAttribute("aria-label", connectButton.textContent);
  networkButton.hidden = onMainnet;
  networkButton.textContent = busyAction === "switchNetwork"
    ? labels.switchingNetwork
    : labels.switchNetwork;
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

async function initializeAppKit() {
  if (!projectId) return;

  const [{ createAppKit }, { EthersAdapter }, networks] = await Promise.all([
    import("@reown/appkit"),
    import("@reown/appkit-adapter-ethers"),
    import("@reown/appkit/networks"),
  ]);

  mainnet = networks.mainnet;
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
}

// Start preloading AppKit silently on page load
if (projectId) {
  initPromise = initializeAppKit().catch((err) => {
    console.warn("AppKit background preloading error:", err);
  });
}

async function handleWalletAction() {
  if (!projectId) {
    showFeedback("projectIdMissing");
    return;
  }

  clearFeedback();

  // If AppKit is still preloading in background, wait for it
  if (!appKit && initPromise) {
    busyAction = "connect";
    renderWallet();
    try {
      await initPromise;
    } catch {
      showFeedback("walletSetupFailed");
      busyAction = undefined;
      renderWallet();
      return;
    }
  }

  if (!connected) {
    busyAction = "connect";
    renderWallet();
    try {
      await appKit.open({ view: "Connect", namespace: "eip155" });
    } catch (error) {
      showFeedback(getWalletErrorKey(error, "connect"));
    } finally {
      busyAction = undefined;
      renderWallet();
    }
    return;
  }

  busyAction = "disconnect";
  renderWallet();
  try {
    await appKit.disconnect("eip155");
    clearFeedback();
  } catch (error) {
    showFeedback(getWalletErrorKey(error, "disconnect"));
  } finally {
    busyAction = undefined;
    renderWallet();
  }
}

async function handleNetworkAction() {
  if (!appKit || !mainnet) return;
  clearFeedback();
  busyAction = "switchNetwork";
  renderWallet();
  try {
    await appKit.switchNetwork(mainnet, { throwOnFailure: true });
  } catch (error) {
    showFeedback(getWalletErrorKey(error, "switchNetwork"));
  } finally {
    busyAction = undefined;
    renderWallet();
  }
}

connectButton.addEventListener("click", handleWalletAction);
networkButton.addEventListener("click", handleNetworkAction);
document.addEventListener("danat:languagechange", renderWallet);
renderWallet();