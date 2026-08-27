/**
 * ERC-8183 Job Primitive & Altana SDK Wrapper
 * States: Open -> Funded -> Submitted -> Terminal (Completed / Rejected / Expired)
 */

export type JobStatus = 'OPEN' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED';

export interface CreateJobParams {
  agentId: string;
  providerAddress: string;
  clientAddress: string;
  taskDescription: string;
  budgetAmount: string;
  budgetAsset: 'U' | 'USDT' | 'USDC' | 'USD1';
}

export interface JobRecord {
  id: string;
  jobIdOnchain?: string;
  agentId: string;
  providerAddress: string;
  clientAddress: string;
  status: JobStatus;
  taskDescription: string;
  budgetAmount: string;
  budgetAsset: string;
  txHashFund?: string;
  txHashSettle?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Prepares and creates an ERC-8183 Job primitive via Altana SDK integration fallback.
 */
export async function createJobPrimitive(params: CreateJobParams): Promise<JobRecord> {
  const mockOnchainJobId = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  return {
    id: 'job_' + Math.random().toString(36).substring(2, 9),
    jobIdOnchain: mockOnchainJobId,
    agentId: params.agentId,
    providerAddress: params.providerAddress,
    clientAddress: params.clientAddress,
    status: 'OPEN',
    taskDescription: params.taskDescription,
    budgetAmount: params.budgetAmount,
    budgetAsset: params.budgetAsset,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fetches status for an ERC-8183 Job using Altana SDK getErc8183Job contract interface.
 */
export async function getErc8183JobStatus(jobIdOnchain: string): Promise<{ status: JobStatus; deliverableUrl?: string }> {
  // In production with live Altana SDK:
  // import { getErc8183Job, BNB } from '@altananetwork/sdk';
  // return await getErc8183Job(BNB, jobIdOnchain);
  return {
    status: 'FUNDED',
    deliverableUrl: `https://testnet.bscscan.com/tx/${jobIdOnchain}`,
  };
}
