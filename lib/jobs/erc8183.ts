/**
 * ERC-8183 Job Primitive & Altana SDK Integration
 * Protocol Layer: AgenticCommerce (Escrow) + EvaluatorRouter + OptimisticPolicy
 * States: OPEN (0) -> FUNDED (1) -> SUBMITTED (2) -> COMPLETED (3) / REJECTED (4) / EXPIRED (5)
 */

import { formatUnits, type Address } from 'viem';
import { BNB_TESTNET, ERC8183_ADDRESSES, getErc8183Job, type JobStatusName } from '@altananetwork/sdk';
import { publicClient } from '@/lib/chain/viemClient';

export type JobStatus = JobStatusName;

export const BSC_TESTNET_CHAIN_ID = 97;

export const ERC8183_CONTRACTS = ERC8183_ADDRESSES[BSC_TESTNET_CHAIN_ID] || {
  commerce: '0xa206c0517B6371C6638CD9e4a42Cc9f02A33B0DE' as Address,
  router: '0xD7d36D66d2F1B608A0F943f722D27e3744f66F25' as Address,
  policy: '0x4F4678D4439feC812Ac7674Bb3Efb4C8f5Fb78A6' as Address,
  registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e' as Address,
  paymentToken: '0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565' as Address, // $U token on BSC Testnet
};

export const COMMERCE_ABI = [
  {
    name: 'createJob',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'provider', type: 'address' },
      { name: 'evaluator', type: 'address' },
      { name: 'expiredAt', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'hook', type: 'address' },
    ],
    outputs: [{ name: 'jobId', type: 'uint256' }],
  },
  {
    name: 'setBudget',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'optParams', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    name: 'fund',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'expectedBudget', type: 'uint256' },
      { name: 'optParams', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    name: 'claimRefund',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getJob',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'jobId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        name: 'job',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'client', type: 'address' },
          { name: 'provider', type: 'address' },
          { name: 'evaluator', type: 'address' },
          { name: 'description', type: 'string' },
          { name: 'budget', type: 'uint256' },
          { name: 'expiredAt', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'hook', type: 'address' },
          { name: 'submittedAt', type: 'uint256' },
          { name: 'deliverable', type: 'bytes32' },
        ],
      },
    ],
  },
  {
    name: 'jobCounter',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256' }],
  },
] as const;

export const ROUTER_ABI = [
  {
    name: 'registerJob',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'policy', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'settle',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'uint256' },
      { name: 'evidence', type: 'bytes' },
    ],
    outputs: [],
  },
] as const;

export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: 'remaining', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'symbol', type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'decimals', type: 'uint8' }],
  },
] as const;

export interface JobRecord {
  id: string;
  jobIdOnchain: string;
  agentId: string;
  providerAddress: string;
  clientAddress: string;
  status: JobStatus;
  taskDescription: string;
  budgetAmount: string;
  budgetAsset: string;
  txHashFund?: string;
  deliverable?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Reads the predicted next Job ID from the on-chain AgenticCommerce counter.
 */
export async function getNextJobId(): Promise<bigint> {
  const count = await publicClient.readContract({
    address: ERC8183_CONTRACTS.commerce,
    abi: COMMERCE_ABI,
    functionName: 'jobCounter',
  });
  return count + BigInt(1);
}

/**
 * Fetches real on-chain ERC-8183 Job details from the AgenticCommerce kernel.
 */
export async function getErc8183JobStatus(jobIdOnchain: string): Promise<{ status: JobStatus; deliverableUrl?: string; raw?: any }> {
  try {
    const job = await getErc8183Job(BNB_TESTNET, BigInt(jobIdOnchain));
    return {
      status: job.statusName,
      deliverableUrl: job.deliverable !== '0x0000000000000000000000000000000000000000000000000000000000000000'
        ? `https://testnet.bscscan.com/address/${ERC8183_CONTRACTS.commerce}`
        : undefined,
      raw: job,
    };
  } catch (err: any) {
    const rawJob = await publicClient.readContract({
      address: ERC8183_CONTRACTS.commerce,
      abi: COMMERCE_ABI,
      functionName: 'getJob',
      args: [BigInt(jobIdOnchain)],
    });

    const statusNames: JobStatus[] = ['OPEN', 'FUNDED', 'SUBMITTED', 'COMPLETED', 'REJECTED', 'EXPIRED'];
    return {
      status: statusNames[rawJob.status] || 'OPEN',
      deliverableUrl: rawJob.deliverable !== '0x0000000000000000000000000000000000000000000000000000000000000000'
        ? `https://testnet.bscscan.com/address/${ERC8183_CONTRACTS.commerce}`
        : undefined,
      raw: rawJob,
    };
  }
}
