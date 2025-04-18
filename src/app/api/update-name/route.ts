import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, name } = await request.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      );
    }

    // Update user's name in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        role: true
      }
    });

    return NextResponse.json({ 
      message: 'Name updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating name:', error);
    return NextResponse.json(
      { error: 'Failed to update name' },
      { status: 500 }
    );
  }
} 