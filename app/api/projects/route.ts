import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const projects = await Project.find({ 
      userId: (session.user as any).id 
    })
      .sort({ createdAt: -1 })
      .select('-htmlCode') // Exclude large HTML field for list view
      .lean();

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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

    const { title, prompt, enhancedPrompt, analysis, htmlCode, aiModel, provider } = await req.json();

    if (!title || !prompt || !htmlCode || !aiModel || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.create({
      userId: (session.user as any).id,
      title,
      prompt,
      enhancedPrompt,
      analysis,
      htmlCode,
      aiModel,
      provider,
    });

    return NextResponse.json(
      {
        message: 'Project saved successfully',
        project: {
          id: project._id,
          title: project.title,
          createdAt: project.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save project error:', error);
    return NextResponse.json(
      { error: 'Failed to save project' },
      { status: 500 }
    );
  }
}
