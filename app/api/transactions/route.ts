import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';
import { verifyToken, getUserIdFromToken } from '../../../libs/jwt';

export async function GET(request: NextRequest) {
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

 
   // Log userId to verify it's correct
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { account_no: true }, // Select only the account_no field
  });

  if (!user) {
    throw new Error('User not found');
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { sender_acc_no: user.account_no },
          { receiver_acc_no: user.account_no }
        ]
      },
      orderBy: {
        transfer_date: 'desc'
      }
    });

 // Log transactions to verify data

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
  