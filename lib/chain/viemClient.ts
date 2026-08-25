import { createPublicClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';

export const chainId = 97;

export const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545'),
});
