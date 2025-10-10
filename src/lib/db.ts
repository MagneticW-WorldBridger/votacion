import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a Neon client for serverless queries
export const sql = neon(process.env.DATABASE_URL);

// Types for our database
export interface Vote {
  id: number;
  voter_name: string;
  place_id: string;
  created_at: Date;
  updated_at: Date;
}

// Get all votes
export async function getAllVotes(): Promise<Vote[]> {
  const votes = await sql`SELECT * FROM votes ORDER BY created_at DESC`;
  return votes as Vote[];
}

// Get votes by voter
export async function getVotesByVoter(voterName: string): Promise<Vote[]> {
  const votes = await sql`
    SELECT * FROM votes 
    WHERE voter_name = ${voterName} 
    ORDER BY created_at DESC
  `;
  return votes as Vote[];
}

// Add a vote (will fail if duplicate due to UNIQUE constraint)
export async function addVote(voterName: string, placeId: string): Promise<Vote> {
  const [vote] = await sql`
    INSERT INTO votes (voter_name, place_id) 
    VALUES (${voterName}, ${placeId}) 
    RETURNING *
  `;
  return vote as Vote;
}

// Remove a vote
export async function removeVote(voterName: string, placeId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM votes 
    WHERE voter_name = ${voterName} AND place_id = ${placeId}
    RETURNING id
  `;
  return result.length > 0;
}

// Get vote counts per place
export async function getVoteCounts(): Promise<Record<string, number>> {
  const rows = await sql`
    SELECT place_id, COUNT(*) as count 
    FROM votes 
    GROUP BY place_id
  `;
  
  const counts: Record<string, number> = {};
  rows.forEach((row: any) => {
    counts[row.place_id] = parseInt(row.count);
  });
  
  return counts;
}

// Get all votes grouped by voter
export async function getAllVotesByVoter(): Promise<Record<string, string[]>> {
  const votes = await sql`SELECT voter_name, place_id FROM votes ORDER BY created_at`;
  
  const votesByVoter: Record<string, string[]> = {};
  votes.forEach((vote: any) => {
    if (!votesByVoter[vote.voter_name]) {
      votesByVoter[vote.voter_name] = [];
    }
    votesByVoter[vote.voter_name].push(vote.place_id);
  });
  
  return votesByVoter;
}

