# Testnet Faucet Guide (`tXOL` Distribution)

To build and test contracts on the **XOLIX FLUID Testnet** (`Chain ID: 44991`), developers can request free testnet coins (`tXOL`) through the faucet.

---

## 1. Web Faucet Interface

Visit the official testnet explorer:
👉 **`https://scan.xolix.io/testnet`**

1. Paste your `xol1...` native address or `0x...` EVM address into the faucet input box.
2. Complete the anti-bot verification.
3. Click **"Request 10.0 tXOL"**.
4. Funds arrive within 1 block (~2 seconds).

---

## 2. Programmatic API Faucet Request

You can request testnet funds programmatically from CI/CD test scripts:

```bash
curl -X POST "https://testnet-rpc.xolix.io/faucet" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "xol1q7k50a2g9876543210zyxwvu00000000000000"
  }'
```

**Response:**
```json
{
  "status": "SUCCESS",
  "recipient": "xol1q7k50a2g...",
  "amount": "10000000000000000000",
  "txHash": "0x5e2b..."
}
```

---

## 3. Rate Limits
- **10 tXOL** per request.
- **1 request per hour** per IP / address.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
