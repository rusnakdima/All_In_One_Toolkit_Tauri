// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate chrono;

use chrono::Local;
use tauri::api::dialog::FileDialogBuilder;
use std::fs::File;
use std::io::Read;
use std::io::{Cursor, Write};
use std::path::{Path, PathBuf};
use tauri::api::path;
use rust_xlsxwriter::{Workbook, XlsxError};
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
    let mut data_file = File::create(&file_path).expect("Failed to create file");
    data_file.write(data.as_bytes()).expect("Failed to write data to file");
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

/* All Above writen will be copied */


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

fn open_dialog_window(window: Window, type_file: &str) -> Result<(), std::io::Error> {
    let mut name_filter: String = String::new();
    let mut list_ext: Vec<&str> = Vec::new();
    if type_file == "XLS" {
        name_filter = "Excel Files".to_string();
        list_ext.push(&"xls");
        list_ext.push(&"xlsx");
        list_ext.push(&"xlsm");
    }
    FileDialogBuilder::default()
    .add_filter(name_filter, &list_ext)
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
    let _ = open_dialog_window(window, "XLS").unwrap();
    format!("")
}

fn save_xlsx(arr_data: Vec<Vec<String>>, name_file: String) -> core::result::Result<(), XlsxError>/*  core::result::Result<(), serde_json::Error> */ {
    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();
    for (row_index, row) in arr_data.iter().enumerate() {
        for (col_index, cell_value) in row.iter().enumerate() {
            worksheet.write_string(row_index as u32, col_index as u16, cell_value).unwrap();
        }
    }
    match workbook.save(name_file) {
        Ok(_) => {
            Ok(())
        }
        Err(error) => {
            println!("Error: {}", error);
            Err(error)
        }
    }
}

#[tauri::command]
fn json_to_xls(name: String, data: Vec<Vec<String>>) -> String {
    let name_file: String = format!("{}_{}{}", name, get_current_date(), ".xlsx");
    let document_folder = path::document_dir().expect("Failed to get document folder");
    let app_folder = document_folder.join("AllInOneToolkit");
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
    let file_path = app_folder.join(&name_file);
    let file_path_str = file_path.to_str().unwrap_or_default();
    match save_xlsx(data, file_path_str.to_string()) {
        Ok(()) => {
            println!("Created a file {}", file_path.display());
            format!("{}", file_path.display())
        }
        Err(error) => {
            eprintln!("Failed to save the Excel file! Error: {}", error);
            format!("")
        }
    }
}

#[tauri::command]
fn xml_to_xls(name: String, data: Vec<Vec<String>>) -> String {
    let name_file: String = format!("{}_{}{}", name, get_current_date(), ".xlsx");
    let document_folder = path::document_dir().expect("Failed to get document folder");
    let app_folder = document_folder.join("AllInOneToolkit");
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
    let file_path = app_folder.join(&name_file);
    let file_path_str = file_path.to_str().unwrap_or_default();
    match save_xlsx(data, file_path_str.to_string()) {
        Ok(()) => {
            println!("Created a file {}", file_path.display());
            format!("{}", file_path.display())
        }
        Err(error) => {
            eprintln!("Failed to save the Excel file! Error: {}", error);
            format!("")
        }
    }
}


/* All Below writen will be copied */

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

async fn download_file(url: String, file_name: String) -> core::result::Result<String, Box<dyn std::error::Error>> {
    let response = reqwest::get(url).await?;
    let download_folder = path::download_dir().expect("Failed to get download folder");
    let file_path = download_folder.join(&file_name);
    let mut file = File::create(&file_path).expect("Failed to create file");

    let bytes = response.bytes().await?;
    let _ = file.write_all(&bytes);

    Ok(format!("{}", file_path.display()))
}

#[tauri::command]
async fn download_update(url: String, file_name: String) -> String {
    match download_file(url, file_name).await {
        Ok(path) => {
            format!("{}", path)
        }
        Err(error) => {
            eprintln!("Failed to download file! Error: {}", error);
            format!("Failed to download file! Error: {}", error)
        }
    }
}

async fn update_file() -> core::result::Result<String, reqwest::Error> {
    let url = "https://raw.githubusercontent.com/rusnakdima/All_In_One_Toolkit_Tauri/master/css_library.json";

    let document_folder = path::document_dir().expect("Failed to get document folder");
    let app_folder = document_folder.join("AllInOneToolkit");
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
    let file_path = app_folder.join(&"css_library.json");

    if file_path.exists() {
        let existing_content = read_file_content(&file_path).unwrap();
        let response = reqwest::get(url).await?;
        let mut content = Cursor::new(response.bytes().await?);
        let mut new_content = Vec::new();
        let _ = content.read_to_end(&mut new_content);

        if existing_content != new_content {
            let _ = update_file_content(&file_path, &new_content);
            Ok("The style library has been successfully updated!".to_string())
        } else {
            Ok("".to_string())
        }
    } else {
        let response = reqwest::get(url).await?;
        let mut file = File::create(file_path).expect("Failed to create file");
        let mut content = Cursor::new(response.bytes().await?);
        std::io::copy(&mut content, &mut file).expect("Failed to copy content to file");
        Ok("The style library has been successfully loaded!".to_string())
    }
}

fn read_file_content(file_path: &Path) -> Result<Vec<u8>, std::io::Error> {
    let mut file = File::open(file_path)?;
    let mut content = Vec::new();
    file.read_to_end(&mut content)?;
    Ok(content)
}

fn update_file_content(file_path: &Path, new_content: &[u8]) -> Result<(), std::io::Error> {
    let mut file = File::create(file_path)?;
    file.write_all(new_content)?;
    Ok(())
}


#[tauri::command]
async fn update_library() -> String {
    let result = update_file().await.unwrap();
    format!("{}", result)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let _ = app.get_window("main").unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![json_to_xml, xml_to_json, xls_to_json, xls_to_xml, json_to_xls, xml_to_xls, virus_total, get_json, open_file, open_xls, download_update, update_library])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
