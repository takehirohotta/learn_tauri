// [修正4] グローバルスコープにあった変数を削除
// let canvas, context;

// グローバルオブジェクトから必要なAPIを取得します。
const { invoke } = window.__TAURI__.core;
const { open, save } = window.__TAURI__.dialog;

// [修正1] DOM要素取得コードはDOMContentLoadedの中に移動させるため、ここでは宣言だけ行う
let _width, _height, _canvas, _context, _red, _green, _blue, _pen, _color;
let _undo = [];


// ===== 関数定義 (ここから) =====

// [修正2] 「新規」ボタンに対応するnewImage関数を新規作成
function newImage() {
  saveForUndo(); // アンドゥ用に現在の状態を保存
  _context.clearRect(0, 0, _canvas.width, _canvas.height); // キャンバスをクリア
}

async function openImage() {
  try {
    const filePath = await open({
      multiple: false,
      filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg'] }],
    });

    if (filePath) {
      saveForUndo(); // アンドゥ用に現在の状態を保存
      const [width, height, pixelData] = await invoke('open_img', { path: filePath });
      // [修正4] 変数名を _canvas, _context に統一
      _canvas.width = width;
      _canvas.height = height;
      const imageData = new ImageData(new Uint8ClampedArray(pixelData), width, height);
      _context.putImageData(imageData, 0, 0);
      _width.value = width;
      _height.value = height;
    }
  } catch (error) {
    console.error("画像の読み込みに失敗しました:", error);
  }
}

async function saveImage() {
  // [修正4] 変数名を _canvas に統一
  if (_canvas.width === 0 || _canvas.height === 0) {
    alert("保存する画像がありません。");
    return;
  }
  try {
    const filePath = await save({
      filters: [{ name: 'PNG Image', extensions: ['png'] }],
    });
    if (filePath) {
      // [修正4] 変数名を _canvas, _context に統一
      const w = _canvas.width;
      const h = _canvas.height;
      const imageData = _context.getImageData(0, 0, w, h);
      await invoke('save_img', {
        path: filePath,
        width: w,
        height: h,
        data: Array.from(imageData.data)
      });
      alert("画像を保存しました！");
    }
  } catch (error) {
    console.error("画像の保存に失敗しました:", error);
  }
}

function getPos(event) {
  let clientRect = _canvas.getBoundingClientRect();
  let x = event.clientX - clientRect.left;
  let y = event.clientY - clientRect.top;
  return [x, y];
}

function maru(event) {
  saveForUndo(); // [修正3] 描画直前にアンドゥ情報を保存
  let pos = getPos(event);
  let color = 'rgb(' + 2 * _red.value / 3 + ',' + 2 * _green.value / 3 + ',' + 2 * _blue.value / 3 + ')';
  _context.beginPath();
  _context.lineWidth = 1;
  _context.strokeStyle = color;
  color = 'rgb(' + _red.value + ',' + _green.value + ',' + _blue.value + ')';
  _context.fillStyle = color;
  _context.arc(pos[0], pos[1], _pen.value, 0, Math.PI * 2, true);
  _context.fill();
  _context.stroke();
}

function undoImage() {
  if (_undo.length > 0) {
    let undo = _undo.pop(); // popで最後の要素を取り出す
    _canvas.width = undo.width;
    _canvas.height = undo.height;
    _context.putImageData(undo.data, 0, 0);
    _width.value = _canvas.width;
    _height.value = _canvas.height;
  }
}

// [修正3] アンドゥ情報を保存するためのヘルパー関数
function saveForUndo() {
  const currentData = _context.getImageData(0, 0, _canvas.width, _canvas.height);
  _undo.push({
    width: _canvas.width,
    height: _canvas.height,
    data: currentData
  });
}

function changeWidth(text) {
  saveForUndo();
  let img = _context.getImageData(0, 0, _canvas.width, _canvas.height);
  _canvas.width = text.value;
  _context.putImageData(img, 0, 0);
}

function changeHeight(text) {
  saveForUndo();
  let img = _context.getImageData(0, 0, _canvas.width, _canvas.height);
  _canvas.height = text.value;
  _context.putImageData(img, 0, 0);
}

function setColor() {
  let color = 'rgb(' + _red.value + ',' + _green.value + ',' + _blue.value + ')';
  _color.style.backgroundColor = color;
  let diameter = parseInt(_pen.value) * 2;
  _color.style.width = diameter + 'px';
  _color.style.height = diameter + 'px';
}

// ===== 関数定義 (ここまで) =====


// DOMの読み込みが完了したら、すべての初期化処理とイベントリスナーの設定を行う
window.addEventListener("DOMContentLoaded", () => {
  // [修正1] ここで初めてDOM要素を取得する
  _width = document.querySelector('#width');
  _height = document.querySelector('#height');
  _canvas = document.querySelector('canvas');
  _context = _canvas.getContext('2d');
  _red = document.querySelector('#red');
  _green = document.querySelector('#green');
  _blue = document.querySelector('#blue');
  _pen = document.querySelector('#pen');
  _color = document.querySelector('#color');

  // イベントリスナーの設定
  _canvas.addEventListener("mouseup", (e) => { maru(e); });
  _red.addEventListener(`input`, setColor); // changeよりinputの方がスムーズに動きます
  _green.addEventListener(`input`, setColor);
  _blue.addEventListener(`input`, setColor);
  _pen.addEventListener('input', setColor);

  // 初期キャンバスサイズ設定
  _canvas.width = 800;
  _canvas.height = 600;
  _width.value = _canvas.width;
  _height.value = _canvas.height;
  
  // 初期カラーの設定
  setColor();
});