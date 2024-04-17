use std::path::Path;

use chrono::Local;
use rust_xlsxwriter::{Workbook, XlsxError};
use calamine::{open_workbook, Reader, Xlsx};
use tauri::api::path;

struct ExcelData {
  rows: Vec<Vec<String>>,
}

fn read_xls(path: String) -> Result<String, std::io::Error> {
  let mut workbook: Xlsx<_> = open_workbook(Path::new(&path)).expect("Cannot open file");
  let sheet_name = &workbook.sheet_names()[0];
  let mut excel_data = ExcelData { rows: Vec::new() };
  if let Ok(sheet) = workbook.worksheet_range(&sheet_name) {
    for row in sheet.rows() {
      let row_data: Vec<String> = row.iter().map(|cell| format!("{}", cell)).collect();
      excel_data.rows.push(row_data);
    }
    return Ok(format!("{}", serde_json::to_string(&excel_data.rows).unwrap()));
  } else {
    eprintln!("Failed read file xls!");
  }
  Ok(format!(""))
}

fn get_current_date() -> String {
  let current_datetime = Local::now();
  format!("{}", current_datetime.format("%Y_%m_%d_%H_%M_%S"))
}

fn create_xls(name: String, data: Vec<Vec<String>>) -> Result<String, XlsxError> {
  let full_name: String = format!("{}_{}.{}", name, get_current_date(), "xlsx");

  let document_folder = path::document_dir().expect("Failed to get document folder");
  let app_folder = document_folder.join("AllInOneToolkit");
  if !Path::new(&app_folder).exists() {
    std::fs::create_dir_all(&app_folder).expect("Failed to create app folder");
  }

  let file_path = app_folder.join(&full_name);

  let mut workbook = Workbook::new();
  let worksheet = workbook.add_worksheet();
  for (row_index, row) in data.iter().enumerate() {
    for (col_index, cell_value) in row.iter().enumerate() {
      worksheet.write_string(row_index as u32, col_index as u16, cell_value).unwrap();
    }
  }

  match workbook.save(file_path.clone().to_str().unwrap()) {
    Ok(_) => {
      Ok(format!("{}", file_path.display()))
    }
    Err(error) => {
      println!("Error: {}", error);
      Err(error)
    }
  }
}

#[tauri::command]
pub fn get_data_by_xls(file_path: String) -> String {
  let data = read_xls(file_path).unwrap();
  format!("{}", data)
}

#[tauri::command]
pub fn write_xls_data_to_file(name: String, data: Vec<Vec<String>>) -> String {
  let file_path = create_xls(name, data).unwrap();
  format!("{}", file_path)
}