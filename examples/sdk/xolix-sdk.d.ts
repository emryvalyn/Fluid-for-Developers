/**
 * Type declarations for @xolix/sdk and Node runtime in developer examples.
 */

declare module '@xolix/sdk' {
  export interface Balances {
    xolt?: bigint;
    gxo?: bigint;
    qusd?: bigint;
    [key: string]: bigint | undefined;
  }

  export interface FeeData {
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
  }

  export interface TransactionReceipt {
    status: number;
    blockNumber: number;
    transactionHash: string;
    gasUsed?: bigint;
    [key: string]: any;
  }

  export interface SimulationReport {
    isValid: boolean;
    riskScore: number;
    reentrancyCheck: boolean;
    invariantsValid: boolean;
    failureReason?: string;
    estimatedXCU: {
      cpu: number;
      storageRead: number;
      storageWrite: number;
      bandwidth: number;
      totalXCU: number;
    };
  }

  export interface UpgradeSimulationReport {
    stateCompatibility: boolean;
    failureReason?: string;
  }

  export interface CompilationArtifact {
    bytecode: string;
    abi: any[];
  }

  export class JsonRpcProvider {
    constructor(options: { url: string; timeoutMs?: number; chainId?: number });
    getChainId(): Promise<number>;
    getBlockNumber(): Promise<number>;
    getBalance(address: string): Promise<bigint>;
    getBalances(address: string): Promise<Balances>;
    getHealth(): Promise<boolean>;
    getFeeData(): Promise<FeeData>;
    getTransactionCount(address: string): Promise<number>;
    waitForTransaction(txHash: string, confirms?: number, timeout?: number): Promise<TransactionReceipt>;
    simulatePreflight(signedTx: string): Promise<SimulationReport>;
    broadcastTransaction(signedTx: string): Promise<{ txHash: string }>;
  }

  export class WebSocketProvider {
    constructor(url: string);
    on(event: string, callback: (...args: any[]) => void): void;
  }

  export class XolixWallet {
    constructor(privateKey: string, provider?: JsonRpcProvider);
    address: string;
    privateKey: string;
    mnemonic?: { phrase: string };
    static createRandom(provider?: JsonRpcProvider): XolixWallet;
    static fromMnemonic(phrase: string, provider?: JsonRpcProvider): XolixWallet;
    getNativeAddress(): string;
    getStealthAddress(): string;
    signMessage(message: string): Promise<string>;
    signTransaction(tx: any): Promise<string>;
    sendTransaction(tx: any): Promise<{ txHash: string }>;
  }

  export class XolixContract {
    constructor(address: string, abi: any[], signerOrProvider: XolixWallet | JsonRpcProvider);
    address: string;
    filters: Record<string, (...args: any[]) => any>;
    read(method: string, ...args: any[]): Promise<any>;
    write(method: string, ...args: any[]): Promise<{ txHash: string }>;
    queryFilter(filter: any, startBlock?: number): Promise<any[]>;
  }

  export class ContractFactory {
    constructor(abi: any[], bytecode: string, wallet: XolixWallet, isEvm?: boolean);
    deploy(...args: any[]): Promise<XolixContract & { waitForDeployment: () => Promise<TransactionReceipt> }>;
  }

  export class FluidContractManager {
    constructor(provider: JsonRpcProvider);
    compileSource(source: string): CompilationArtifact;
    simulateUpgrade(address: string, newBytecode: string): Promise<UpgradeSimulationReport>;
    buildUpgradeProposal(address: string, newBytecode: string, instant?: boolean): any;
    buildExecuteUpgrade(address: string): any;
    buildDeployTransaction(bytecode: string, args?: any[]): any;
  }

  export class XolixUtils {
    static formatXOL(wei: bigint): string;
    static parseXOL(xol: string): bigint;
    static isValidAddress(address: string): boolean;
    static parseAddressType(address: string): 'USER' | 'CONTRACT' | 'VALIDATOR' | 'GOVERNANCE' | 'STEALTH' | 'EVM';
    static evmToNative(evmAddress: string): string;
    static nativeToEvm(nativeAddress: string): string;
  }
}

// Node.js globals & module typings for examples
declare var process: {
  env: Record<string, string | undefined>;
};
declare var __dirname: string;

declare module 'fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function existsSync(path: string): boolean;
}

declare module 'path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
}
