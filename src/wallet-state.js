export function normalizeChainId(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return undefined;

  const caipMatch = value.match(/^eip155:(\d+)/);
  if (caipMatch) return Number(caipMatch[1]);
  if (/^0x[0-9a-f]+$/i.test(value)) return Number.parseInt(value, 16);

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
}

export function getReownFeedbackKey(event) {
  switch (event?.event) {
    case "USER_REJECTED":
      return "connectionRejected";
    case "CONNECT_ERROR":
      return "connectionError";
    case "DISCONNECT_ERROR":
      return "disconnectError";
    default:
      return event?.type === "error" ? "connectionError" : undefined;
  }
}

export function getWalletErrorKey(error, action) {
  const code = error?.code ?? error?.data?.originalError?.code;
  const message = String(error?.message || "");

  if (code === 4001 || /user rejected|user denied|cancelled|canceled/i.test(message)) {
    if (action === "switchNetwork") return "switchNetworkError";
    return "connectionRejected";
  }
  if (action === "switchNetwork") return "switchNetworkError";
  if (action === "disconnect") return "disconnectError";
  return "connectionError";
}
