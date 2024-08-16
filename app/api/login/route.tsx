// pages/api/login.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../libs/prisma';
import { generateToken } from '../../../libs/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password }: { email: string; password: string } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Ideally, you would generate a session token or JWT here

    const token = await generateToken(user);
    const userData=user.id;
    
      

    return NextResponse.json({ token,userData}, { status: 200 });

    // return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
