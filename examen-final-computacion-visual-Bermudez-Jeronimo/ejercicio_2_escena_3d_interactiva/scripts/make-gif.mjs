import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const mediaDir = path.join(rootDir, 'media');
const outputPath = path.join(mediaDir, 'demo.gif');

const frames = ['captura_1.png', 'captura_2.png']
  .map((fileName) => path.join(mediaDir, fileName))
  .filter((framePath) => fs.existsSync(framePath))
  .map((framePath) => PNG.sync.read(fs.readFileSync(framePath)));

if (frames.length === 0) {
  console.error('No se encontraron capturas en media/.');
  process.exit(1);
}

const width = frames[0].width;
const height = frames[0].height;
const encoder = new GIFEncoder(width, height);
const stream = encoder.createReadStream();
const output = fs.createWriteStream(outputPath);

stream.pipe(output);
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(900);
encoder.setQuality(10);

for (const frame of frames) {
  if (frame.width !== width || frame.height !== height) {
    console.error('Las capturas deben tener el mismo tamaño.');
    process.exit(1);
  }
  encoder.addFrame(frame.data);
}

encoder.finish();
console.log(`GIF creado en ${outputPath}`);
