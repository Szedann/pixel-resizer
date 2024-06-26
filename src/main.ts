import JSZip from "jszip";
import "./style.css";

const fileInput = document.querySelector<HTMLInputElement>("#file");
const scaleInput = document.querySelector<HTMLInputElement>("#scale");

document.getElementById("run")?.addEventListener("click", async () => {
  document.getElementById("result")?.replaceChildren();
  const zip = new JSZip();
  for (let index = 0; index < (fileInput?.files?.length ?? 0); index++) {
    const file = fileInput?.files?.item(index);
    if (!file) continue;
    const scale = parseInt(scaleInput?.value ?? "1");
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const canvas = new OffscreenCanvas(width * scale, height * scale);
    const context = canvas.getContext("2d");
    if (!context) continue;
    context.imageSmoothingEnabled = false;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const img = document.createElement("img");
    const blob = await canvas.convertToBlob();
    img.src = URL.createObjectURL(blob);
    document.getElementById("result")?.appendChild(img);
    zip.file(file.name, blob);
  }
  const zipUrl = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
  document.querySelector<HTMLAnchorElement>("#download")!.href = zipUrl;
});
