// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::Write;
use rand::Rng;
use rust_xlsxwriter::Workbook;

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

#[tauri::command]
fn xls_to_json(data: String) -> String{
    let name_file: String = format!("{}{}", generate_name(), ".json");
    let mut data_file = File::create(&name_file).expect("creation failed");
    data_file.write(data.as_bytes()).expect("write failed");
    println!("Created a file {}", name_file);
    format!("{name_file}")
}

fn parse_str(str: String) -> Result<Vec<Vec<String>>, serde_json::Error>{
    let result: Vec<Vec<String>> = serde_json::from_str(&str)?;
    Ok(result)
}

fn save_xlsx(data: String, name_file: String) -> Result<(), serde_json::Error> {
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
fn json_to_xls(data: String) -> String{
    let name_file: String = format!("{}{}", generate_name(), ".xlsx");
    if let Err(err) = save_xlsx(data, name_file.clone()) {
        eprintln!("Failed to save the Excel file: {:?}", err);
    }
    
    format!("{}", name_file)
}

async fn req_site(url: String, key: String) -> Result<String, reqwest::Error> {
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![json_to_xml, xml_to_json, xls_to_json, json_to_xls, virus_total])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
