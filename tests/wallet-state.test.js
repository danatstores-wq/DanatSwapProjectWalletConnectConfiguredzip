import test from "node:test";
import assert from "node:assert/strict";
import {
  getReownFeedbackKey,
  getWalletErrorKey,
  normalizeChainId,
  shortenAddress,
} from "../src/wallet-state.js";

test("normalizes Ethereum chain IDs from AppKit account formats", () => {
  assert.equal(normalizeChainId(1), 1);
  assert.equal(normalizeChainId("1"), 1);
  assert.equal(normalizeChainId("0x1"), 1);
  assert.equal(normalizeChainId("eip155:1:0xabc"), 1);
  assert.equal(normalizeChainId("eip155:137:0xabc"), 137);
  assert.equal(normalizeChainId(undefined), undefined);
});

test("shortens wallet addresses without changing the underlying address", () => {
  assert.equal(shortenAddress("0x1234567890abcdef1234567890abcdef12345678"), "0x1234…5678");
  assert.equal(shortenAddress(undefined), "");
});

test("maps Reown rejection and connection events to clear user messages", () => {
  assert.equal(getReownFeedbackKey({ event: "USER_REJECTED" }), "connectionRejected");
  assert.equal(getReownFeedbackKey({ event: "CONNECT_ERROR" }), "connectionError");
  assert.equal(getReownFeedbackKey({ event: "DISCONNECT_ERROR" }), "disconnectError");
  assert.equal(getReownFeedbackKey({ event: "CONNECT_SUCCESS" }), undefined);
});

test("maps user-denied connection requests to a rejection message", () => {
  assert.equal(getWalletErrorKey({ code: 4001 }, "connect"), "connectionRejected");
  assert.equal(getWalletErrorKey({ message: "User denied request" }, "connect"), "connectionRejected");
});

test("maps network and disconnect failures to distinct messages", () => {
  assert.equal(getWalletErrorKey(new Error("RPC unavailable"), "switchNetwork"), "switchNetworkError");
  assert.equal(getWalletErrorKey({ code: 4001 }, "switchNetwork"), "switchNetworkError");
  assert.equal(getWalletErrorKey(new Error("RPC unavailable"), "disconnect"), "disconnectError");
  assert.equal(getWalletErrorKey(new Error("RPC unavailable"), "connect"), "connectionError");
});
