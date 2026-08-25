import { publicClient } from './viemClient';
import { Address } from 'viem';

export const IDENTITY_REGISTRY_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_IDENTITY_REGISTRY as Address) ||
  '0x8004A818BFB912233c491871b3d84c89A494BD9e';

export const REPUTATION_REGISTRY_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_REPUTATION_REGISTRY as Address) ||
  '0x8004B663056A597Dffe9eCcC1965A193B7388713';

export const IDENTITY_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'agentId', type: 'uint256' },
      { internalType: 'string', name: 'key', type: 'string' },
    ],
    name: 'getMetadata',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'agentId', type: 'uint256' }],
    name: 'getAgentWallet',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const REPUTATION_REGISTRY_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'agentId', type: 'uint256' },
      { internalType: 'address[]', name: 'clientAddresses', type: 'address[]' },
      { internalType: 'string', name: 'tag1', type: 'string' },
      { internalType: 'string', name: 'tag2', type: 'string' },
    ],
    name: 'getSummary',
    outputs: [
      { internalType: 'uint64', name: 'count', type: 'uint64' },
      { internalType: 'int128', name: 'summaryValue', type: 'int128' },
      { internalType: 'uint8', name: 'summaryValueDecimals', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export interface OnchainAgentSummary {
  agentId: string;
  owner: string;
  wallet: string | null;
  metadataCategory: string | null;
  tokenUri: string | null;
  reputation: {
    count: number;
    summaryValue: string;
    decimals: number;
  };
}

export async function fetchOnchainAgentReputation(
  agentId: bigint
): Promise<{ count: number; summaryValue: string; decimals: number }> {
  try {
    const result = await publicClient.readContract({
      address: REPUTATION_REGISTRY_ADDRESS,
      abi: REPUTATION_REGISTRY_ABI,
      functionName: 'getSummary',
      args: [agentId, [], '', ''],
    });

    const [count, summaryValue, summaryValueDecimals] = result as [bigint, bigint, number];

    return {
      count: Number(count),
      summaryValue: summaryValue.toString(),
      decimals: Number(summaryValueDecimals),
    };
  } catch (error) {
    console.warn(`Could not read on-chain reputation for agentId ${agentId}:`, error);
    return { count: 0, summaryValue: '0', decimals: 0 };
  }
}
