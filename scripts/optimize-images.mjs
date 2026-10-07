import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';

// Static exports need prebuilt image variants rather than a runtime image server.
await mkdir('public/team/optimized', { recursive: true });
for (const file of await readdir('public/team')) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  for (const width of [128, 256]) {
    await sharp(`public/team/${file}`)
      .rotate()
      .resize(width, width, { fit: 'cover', position: 'north', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(`public/team/optimized/${file.replace(/\.[^.]+$/, '')}-${width}.webp`);
  }
}
