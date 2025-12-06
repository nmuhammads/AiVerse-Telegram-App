
import { createThumbnail } from '../api/services/r2Service.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase credentials missing');
    process.exit(1);
}

async function supaSelect(table: string, query: string) {
    const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
    const headers = {
        'apikey': SUPABASE_KEY!,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
    };
    const r = await fetch(url, { headers });
    return await r.json();
}

async function run() {
    console.log('Starting backfill for December 2025...');

    // Select generations from Dec 1st 2025 onwards
    // Filter for completed and valid image_url
    // Use batches to avoid timeouts
    let offset = 0;
    const limit = 50;
    let totalProcessed = 0;

    const startDate = '2025-12-01T00:00:00Z';

    while (true) {
        console.log(`Fetching batch: offset ${offset}, limit ${limit}...`);

        // Supabase query
        // created_at >= startDate
        // status = completed
        // image_url not null
        const query = `?select=id,image_url,created_at&status=eq.completed&created_at=gte.${startDate}&limit=${limit}&offset=${offset}&order=created_at.desc`;

        const data = await supaSelect('generations', query);

        if (!data || !Array.isArray(data) || data.length === 0) {
            console.log('No more items found.');
            break;
        }

        console.log(`Processing ${data.length} items...`);

        // Process in parallel (limit concurrency if needed, but 50 parallel is usually okay for R2)
        const promises = data.map(async (gen: any) => {
            if (!gen.image_url) return;

            console.log(`[${gen.id}] Processing URL: ${gen.image_url}`);
            try {
                // Determine if we need to check if thumb exists? 
                // Currently creates blind. That's safer for "ensure" logic.
                const res = await createThumbnail(gen.image_url, gen.image_url, `gen_${gen.id}_thumb.jpg`);
                if (res) {
                    console.log(`[${gen.id}] Success: ${res}`);
                } else {
                    console.warn(`[${gen.id}] Failed to create thumbnail`);
                }
            } catch (e) {
                console.error(`[${gen.id}] Error:`, e);
            }
        });

        await Promise.all(promises);

        totalProcessed += data.length;
        offset += limit;

        // Optional: sleep slightly to avoid rate limits?
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`Backfill complete. Processed ${totalProcessed} generations.`);
}

run().catch(console.error);
