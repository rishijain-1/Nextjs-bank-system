import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma'; // Adjust the import path if necessary

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Clean up the ID to remove any extra quotes
  const id = (params.id || "").replace(/"/g, '');

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = (params.id || "").replace(/"/g, '');
  const { name, email, account } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, account },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = (params.id || "").replace(/"/g, '');

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
