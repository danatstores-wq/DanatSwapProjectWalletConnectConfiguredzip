# Danat Swap

## Run on Replit

Use the **Run** button to start the Vite development server on port 5000:

```sh
npm run dev
```

Build and run the lightweight wallet-state checks with:

```sh
npm run build
npm test
```

## Wallet connection setup

The frontend uses Reown AppKit with the Ethers v6 adapter and Ethereum Mainnet
(chain ID 1). Configure the public Reown Project ID as the shared environment
variable `VITE_REOWN_PROJECT_ID`. This identifier is used in browser code; it is
not a wallet credential. In the Reown dashboard, allow the app's Replit preview
origin and any published origin used for testing.

The imported project did not contain a Reown Project ID. Without that setting,
the page runs normally but the Connect Wallet button reports that setup is
incomplete.

## Mobile connection test

1. Set `VITE_REOWN_PROJECT_ID` and allow the HTTPS Replit preview origin in the
   Reown dashboard.
2. Open the Replit preview URL on an iOS or Android device.
3. Tap **Connect wallet**, choose MetaMask, Trust Wallet, Coinbase Wallet, or
   another compatible wallet through AppKit, then approve the connection in the
   wallet app. Return to the browser and confirm the shortened address and
   Ethereum Mainnet status.
4. Test **Switch to Ethereum** from an unsupported network and **Disconnect**.
   Reject a connection request once to verify the rejection message.

Connecting only shares the wallet address and network. The app does not request
private keys or recovery phrases, and no signing or token transactions are
implemented. Wallet connections require an internet connection.
