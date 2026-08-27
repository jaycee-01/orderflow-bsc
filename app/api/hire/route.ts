import { NextResponse } from 'next/server';
import { createJobPrimitive } from '@/lib/jobs/erc8183';
import { createPaymentRequest } from '@/lib/payments/x402';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentId, clientAddress, providerAddress, taskDescription, budgetAmount, budgetAsset } = body;

    if (!agentId || !clientAddress) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    // Step 1: Create ERC-8183 Job Primitive
    const job = await createJobPrimitive({
      agentId,
      providerAddress: providerAddress || '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
      clientAddress,
      taskDescription: taskDescription || 'Execute standard agent strategy job',
      budgetAmount: budgetAmount || '1.00',
      budgetAsset: budgetAsset || 'U',
    });

    // Step 2: Generate x402 Payment Requirements
    const paymentReq = await createPaymentRequest(
      job.id,
      job.budgetAmount,
      (job.budgetAsset as 'U' | 'USDT' | 'USDC' | 'USD1') || 'U',
      '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
    );

    return NextResponse.json({
      success: true,
      job,
      paymentRequirement: paymentReq,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
