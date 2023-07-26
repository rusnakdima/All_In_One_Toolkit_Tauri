// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// extern crate blob;

// use std::fs::File;

// // use std::fs;
// use std::str::FromStr;
// use blob::Blob;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn count_words(file_url: Blob) /* -> Result<String, String> */ {
//     println!(file_url*);
//     let my_blob: Blob = Blob::from_str(file_url).unwrap();
//     // let file_path = file_url.replace("file://", "");
//     // match fs::read_to_string(&file_path) {
//     //     Ok(file_content) => Ok(file_content),
//     //     Err(error) => Err(error.to_string()),
//     // }
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
