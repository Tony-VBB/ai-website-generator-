import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const chats = await ChatHistory.find({ 
      userId: (session.user as any).id 
    })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ chats });
  } catch (error: any) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, messages, projectId } = await req.json();

    if (!title || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const chat = await ChatHistory.create({
      userId: (session.user as any).id,
      title,
      messages,
      projectId,
    });

    return NextResponse.json(
      {
        message: 'Chat saved successfully',
        chat: {
          id: chat._id,
          title: chat.title,
          createdAt: chat.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save chat error:', error);
    return NextResponse.json(
      { error: 'Failed to save chat' },
      { status: 500 }
    );
  }
}
