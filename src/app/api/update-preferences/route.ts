import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, emailNotifications, showDateTime, timezone } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user's preferences in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        emailNotifications: emailNotifications,
        showDateTime: showDateTime,
        timezone: timezone
      },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        role: true,
        emailNotifications: true,
        showDateTime: true,
        timezone: true
      }
    });

    return NextResponse.json({ 
      message: 'Preferences updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
} 