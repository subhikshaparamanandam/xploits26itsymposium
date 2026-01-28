import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToCompress = [
    'Staff and Office Bearres/Office B/Secretary.jpg',
    'Staff and Office Bearres/Office B/Treasurer 2.jpg',
    'Staff and Office Bearres/Office B/Joint Secretary.jpg',
    'Staff and Office Bearres/Office B/Vice President.jpg',
    'Staff and Office Bearres/Staff/Staff Coordinator 1.jpg',
    'Staff and Office Bearres/Staff/Staff Coordinator 2.jpg'
];

async function compressImages() {
    for (const imagePath of imagesToCompress) {
        const fullPath = path.join(__dirname, imagePath);

        if (!fs.existsSync(fullPath)) {
            console.log(`Skipping (not found): ${imagePath}`);
            continue;
        }

        const stats = fs.statSync(fullPath);
        const sizeMB = stats.size / (1024 * 1024);
        console.log(`Processing: ${imagePath} (${sizeMB.toFixed(2)} MB)`);

        const tempPath = fullPath + '.temp.jpg';

        try {
            await sharp(fullPath)
                .resize(800, 800, { fit: 'cover', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(tempPath);

            fs.unlinkSync(fullPath);
            fs.renameSync(tempPath, fullPath);

            const newStats = fs.statSync(fullPath);
            const newSizeMB = newStats.size / (1024 * 1024);
            console.log(`  Compressed: ${sizeMB.toFixed(2)} MB -> ${newSizeMB.toFixed(2)} MB`);
        } catch (err) {
            console.error(`  Error compressing ${imagePath}:`, err.message);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }
    console.log('Done!');
}

compressImages();
