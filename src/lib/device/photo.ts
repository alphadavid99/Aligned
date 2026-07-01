// Photo adapter (web). Square-crop centre → downscale → JPEG base64.
// Ported from aligned-accounts.html. Kept behind this small module so the
// swap to a Capacitor Camera plugin later is a one-file change.

export function fileToAvatarDataUrl(
  file: File,
  size = 256,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("That image couldn’t be read."));
          return;
        }
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("That image couldn’t be read."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("That image couldn’t be read."));
    reader.readAsDataURL(file);
  });
}
