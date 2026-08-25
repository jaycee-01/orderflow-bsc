/**
 * ERC-8183 Job Primitive Lifecycle Module
 * States: Open -> Funded -> Submitted -> Terminal (Completed / Rejected / Expired)
 */

export type JobStatus = 'OPEN' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED';

export interface CreateJobParams {
  agentId: string;
  clientAddress: string;
  taskDescription: string;
  budgetAmount: string;
  budgetAsset: 'USDT' | 'USDC' | 'U' | 'USD1';
}

export interface JobRecord {
  id: string;
  jobIdOnchain?: string;
  agentId: string;
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

export async function createJobPrimitive(params: CreateJobParams): Promise<JobRecord> {
  // In production / testnet execution, this initializes the job record and prepares ERC-8183 parameters
  const newJob: JobRecord = {
    id: 'job_' + Math.random().toString(36).substring(2, 9),
    agentId: params.agentId,
    clientAddress: params.clientAddress,
    status: 'OPEN',
    taskDescription: params.taskDescription,
    budgetAmount: params.budgetAmount,
    budgetAsset: params.budgetAsset,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return newJob;
}
