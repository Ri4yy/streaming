import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  const { data: articleData, error: articleError } = await supabase
        .from('collections')
        .select(`
            id, title, hook_text, cover_image, created_at, read_time, category,
            collection_items (
                id, order_index, item_type, item_id, custom_description, cached_metadata
            ),
            collection_tags (
                tags ( name )
            )
        `)
        .eq('slug', '10-shocker-movies')
        .single();
        
    console.log("Error:", articleError);
    console.log("Data:", articleData ? 'FOUND' : 'NULL');
}

testFetch();
