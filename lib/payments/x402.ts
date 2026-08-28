/**
 * Binance x402 & Altana Merchant Payment Facilitator Interface
 * Handles HTTP 402 payment requirements, off-chain permit/EIP-3009 authorizations,
 * and $U / stablecoin settlement verification on BSC Testnet.
 */

import { type Address, type Hex } from 'viem';
import { buildEip3009TypedData, type Eip3009PaymentInput } from '@altananetwork/sdk';
import { ERC8183_CONTRACTS, BSC_TESTNET_CHAIN_ID } from '@/lib/jobs/erc8183';

export interface PaymentRequirement {
  scheme: 'exact' | 'permit2';
  network: string;
  asset: Address;
  amount: string;
  payTo: Address;
  merchantId: string;
  facilitatorUrl: string;
  tokenName: string;
  tokenVersion: string;
}

export interface SettlementConfirmation {
  success: boolean;
  txHash: string;
  settledAt: string;
}

// Altana $U Token on BSC Testnet (Chain ID 97)
export const ALTANA_U_TOKEN_BSC_TESTNET = ERC8183_CONTRACTS.paymentToken;

/**
 * Creates standard x402 payment parameters for an ERC-8183 Job hire.
 */
export async function createPaymentRequest(
  jobId: string,
  amountWei: string,
  asset: 'U' | 'USDT' | 'USDC' | 'USD1' = 'U',
  recipient: Address
): Promise<PaymentRequirement> {
  return {
    scheme: 'exact',
    network: `eip155:${BSC_TESTNET_CHAIN_ID}`,
    asset: ALTANA_U_TOKEN_BSC_TESTNET,
    amount: amountWei,
    payTo: recipient,
    merchantId: process.env.X402_MERCHANT_ID || 'orderflow_bsc_marketplace',
    facilitatorUrl: process.env.X402_FACILITATOR_URL || 'https://x402.altana.network/api/v1',
    tokenName: 'United Stables',
    tokenVersion: '1',
  };
}

/**
 * Builds standard EIP-712 typed data for user wallet signature (EIP-3009 TransferWithAuthorization).
 */
export function buildHirePaymentTypedData(params: {
  clientAddress: Address;
  recipientAddress: Address;
  amountWei: bigint;
  nonce?: Hex;
  validBefore?: bigint;
}) {
  const nonce = params.nonce || (`0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` as Hex);
  const validBefore = params.validBefore || BigInt(Math.floor(Date.now() / 1000) + 3600);

  return buildEip3009TypedData({
    chainId: BSC_TESTNET_CHAIN_ID,
    token: ALTANA_U_TOKEN_BSC_TESTNET,
    name: 'United Stables',
    version: '1',
    from: params.clientAddress,
    to: params.recipientAddress,
    value: params.amountWei,
    validAfter: BigInt(0),
    validBefore,
    nonce,
  });
}

