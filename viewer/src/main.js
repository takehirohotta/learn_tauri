// import文はすべて削除します。

// グローバルオブジェクトから必要なAPIを取得します。
const { invoke } = window.__TAURI__.core;
const { open, save } = window.__TAURI__.dialog;

// グローバル変数を定義
let canvas, context;

// 画像を開く関数 (内部のロジックは変更なし)
async function openImage() {
  try {
    const filePath = await open({
      multiple: false,
      filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg'] }],
    });

    if (filePath) {
      const [width, height, pixelData] = await invoke('open_img', { path: filePath });
      canvas.width = width;
      canvas.height = height;
      const imageData = new ImageData(new Uint8ClampedArray(pixelData), width, height);
      context.putImageData(imageData, 0, 0);
    }
  } catch (error) {
    console.error("画像の読み込みに失敗しました:", error);
  }
}

// 画像を保存する関数 (内部のロジックは変更なし)
async function saveImage() {
  if (canvas.width === 0 || canvas.height === 0) {
    alert("保存する画像がありません。");
    return;
  }
  try {
    const filePath = await save({
      filters: [{ name: 'PNG Image', extensions: ['png'] }],
    });
    if (filePath) {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = context.getImageData(0, 0, w, h);
      await invoke('save_img', {
        path: filePath,
        width: w,
        height: h,
        data: Array.from(imageData.data)
      });
      alert("画像を保存しました！");
    }
  } catch (error)
 {
    console.error("画像の保存に失敗しました:", error);
  }
}

// DOMが読み込まれたら実行
window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('image-canvas');
  context = canvas.getContext('2d');
  document.getElementById('open-btn').addEventListener('click', openImage);
  document.getElementById('save-btn').addEventListener('click', saveImage);
});