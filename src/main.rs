enum EnumTypo {
        One,
        Two,
        Three,
}
enum Grade{
    A,
    B,
    C,
    D,
    F,
}

fn get_str(s:&str) -> String{
    format!("{}の関数です。",s)
}
fn main() {
    let hello= "Hello_tauri_World";
    println!("{}",hello);
    let mut var2:i32 = 987651;
    var2  = 54321;
    println!("variable2={}",var2);
    let mut array1:[u32;4] = [0,1,2,3];
    array1[2] = 12;
    println!("array1[2]={}",array1[2]);
    let tup1 = (1,"A","B");
    println!("tup1.2 = {}",tup1.2);
    let mut tup2 = ("X",2);
    tup2.1 = 20;
    println!("tup2.0 = {}",tup2.0);
    if 1 < 2 {
        println!("1は2より小さい");
    }
    let i = 3;
    if i < 1 {
        println!("{}は1より小さい",i);
    }
    else if i < 2{
        println!("{}は2より小さい",i);
    }
    else{
        println!("{}は2より大きい",i);
    }
    for n in 1..4 {
        println!("{}回目",n);
    }

    let et = EnumTypo::Two;
    match et {
        EnumTypo::One => println!("Enumtypo::One"),
        EnumTypo::Two => println!("Enumtypo::Two"),
        _ => println!("Enumtypo::Three"),
    }
    let s = get_str("文字取得");
        println!("{}",s);
    let a = Grade::A;
    match a {
        Grade::A => println!("合格"),
        Grade::B => println!("合格"),
        _ => println!("不合格"),
    }
}
