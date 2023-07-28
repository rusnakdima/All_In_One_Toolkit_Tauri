// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::Write;
use rand::Rng;

fn generate_name() -> String {
    let alphabetic = "abcdefghijklmnopqrstuvwxyz";
    let mut name = String::new();
    let mut rng = rand::thread_rng();

    for _ in 0..20 {
        let digit = rng.gen_range(0..alphabetic.len());
        name.push(alphabetic.chars().nth(digit).unwrap());
    }

    name
}

#[tauri::command]
fn json_to_xml(data: String) -> String{
    let name_file: String = format!("{}{}", generate_name(), ".xml");
    let mut data_file = File::create(&name_file).expect("creation failed");
    data_file.write(data.as_bytes()).expect("write failed");
    println!("Created a file {}", name_file);
    format!("{name_file}")
}

#[tauri::command]
fn xml_to_json(data: String) -> String{
    let name_file: String = format!("{}{}", generate_name(), ".json");
    let mut data_file = File::create(&name_file).expect("creation failed");
    data_file.write(data.as_bytes()).expect("write failed");
    println!("Created a file {}", name_file);
    format!("{name_file}")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![json_to_xml, xml_to_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
