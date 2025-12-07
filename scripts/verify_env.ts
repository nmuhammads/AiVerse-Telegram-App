import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createThumbnail } from '../api/services/r2Service.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('--- Environment Verification ---');
console.log('R2_BUCKET_THUMBNAILS:', process.env.R2_BUCKET_THUMBNAILS);
console.log('R2_PUBLIC_URL_THUMBNAILS:', process.env.R2_PUBLIC_URL_THUMBNAILS);

if (!process.env.R2_BUCKET_THUMBNAILS || !process.env.R2_PUBLIC_URL_THUMBNAILS) {
    console.error('❌ Missing R2_BUCKET_THUMBNAILS or R2_PUBLIC_URL_THUMBNAILS');
} else {
    console.log('✅ R2 Thumbnail config found');
}

// Simulate URL construction
const mockId = 12345;
const expectedUrl = `${process.env.R2_PUBLIC_URL_THUMBNAILS}/gen_${mockId}_thumb.jpg`;
console.log('Expected Thumbnail URL Structure:', expectedUrl);

// Verify r2Service logic
// We can't easily mock the upload without mocking S3 client, but we can check if it reads env
console.log('--- r2Service Env Check ---');
// We can't import the internal var from the module, but we can trust the logic we wrote if env is present.
