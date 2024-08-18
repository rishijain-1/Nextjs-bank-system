// pages/api/transaction-analysis.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';
import { verifyToken, getUserIdFromToken } from '../../../libs/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
        console.log('No authorization token')
    return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
  }


    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      console.error('Invalid or expired token');
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      console.error('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { account_no: true }, // Select only the account_no field
    });

    if (!user) {
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { sender_acc_no: user.account_no }, // Fixed to user.account_no
          { receiver_acc_no: user.account_no }
        ]
      },
      orderBy: {
        transfer_date: 'desc'
      }
    });

    const processedTransactions = transactions.map((transaction) => {
      if (transaction.sender_acc_no === user.account_no) {
        transaction.method = 'DEBIT';
      } else if (transaction.receiver_acc_no === user.account_no) {
        transaction.method = 'CREDIT';
      }
      return { ...transaction };
    });

    const monthlyData = processedTransactions.reduce((acc, transaction) => {
      const month = transaction.transfer_date.toISOString().slice(0, 7); 
      if (!acc[month]) {
        acc[month] = { debit: 0, credit: 0 };
      }

      if (transaction.method === 'DEBIT') {
        acc[month].debit += transaction.amount;
      } else if (transaction.method === 'CREDIT') {
        acc[month].credit += transaction.amount;
      }

      return acc;
    }, {} as { [key: string]: { debit: number; credit: number } });

    const result = Object.keys(monthlyData).map((month) => ({
      date: month,
      debit: monthlyData[month].debit,
      credit: monthlyData[month].credit,
    }));

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
