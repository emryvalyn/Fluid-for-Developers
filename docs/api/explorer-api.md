# XolixScan Block Explorer REST API

The **XolixScan Block Explorer** provides public REST APIs on both Mainnet (`https://scan.xolix.io/api`) and Testnet (`https://scan.xolix.io/api`).

---

## 1. Network Statistics (`GET /api/stats`)

Returns live network metrics, TPS, validator count, and total blocks.

```bash
curl -X GET "https://scan.xolix.io/api/stats"
```

**Response:**
```json
{
  "chainId": 44990,
  "blockHeight": 1845920,
  "tps": 2450.5,
  "activeValidators": 21,
  "totalTransactions": 14290142,
  "avgBlockTimeSeconds": 2.0
}
```

---

## 2. Querying Blocks (`GET /api/blocks`)

```bash
# Get latest 10 blocks
curl -X GET "https://scan.xolix.io/api/blocks?limit=10"

# Get block by height or hash
curl -X GET "https://scan.xolix.io/api/blocks/1845920"
```

---

## 3. Querying Transactions (`GET /api/transactions`)

```bash
# Query transaction by hash
curl -X GET "https://scan.xolix.io/api/transactions/0x8a7b..."
```

**Response:**
```json
{
  "txHash": "0x8a7b...",
  "blockNumber": 1845920,
  "from": "xol1q7k50a2g...",
  "to": "xolc1q9m4e7...",
  "value": "15000000000000000000",
  "status": "SUCCESS",
  "gasUsed": 21540,
  "timestamp": 1791694800
}
```

---

## 4. Querying Account History (`GET /api/accounts/:address/transactions`)

```bash
curl -X GET "https://scan.xolix.io/api/accounts/xol1q7k50a2g.../transactions?page=1&limit=25"
```

---

## 5. Automated Smart Contract Verification (`POST /api/contracts/verify`)

Programmatically verify deployed Fluid or Solidity contracts on XolixScan:

```bash
curl -X POST "https://scan.xolix.io/api/contracts/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "xolc1q9m4e7...",
    "sourceCode": "version 1.0; contract HelloWorld { ... }",
    "compilerVersion": "1.0.0",
    "optimizerRuns": 200,
    "constructorArgs": ["0x..."]
  }'
```

**Response:**
```json
{
  "status": "VERIFIED",
  "contractAddress": "xolc1q9m4e7...",
  "verifiedAt": "2026-10-11T05:50:00Z",
  "explorerUrl": "https://scan.xolix.io/address/xolc1q9m4e7...#contract"
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
