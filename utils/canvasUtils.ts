/**
 * Draws the image and the roast text onto a canvas and returns the data URL.
 */
export const createShareableImage = (
  imageSrc: string,
  roastText: string,
  styleName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      if (!ctx) {
        reject("Could not get canvas context");
        return;
      }

      // Set canvas dimensions (keep aspect ratio, but max out width/height for quality)
      const targetWidth = 1080;
      const scale = targetWidth / img.width;
      const targetHeight = img.height * scale;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 1. Draw Image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // 2. Add Gradient Overlay (Bottom up)
      const gradient = ctx.createLinearGradient(0, targetHeight / 2, 0, targetHeight);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.6, "rgba(0,0,0,0.8)");
      gradient.addColorStop(1, "rgba(0,0,0,0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // 3. Add Watermark/Title
      ctx.font = "bold 40px Inter, sans-serif";
      ctx.fillStyle = "#ec4899"; // Pink-500
      ctx.textAlign = "right";
      ctx.fillText("AI Roast Cam", targetWidth - 40, 60);

      ctx.font = "bold 24px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(`Style: ${styleName}`, targetWidth - 40, 100);

      // 4. Add Roast Text (Text Wrapping)
      const fontSize = 48;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxWidth = targetWidth - 100;
      const lineHeight = fontSize * 1.4;
      const words = roastText.split(" ");
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const width = ctx.measureText(currentLine + " " + words[i]).width;
        if (width < maxWidth) {
          currentLine += " " + words[i];
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);

      // Draw lines from bottom up
      const bottomMargin = 80;
      const totalTextHeight = lines.length * lineHeight;
      let startY = targetHeight - bottomMargin - totalTextHeight + lineHeight;

      lines.forEach((line) => {
        // Text Shadow for readability
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;
        ctx.fillText(line, targetWidth / 2, startY);
        ctx.shadowBlur = 0;
        startY += lineHeight;
      });

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (err) => reject(err);
  });
};

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
