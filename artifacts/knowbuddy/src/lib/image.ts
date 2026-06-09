export interface CompressedImage {
  base64: string;
  mimeType: string;
}

const MAX_DIMENSION = 1280;
const TARGET_MAX_BYTES = 8 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Bild konnte nicht geladen werden."));
    img.src = dataUrl;
  });
}

function estimateBytes(base64: string): number {
  return Math.floor((base64.length * 3) / 4);
}

export async function compressImage(file: File): Promise<CompressedImage> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  if (width > height && width > MAX_DIMENSION) {
    height = Math.round((height * MAX_DIMENSION) / width);
    width = MAX_DIMENSION;
  } else if (height >= width && height > MAX_DIMENSION) {
    width = Math.round((width * MAX_DIMENSION) / height);
    height = MAX_DIMENSION;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Bild konnte nicht verarbeitet werden.");
  }
  ctx.drawImage(img, 0, 0, width, height);

  const mimeType = "image/jpeg";
  let quality = 0.85;
  let dataOut = canvas.toDataURL(mimeType, quality);
  let base64 = dataOut.split(",")[1] ?? "";

  while (estimateBytes(base64) > TARGET_MAX_BYTES && quality > 0.4) {
    quality -= 0.15;
    dataOut = canvas.toDataURL(mimeType, quality);
    base64 = dataOut.split(",")[1] ?? "";
  }

  if (!base64) {
    throw new Error("Bild konnte nicht verarbeitet werden.");
  }

  return { base64, mimeType };
}
