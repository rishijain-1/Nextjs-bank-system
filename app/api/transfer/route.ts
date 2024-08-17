import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '../../../libs/prisma';  // Adjust the path if needed
import { verifyToken, getUserIdFromToken } from '../../../libs/jwt';

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { receiver_acc_no, amount, type, method } = await request.json();

  if (!receiver_acc_no || amount == null || !type || !method) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (amount <= 0) {
    return NextResponse.json({ error: 'Amount must be greater than zero' }, { status: 400 });
  }

  try {
    // Retrieve sender and receiver users
    const sender = await prisma.user.findUnique({ where: { id: userId } });
    const receiver = await prisma.user.findUnique({ where: { account_no: receiver_acc_no } });

    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    if (sender.closeningBalance < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // Start transaction
    
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the transaction record
      await tx.transaction.create({
        data: {
          sender_acc_no: sender.account_no,
          receiver_acc_no: receiver.account_no,
          amount,
          type,
          method,
          transfer_date: new Date(),
        },
      });

      // Update sender's balance
      await tx.user.update({
        where: { id: sender.id },
        data: {
          closeningBalance: sender.closeningBalance - amount,
        },
      });

      // Update receiver's balance
      await tx.user.update({
        where: { id: receiver.id },
        data: {
          closeningBalance: receiver.closeningBalance + amount,
        },
      });
    });

    return NextResponse.json({ message: 'Transfer successful' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
