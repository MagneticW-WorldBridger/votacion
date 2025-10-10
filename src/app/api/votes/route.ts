import { NextRequest, NextResponse } from 'next/server';
import { getAllVotesByVoter, addVote, removeVote, getVoteCounts } from '@/lib/db';

// GET /api/votes - Get all votes grouped by voter
export async function GET() {
  try {
    const votesByVoter = await getAllVotesByVoter();
    const voteCounts = await getVoteCounts();
    
    return NextResponse.json({
      success: true,
      votes: votesByVoter,
      counts: voteCounts,
    });
  } catch (error: any) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/votes - Toggle a vote (add or remove)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voterName, placeId, action } = body;
    
    // Validate input
    if (!voterName || !placeId) {
      return NextResponse.json(
        { success: false, error: 'voterName and placeId are required' },
        { status: 400 }
      );
    }
    
    if (action === 'remove') {
      // Remove the vote
      const removed = await removeVote(voterName, placeId);
      
      if (!removed) {
        return NextResponse.json(
          { success: false, error: 'Vote not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        action: 'removed',
        voterName,
        placeId,
      });
    } else {
      // Add the vote (default action)
      try {
        const vote = await addVote(voterName, placeId);
        
        return NextResponse.json({
          success: true,
          action: 'added',
          vote,
        });
      } catch (error: any) {
        // Check if it's a duplicate key error
        if (error.message?.includes('duplicate key') || error.code === '23505') {
          return NextResponse.json(
            { success: false, error: 'Vote already exists' },
            { status: 409 }
          );
        }
        throw error;
      }
    }
  } catch (error: any) {
    console.error('Error toggling vote:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

