import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target folders relative to project root
const targetFolders = [
    'public', // Scan entire public folder
];

async function compressDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            await compressDirectory(fullPath);
            continue;
        }

        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

        // Skip already small files (e.g. under 100KB) unless it's hero animation which we want SMALL
        // Hero frames need to be very optimized for smooth loading
        const isHero = dirPath.includes('hero-seq');

        // Settings
        const quality = isHero ? 60 : 75; // More aggressive on hero frames
        const width = isHero ? 1280 : 1600; // Limit max width

        const tempPath = fullPath + '.temp' + path.extname(file);

        try {
            const sizeKB = stats.size / 1024;

            // Skip extremely small files to avoid re-compression artifacts
            if (sizeKB < 50 && !isHero) continue;

            let pipeline = sharp(fullPath);

            // Resize if needed
            pipeline = pipeline.resize(width, null, {
                fit: 'inside',
                withoutEnlargement: true
            });

            if (file.endsWith('.png')) {
                pipeline = pipeline.png({ quality: quality });
            } else {
                pipeline = pipeline.jpeg({ quality: quality, mozjpeg: true });
            }

            await pipeline.toFile(tempPath);

            const newStats = fs.statSync(tempPath);

            // Only replace if we actually saved space
            if (newStats.size < stats.size) {
                fs.unlinkSync(fullPath);
                fs.renameSync(tempPath, fullPath);
                console.log(`Compressed ${file}: ${(sizeKB).toFixed(1)}KB -> ${(newStats.size / 1024).toFixed(1)}KB`);
            } else {
                fs.unlinkSync(tempPath);
                // console.log(`Skipped ${file} (no saving)`);
            }

        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }
}

async function main() {
    console.log('Starting compression...');
    for (const folder of targetFolders) {
        const fullPath = path.join(__dirname, folder);
        console.log(`Scanning: ${folder}`);
        await compressDirectory(fullPath);
    }
    console.log('Compression complete!');
}

main();
