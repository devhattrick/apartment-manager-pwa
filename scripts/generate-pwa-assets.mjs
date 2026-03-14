import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

const outputDir = path.resolve('public');

const palette = {
  dark: [9, 99, 126, 255],
  primary: [8, 131, 149, 255],
  soft: [122, 178, 178, 255],
  light: [235, 244, 246, 255],
  white: [255, 255, 255, 255],
};

const crcTable = new Uint32Array(256);

for (let i = 0; i < 256; i += 1) {
  let c = i;

  for (let j = 0; j < 8; j += 1) {
    c = (c & 1) === 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }

  crcTable[i] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;

  for (const value of buffer) {
    c = crcTable[(c ^ value) & 0xff] ^ (c >>> 8);
  }

  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const lengthBuffer = Buffer.alloc(4);
  const checksumBuffer = Buffer.alloc(4);

  lengthBuffer.writeUInt32BE(data.length, 0);
  checksumBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([lengthBuffer, typeBuffer, data, checksumBuffer]);
}

function createPng(width, height, pixels) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let row = 0; row < height; row += 1) {
    const rowOffset = row * (stride + 1);
    const pixelOffset = row * stride;

    raw[rowOffset] = 0;
    pixels.copy(raw, rowOffset + 1, pixelOffset, pixelOffset + stride);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    createChunk('IHDR', header),
    createChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    createChunk('IEND', Buffer.alloc(0)),
  ]);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function mixColor(from, to, ratio) {
  return from.map((value, index) =>
    Math.round(value + (to[index] - value) * clamp(ratio, 0, 1))
  );
}

function setPixel(buffer, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) {
    return;
  }

  const offset = (y * size + x) * 4;

  buffer[offset] = color[0];
  buffer[offset + 1] = color[1];
  buffer[offset + 2] = color[2];
  buffer[offset + 3] = color[3];
}

function fillRect(buffer, size, x, y, width, height, color) {
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(size, Math.ceil(x + width));
  const endY = Math.min(size, Math.ceil(y + height));

  for (let row = startY; row < endY; row += 1) {
    for (let col = startX; col < endX; col += 1) {
      setPixel(buffer, size, col, row, color);
    }
  }
}

function fillRoundedRect(buffer, size, x, y, width, height, radius, color) {
  const startX = Math.max(0, Math.floor(x));
  const startY = Math.max(0, Math.floor(y));
  const endX = Math.min(size, Math.ceil(x + width));
  const endY = Math.min(size, Math.ceil(y + height));
  const clampedRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  const left = x;
  const right = x + width;
  const top = y;
  const bottom = y + height;

  for (let row = startY; row < endY; row += 1) {
    for (let col = startX; col < endX; col += 1) {
      const px = col + 0.5;
      const py = row + 0.5;

      const dx =
        px < left + clampedRadius
          ? left + clampedRadius - px
          : px > right - clampedRadius
            ? px - (right - clampedRadius)
            : 0;
      const dy =
        py < top + clampedRadius
          ? top + clampedRadius - py
          : py > bottom - clampedRadius
            ? py - (bottom - clampedRadius)
            : 0;

      if (dx * dx + dy * dy <= clampedRadius * clampedRadius) {
        setPixel(buffer, size, col, row, color);
      }
    }
  }
}

function fillCircle(buffer, size, cx, cy, radius, color) {
  const startX = Math.max(0, Math.floor(cx - radius));
  const startY = Math.max(0, Math.floor(cy - radius));
  const endX = Math.min(size, Math.ceil(cx + radius));
  const endY = Math.min(size, Math.ceil(cy + radius));
  const radiusSquared = radius * radius;

  for (let row = startY; row < endY; row += 1) {
    for (let col = startX; col < endX; col += 1) {
      const dx = col + 0.5 - cx;
      const dy = row + 0.5 - cy;

      if (dx * dx + dy * dy <= radiusSquared) {
        setPixel(buffer, size, col, row, color);
      }
    }
  }
}

function buildIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const windowColor = mixColor(palette.dark, palette.primary, 0.25);
  const towerColor = mixColor(palette.white, palette.light, 0.35);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const diagonal = (x + y) / (size * 2);
      const vertical = y / size;
      const background = mixColor(
        mixColor(palette.dark, palette.primary, diagonal * 0.75),
        palette.soft,
        vertical * 0.18
      );

      setPixel(pixels, size, x, y, background);
    }
  }

  fillCircle(pixels, size, size * 0.77, size * 0.24, size * 0.12, [
    255,
    255,
    255,
    38,
  ]);
  fillCircle(pixels, size, size * 0.77, size * 0.24, size * 0.085, [
    235,
    244,
    246,
    120,
  ]);

  fillRoundedRect(
    pixels,
    size,
    size * 0.19,
    size * 0.17,
    size * 0.62,
    size * 0.66,
    size * 0.06,
    towerColor
  );
  fillRoundedRect(
    pixels,
    size,
    size * 0.24,
    size * 0.11,
    size * 0.52,
    size * 0.12,
    size * 0.05,
    palette.soft
  );

  const cellWidth = size * 0.12;
  const cellHeight = size * 0.105;
  const gapX = size * 0.05;
  const gapY = size * 0.055;
  const startX = size * 0.28;
  const startY = size * 0.28;

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      fillRoundedRect(
        pixels,
        size,
        startX + col * (cellWidth + gapX),
        startY + row * (cellHeight + gapY),
        cellWidth,
        cellHeight,
        size * 0.018,
        windowColor
      );
    }
  }

  fillRoundedRect(
    pixels,
    size,
    size * 0.435,
    size * 0.64,
    size * 0.13,
    size * 0.19,
    size * 0.035,
    palette.dark
  );

  return createPng(size, size, pixels);
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  await Promise.all([
    writeFile(path.join(outputDir, 'pwa-192x192.png'), buildIcon(192)),
    writeFile(path.join(outputDir, 'pwa-512x512.png'), buildIcon(512)),
    writeFile(path.join(outputDir, 'apple-touch-icon.png'), buildIcon(180)),
  ]);
}

await main();
