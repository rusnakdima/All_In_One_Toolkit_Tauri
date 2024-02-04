// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate chrono;

use chrono::Local;
use tauri::api::dialog::FileDialogBuilder;
use std::fs::File;
use std::io::{Cursor, Write};
use std::path::PathBuf;
use tauri::api::path;
use rust_xlsxwriter::Workbook;
use calamine::{open_workbook, Reader, Xlsx};
use tauri::{Manager, Window};

fn get_current_date() -> String {
    let current_datetime = Local::now();

    format!("{}", current_datetime.format("%Y_%m_%d_%H_%M_%S"))
}

fn write_data(name: String, data: String, extension: String) -> String {
    let name_file: String = format!("{}_{}{}", name, get_current_date(), extension);
    let document_folder = path::document_dir().expect("Failed to get document folder");
    let app_folder = document_folder.join("AllInOneToolkit");
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
    let file_path = app_folder.join(&name_file);
    let mut data_file = File::create(&file_path).expect("creation failed");
    data_file.write(data.as_bytes()).expect("write failed");
    println!("Created a file {}", file_path.display());
    format!("{}", file_path.display())
}

#[tauri::command]
fn json_to_xml(name: String, data: String) -> String {
    format!("{}", write_data(name, data, ".xml".to_string()))
}

#[tauri::command]
fn xml_to_json(name: String, data: String) -> String {
    format!("{}", write_data(name, data, ".json".to_string()))
}

#[tauri::command]
fn xls_to_json(name: String, data: String) -> String {
    format!("{}", write_data(name, data, ".json".to_string()))
}

#[tauri::command]
fn xls_to_xml(name: String, data: String) -> String {
    format!("{}", write_data(name, data, ".xml".to_string()))
}

#[tauri::command]
fn open_file(path: String) -> String {
    if let Err(err) = opener::open(path) {
        eprintln!("Failed to open file: {}", err);
    }
    format!("")
}

struct ExcelData {
    rows: Vec<Vec<String>>,
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    data_xls: String,
    file_path: String
}

fn read_xls(path: PathBuf, window: Window) -> Result<(), std::io::Error> {
    let mut workbook: Xlsx<_> = open_workbook(&path).expect("Cannot open file");
    let sheet_name = &workbook.sheet_names()[0];
    let mut excel_data = ExcelData { rows: Vec::new() };
    if let Ok(sheet) = workbook.worksheet_range(&sheet_name) {
        for row in sheet.rows() {
            let row_data: Vec<String> = row.iter().map(|cell| format!("{}", cell)).collect();
            excel_data.rows.push(row_data);
        }
        let file_path: String = path.clone().as_path().display().to_string();
        let _ = window.emit("data_xls", Payload { data_xls: serde_json::to_string(&excel_data.rows).unwrap(), file_path: file_path });
    } else {
        eprintln!("Failed read file xls!");
    }
    Ok(())
}

fn open_dialog_window(window: Window) -> Result<(), std::io::Error> {
    FileDialogBuilder::default()
    .add_filter("Excel Files", &[&"xls", &"xlsx", &"xlsm"])
    .pick_file(|path_buf| match path_buf {
        Some(p) => {
            let _ = read_xls(p, window);
        },
        _ => {}
    });
    
    Ok(())
}

#[tauri::command]
fn open_xls(window: Window) -> String {
    let _ = open_dialog_window(window).unwrap();
    format!("")
}

fn parse_str(str: String) -> core::result::Result<Vec<Vec<String>>, serde_json::Error>{
    let result: Vec<Vec<String>> = serde_json::from_str(&str)?;
    Ok(result)
}

fn save_xlsx(data: String, name_file: String) -> core::result::Result<(), serde_json::Error> {
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();
    if let Ok(arr_data) = parse_str(data) {
        for (row_index, row) in arr_data.iter().enumerate() {
            for (col_index, cell_value) in row.iter().enumerate() {
                worksheet.write_string(row_index as u32, col_index as u16, cell_value).unwrap();
            }
        }
    } else {
        eprintln!("Failed to parse JSON");
    }
    let _ = workbook.save(name_file);
    Ok(())
}

#[tauri::command]
fn json_to_xls(name: String, data: String) -> String {
    let name_file: String = format!("{}_{}{}", name, get_current_date(), ".xlsx");
    let document_folder = path::document_dir().expect("Failed to get document folder");
    let app_folder = document_folder.join("AllInOneToolkit");
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
    let file_path = app_folder.join(&name_file);
    let file_path_str = file_path.to_str().unwrap_or_default();
    if let Err(err) = save_xlsx(data, file_path_str.to_string()) {
        eprintln!("Failed to save the Excel file: {:?}", err);
    } else {
        println!("Created a file {}", file_path.display());
    }
    format!("{}", file_path.display())
}

#[tauri::command]
fn xml_to_xls(name: String, data: String) -> String {
    let name_file: String = format!("{}_{}{}", name, get_current_date(), ".xlsx");
    let document_folder = path::document_dir().expect("Failed to get document folder");
    let app_folder = document_folder.join("AllInOneToolkit");
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
    let file_path = app_folder.join(&name_file);
    let file_path_str = file_path.to_str().unwrap_or_default();
    if let Err(err) = save_xlsx(data, file_path_str.to_string()) {
        eprintln!("Failed to save the Excel file: {:?}", err);
    } else {
        println!("Created a file {}", file_path.display());
    }
    format!("{}", file_path.display())
}

async fn req_site(url: String, key: String) -> core::result::Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let response = client.get(url).header("x-apikey", key).send().await?;
    let json = response.text().await.unwrap();
    Ok(json)
}

#[tauri::command]
async fn virus_total(url: String, key: String) -> String {
    let data = req_site(url, key).await.unwrap();
    format!("{}", data)
}

#[tauri::command]
async fn get_json() -> String {
    let document_folder = path::document_dir().expect("Failed to get document folder");
    let app_folder = document_folder.join("AllInOneToolkit");
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
    let file_path = app_folder.join("css_library.json");
    let file_path_str = file_path.to_str().unwrap_or_default();
    let data = std::fs::read_to_string(file_path_str.to_string()).unwrap();
    format!("{}", data)
}

async fn download_file(url: String, file_name: String) -> core::result::Result<(), reqwest::Error> {
    let response = reqwest::get(url).await?;
    let download_folder = path::download_dir().expect("Failed to get download folder");
    let file_path = download_folder.join(&file_name);
    let mut file = File::create(file_path).expect("failed to create file");
    let mut content = Cursor::new(response.bytes().await?);
    // std::io::copy(&mut content, &mut file)?;
    std::io::copy(&mut content, &mut file).expect("failed to copy content to file");
    Ok(())
}

#[tauri::command]
async fn download_update(url: String, file_name: String) -> String {
    let _ = download_file(url, file_name).await;
    format!("")
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let _ = app.get_window("main").unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![json_to_xml, xml_to_json, xls_to_json, xls_to_xml, json_to_xls, xml_to_xls, virus_total, get_json, open_file, open_xls, download_update])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
