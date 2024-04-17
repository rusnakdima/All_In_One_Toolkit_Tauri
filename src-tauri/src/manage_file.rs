use chrono::Local;
use tauri::api::dialog::FileDialogBuilder;
use tauri::Window;

use std::path::{Path, PathBuf};
use std::fs::File;
use std::io::Read;
use std::io::Write;
use tauri::api::path;

pub fn read_file(name_file: String) -> Result<(PathBuf, String), std::io::Error> {
  let document_folder = path::document_dir().expect("Failed to get document folder");
  let app_folder = document_folder.join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
  }

  let file_path = app_folder.join(&name_file);
  if !Path::new(&file_path).exists() {
    let mut data_file = File::create(&file_path).expect("Failed to create file");
    data_file.write("{}".as_bytes()).expect("Failed to write data to file");
  }

  let mut file = File::open(&file_path).unwrap();
  let mut content = String::new();
  file.read_to_string(&mut content).unwrap();

  Ok((file_path, content))
}

fn read_file_by_path(file_path: String) -> Result<String, std::io::Error> {
  let mut file = File::open(&file_path).unwrap();
  let mut content = String::new();
  file.read_to_string(&mut content).unwrap();

  Ok(content)
}

fn get_current_date() -> String {
  let current_datetime = Local::now();
  format!("{}", current_datetime.format("%Y_%m_%d_%H_%M_%S"))
}

pub fn create_file(name_file: String, data: String, extension: String) -> Result<String, std::io::Error> {
  let full_name: String = format!("{}_{}.{}", name_file, get_current_date(), extension);

  let document_folder = path::document_dir().expect("Failed to get document folder");
  let app_folder = document_folder.join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
  }

  let file_path = app_folder.join(&full_name);
  let mut data_file = File::create(&file_path).expect("Failed to create file");
  data_file.write(data.as_bytes()).expect("Failed to write data to file");

  Ok(format!("{}", file_path.display()))
}

#[derive(Clone, serde::Serialize)]
struct Payload {
  file_path: String
}

fn send_file_path(file_path: String, window: Window) {
  let _ = window.emit("send_file_path", Payload { file_path: file_path });
}

fn open_dialog_window(window: Window, type_file: &str) -> Result<(), std::io::Error> {
  let mut name_filter: String = String::new();
  let mut list_ext: Vec<&str> = Vec::new();
  if type_file == "xls" {
    name_filter = "Excel Files".to_string();
    list_ext = vec![&"xls", &"xlsx", &"xlsm"];
  } else if type_file == "txt" {
    name_filter = "TXT file".to_string();
    list_ext = vec![&"txt"];
  } else if type_file == "csv" {
    name_filter = "CSV file".to_string();
    list_ext = vec![&"csv"];
  } else if type_file == "xml" {
    name_filter = "XML file".to_string();
    list_ext = vec![&"xml"];
  } else if type_file == "json" {
    name_filter = "JSON file".to_string();
    list_ext = vec![&"json"];
  } else if type_file == "plist" {
    name_filter = "Plist file".to_string();
    list_ext = vec![&"plist"];
  } else if type_file == "md" {
    name_filter = "Markdown file".to_string();
    list_ext = vec![&"md"];
  }
  FileDialogBuilder::default()
  .add_filter(name_filter, &list_ext)
  .pick_file(|path_buf| match path_buf {
    Some(p) => {
      let _ = send_file_path(p.display().to_string(), window);
    },
    _ => {}
  });
  
  Ok(())
}

#[tauri::command]
pub fn get_file_path(window: Window, type_file: &str) -> String {
  let _ = open_dialog_window(window, type_file).unwrap();
  format!("")
}

#[tauri::command]
pub fn get_data_by_path(file_path: String) -> String {
  let data = read_file_by_path(file_path).unwrap();
  format!("{}", data)
}

#[tauri::command]
pub fn open_file_in_app(path: String) -> String {
  if let Err(err) = opener::open(path) {
    eprintln!("Failed to open file: {}", err);
  }
  format!("")
}

#[tauri::command]
pub fn write_data_to_file(name: String, data: String, ext: String) -> String {
  let file_path = create_file(name, data, ext).unwrap_or("Error create file!".to_string());
  format!("{}", file_path)
}