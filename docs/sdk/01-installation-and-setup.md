# SDK Installation & Environment Setup

This guide details how to install and configure `@xolix/sdk` in both Node.js server environments and modern frontend frameworks (Next.js, Vite, React).

---

## 1. Package Installation

```bash
# Using npm
npm install @xolix/sdk ethers

# Using yarn
yarn add @xolix/sdk ethers

# Using pnpm
pnpm add @xolix/sdk ethers
```

---

## 2. TypeScript Configuration (`tsconfig.json`)

Ensure your `tsconfig.json` has `moduleResolution` set to `node` or `bundler` and target at least `ES2020`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

## 3. Next.js App Router Integration

When integrating `@xolix/sdk` inside a Next.js (v14/v15) App Router project:

```typescript
// app/providers/xolix.ts
import { JsonRpcProvider } from '@xolix/sdk';

export const xolixProvider = new JsonRpcProvider({
  url: process.env.NEXT_PUBLIC_XOLIX_RPC_URL || 'https://rpc.xolix.io',
  chainId: 44990
});
```

Because `@xolix/sdk` is isomorphic, it runs seamlessly in server-side API routes (`route.ts`) as well as client components (`'use client'`).

---

## 4. Secure Environment Variables

Never commit private keys or seed phrases to source control. Always load credentials through environment variables:

```bash
# .env.local
XOLIX_RPC_URL="https://rpc.xolix.io"
WALLET_PRIVATE_KEY="0x0123456789abcdef..."
```

```typescript
import { XolixWallet, JsonRpcProvider } from '@xolix/sdk';

const provider = new JsonRpcProvider({ url: process.env.XOLIX_RPC_URL });
const wallet = new XolixWallet(process.env.WALLET_PRIVATE_KEY!, provider);
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
