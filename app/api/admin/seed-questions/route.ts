import { createClient } from '@supabase/supabase-js';
import { allQuestions } from '@/lib/data/questions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, 
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const formattedQuestions = allQuestions.map(q => {
      let questionText = q.q;
      if (q.statements && q.statements.length > 0) {
        questionText += '\n\n' + q.statements.join('\n');
      }

      return {
        question: questionText,
        option_a: q.a,
        option_b: q.b,
        option_c: q.c,
        correct: q.correct,
        image_url: q.image 
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/questions-images/${q.image.startsWith('/') ? q.image.substring(1) : q.image}`
          : null,
        double_points: q.doublePoints || false,
        created_at: new Date().toISOString()
      };
    });

    // Chunk insert to avoid request too large errors
    const BATCH_SIZE = 50;
    let insertedCount = 0;
    const errors = [];

    // DELETE ALL EXISTING QUESTIONS FIRST to ensure clean slate (and fix URLs)
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to match all non-empty UUIDs if needed, or use a broad filter

    if (deleteError) {
      console.error('Error deleting existing questions:', deleteError);
      // Proceeding anyway might cause duplicates, but let's try
    }

    for (let i = 0; i < formattedQuestions.length; i += BATCH_SIZE) {
      const chunk = formattedQuestions.slice(i, i + BATCH_SIZE);
      
      const { error } = await supabase
        .from('questions')
        .insert(chunk);

      if (error) {
        console.error(`Error inserting batch ${i}:`, error);
        errors.push({ batchIndex: i, error: error.message });
      } else {
        insertedCount += chunk.length;
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Partial success with errors`,
        inserted: insertedCount,
        total: formattedQuestions.length,
        errors 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${insertedCount} questions`,
      total: formattedQuestions.length
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
