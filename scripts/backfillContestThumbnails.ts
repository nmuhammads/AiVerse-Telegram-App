
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
    console.log('Starting backfill for CONTEST entries...');

    let offset = 0;
    const limit = 50;
    let totalProcessed = 0;

    // We want ALL contest entries, regardless of date.
    while (true) {
        console.log(`Fetching batch: offset ${offset}, limit ${limit}...`);

        // Select contest entries and their generation image url
        const query = `?select=id,generation_id,generations(id,image_url)&limit=${limit}&offset=${offset}&order=created_at.desc`;

        const data = await supaSelect('contest_entries', query);

        if (!data || !Array.isArray(data) || data.length === 0) {
            console.log('No more items found.');
            break;
        }

        console.log(`Processing ${data.length} items...`);

        const promises = data.map(async (entry: any) => {
            const gen = entry.generations;
            if (!gen || !gen.image_url) {
                console.warn(`[Entry ${entry.id}] No generation data or image_url`);
                return;
            }

            // Check if we already did it? No easy way without checking R2 head, just overwrite.
            // console.log(`[Gen ${gen.id}] Processing URL: ${gen.image_url}`);
            try {
                const res = await createThumbnail(gen.image_url, gen.image_url, `gen_${gen.id}_thumb.jpg`);
                if (res) {
                    process.stdout.write('.'); // Compact progress
                } else {
                    console.warn(`\n[Gen ${gen.id}] Failed`);
                }
            } catch (e) {
                console.error(`\n[Gen ${gen.id}] Error:`, e);
            }
        });

        await Promise.all(promises);
        console.log(''); // Newline after dots

        totalProcessed += data.length;
        offset += limit;

        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`Contest Backfill complete. Processed ${totalProcessed} entries.`);
}

run().catch(console.error);
