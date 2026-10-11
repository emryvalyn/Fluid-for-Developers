/**
 * 04-interact-contract.ts
 * Demonstrates calling zero-gas view methods (contract.read)
 * and broadcasting state-mutating transactions (contract.write)
 * against a deployed Fluid contract on XOLIX.
 */
import { JsonRpcProvider, XolixWallet, XolixContract, XolixUtils } from '@xolix/sdk';

const TESTNET_RPC = 'https://testnet-rpc.xolix.io';

// Minimal ABI for QSC-20 Token
const QSC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)'
];

async function main() {
  const provider = new JsonRpcProvider({ url: TESTNET_RPC });
  const wallet = new XolixWallet('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', provider);

  // Address of deployed contract (Bech32m xolc1... or 0x...)
  const contractAddress = 'xolc1qtestnetcontract0000000000000000000000000';
  const contract = new XolixContract(contractAddress, QSC20_ABI, wallet);

  console.log(`Interacting with contract at ${contractAddress}...`);

  // 1. Read methods (executed via eth_call / zero-gas, instantaneous)
  try {
    const tokenName = await contract.read('name');
    const tokenSymbol = await contract.read('symbol');
    const totalSupply = await contract.read('totalSupply');
    const userBalance = await contract.read('balanceOf', wallet.getNativeAddress());

    console.log(`Token: ${tokenName} (${tokenSymbol})`);
    console.log(`Total Supply: ${XolixUtils.formatXOL(totalSupply)}`);
    console.log(`Your Balance: ${XolixUtils.formatXOL(userBalance)}`);
  } catch (err) {
    console.log('Read call simulation (mock address demonstration)');
  }

  // 2. Write method (consumes XCU, signs transaction with wallet, waits for receipt)
  const recipient = 'xol1qrecipient00000000000000000000000000';
  const transferAmount = XolixUtils.parseXOL('25.0'); // 25 tokens

  console.log(`\nInitiating transfer of 25.0 tokens to ${recipient}...`);
  // contract.write(methodName, ...args)
  const tx = await contract.write('transfer', recipient, transferAmount);
  console.log(`Transaction broadcast! Hash: ${tx.txHash}`);

  // 3. Wait for block confirmation
  const receipt = await provider.waitForTransaction(tx.txHash);
  console.log(`Confirmed in Block #${receipt.blockNumber} with status ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}`);
}

main().catch((err) => {
  console.error('Contract interaction error:', err);
});
