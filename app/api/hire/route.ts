import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/lib/payments/x402';
import { ERC8183_CONTRACTS } from '@/lib/jobs/erc8183';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, clientAddress, providerAddress, taskDescription, budgetAmount, budgetAsset, signature, jobIdOnchain } = body;

    if (!agentId || !clientAddress) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const assignedJobId = jobIdOnchain || '732';

    // Generate standard x402 payment requirements
    const paymentReq = await createPaymentRequest(
      assignedJobId,
      budgetAmount || '0.10',
      (budgetAsset as 'U' | 'USDT' | 'USDC' | 'USD1') || 'U',
      providerAddress || ERC8183_CONTRACTS.commerce
    );

    return NextResponse.json({
      success: true,
      job: {
        id: `job_${assignedJobId}`,
        jobIdOnchain: assignedJobId,
        agentId,
        providerAddress: providerAddress || ERC8183_CONTRACTS.commerce,
        clientAddress,
        status: 'FUNDED',
        taskDescription: taskDescription || 'Execute standard agent strategy job',
        budgetAmount: budgetAmount || '0.10',
        budgetAsset: budgetAsset || 'U',
        signature,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      paymentRequirement: paymentReq,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

