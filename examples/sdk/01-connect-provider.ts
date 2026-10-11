/**
 * 01-connect-provider.ts
 * Demonstrates connecting to XOLIX FLUID RPC nodes (Mainnet & Testnet),
 * querying block height, gas prices, and network health.
 */
import { JsonRpcProvider } from '@xolix/sdk';

// Official Public RPC URLs
const MAINNET_RPC = 'https://rpc.xolix.io';
const TESTNET_RPC = 'https://testnet-rpc.xolix.io';

async function main() {
  console.log('Connecting to XOLIX FLUID Testnet...');
  const provider = new JsonRpcProvider({ url: TESTNET_RPC });

  // 1. Fetch Chain ID
  const chainId = await provider.getChainId();
  console.log(`Connected Chain ID: ${chainId} (Expected: 44991 for Testnet, 44990 for Mainnet)`);

  // 2. Fetch Latest Block Number
  const blockNumber = await provider.getBlockNumber();
  console.log(`Latest Block Height: #${blockNumber}`);

  // 3. Fetch Gas Price / Base Fee
  const feeData = await provider.getFeeData();
  console.log(`Current Gas Price: ${feeData.gasPrice?.toString()} wei`);

  // 4. Query Node Health Status
  const isHealthy = await provider.getHealth();
  console.log(`Node Health Status: ${isHealthy ? 'HEALTHY' : 'DEGRADED'}`);
}

main().catch((err) => {
  console.error('Provider connection error:', err);
});
