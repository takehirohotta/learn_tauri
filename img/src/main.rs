//画像を扱うクレート
use image::{Rgba,ImageBuffer};
//ファイルダイアログを扱うクレート
use native_dialog::FileDialog;
//最初に呼ばれるメイン関数
fn main() {
  //色を返すクロージャ
  let draw = |x, _y| {
    //u8の灰色
    let gray = x as u8;
    //赤緑青アルファからなる色
    Rgba::<u8>([gray,gray,gray,255])
  };
  //256x256の画像を生成
  let img = ImageBuffer::from_fn(256, 256, draw);

  let path = FileDialog::new()

  .set_location("~/Desktop")
  
  .show_save_single_file()

  .unwrap();

  match path{
    Some(path)=>{
      img.save(path).unwrap();
    },
    Nome => return,
  };
}
