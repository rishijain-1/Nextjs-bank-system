import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { password, email, name, account_no } = data;
    console.log(data)
    // Validate input fields
    if (!password || !email || !name || !account_no) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT!, 10));
    const hash = await bcrypt.hash(password, salt);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with the same email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        hashPassword: hash, // Ensure this matches the schema field
        name,
        account_no,
      },
    });

    return NextResponse.json(
      { message: 'Account opened successfully!', data: newUser },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json({ error}, { status: 500 });
  }
}
