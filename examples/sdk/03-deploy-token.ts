/**
 * 03-deploy-token.ts
 * Demonstrates compiling a FluidScript (.fls) contract in-memory,
 * generating XLS bytecode, and deploying it on-chain using ContractFactory.
 */
import { JsonRpcProvider, XolixWallet, FluidContractManager, ContractFactory } from '@xolix/sdk';
import * as fs from 'fs';
import * as path from 'path';

const TESTNET_RPC = 'https://testnet-rpc.xolix.io';

async function main() {
  const provider = new JsonRpcProvider({ url: TESTNET_RPC });

  // Use testnet private key from environment or parameter
  const privateKey = process.env.TESTNET_PRIVATE_KEY || '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const wallet = new XolixWallet(privateKey, provider);
  console.log(`Deploying from account: ${wallet.getNativeAddress()}`);

  // 1. Read QSC-20 contract source code
  const contractPath = path.resolve(__dirname, '../contracts/QSC20.fls');
  let flsSource: string;
  try {
    flsSource = fs.readFileSync(contractPath, 'utf8');
  } catch {
    // Fallback inline source for demonstration
    flsSource = `
version 1.0;
contract SimpleToken {
    state persistent {
        owner: address;
        name: string;
        totalSupply: uint256;
        balances: map<address, uint256>;
    }
    constructor(tName: string, initSupply: uint256) {
        state.owner = msg.sender;
        state.name = tName;
        state.totalSupply = initSupply;
        state.balances[msg.sender] = initSupply;
    }
    public balanceOf(a: address): uint256 { return state.balances[a]; }
    public totalSupply(): uint256 { return state.totalSupply; }
}`;
  }

  // 2. Compile .fls in-memory using FluidContractManager
  console.log('Compiling FluidScript source...');
  const fluidManager = new FluidContractManager(provider);
  const compilationArtifact = fluidManager.compileSource(flsSource);
  console.log('Bytecode size:', compilationArtifact.bytecode.length / 2, 'bytes');

  // 3. Create ContractFactory
  const factory = new ContractFactory(
    compilationArtifact.abi,
    compilationArtifact.bytecode,
    wallet,
    false // false = native Fluid lane, true = EVM lane
  );

  // 4. Deploy with constructor arguments
  console.log('Broadcasting deployment transaction...');
  const deployedContract = await factory.deploy(
    'My Fluid Token',
    'MFT',
    1000000n * 10n ** 18n // 1,000,000 initial supply
  );

  console.log(`\nDeployment submitted!`);
  console.log(`Deterministic Contract Address: ${deployedContract.address}`); // e.g. xolc1...

  // 5. Wait for block confirmation
  const receipt = await deployedContract.waitForDeployment();
  console.log(`Confirmed in Block #${receipt.blockNumber}`);
  console.log(`Gas / XCU Used: ${receipt.gasUsed?.toString()}`);
}

main().catch((err) => {
  console.error('Deployment error:', err);
});
