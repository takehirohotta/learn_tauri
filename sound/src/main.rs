// サウンドを扱うクレート 
use kira::{ 
    manager::{AudioManager, AudioManagerSettings, backend::DefaultBackend}, 
    sound::static_sound::{StaticSoundData, StaticSoundSettings}, 
}; 
//スレッドを扱うクレート 
use std::thread; 
//時間の間隔を扱うクレート 
use std::time::Duration; 

//メイン関数 
fn main() { 
  // オーディオマネージャの生成 
  // ↓ 型名を 'DefaultBackend' に修正
  let mut manager = AudioManager::<DefaultBackend>::new(AudioManagerSettings::default()).unwrap(); 

  //サウンド配列  
  let sound_data = vec!{ 
    //サウンドの読み込み 
    StaticSoundData::from_file("C4.ogg", StaticSoundSettings::default()).unwrap(), 
    //サウンドの読み込み 
    StaticSoundData::from_file("D4.ogg", StaticSoundSettings::default()).unwrap(), 
    //サウンドの読み込み 
    StaticSoundData::from_file("E4.ogg", StaticSoundSettings::default()).unwrap(), 
  }; 
  
  //forループ 
  for i in 0..3 { 
    //サウンドの再生 
    manager.play(sound_data[i].clone()).unwrap(); 
    //1秒スリープ 
    thread::sleep(Duration::from_millis(1000)); 
  }
} 