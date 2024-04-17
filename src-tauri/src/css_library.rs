use crate::manage_file;

use manage_file::read_file;
use std::fs::File;
use std::io::Read;
use std::io::{Cursor, Write};
use std::path::Path;

async fn update_file() -> core::result::Result<String, reqwest::Error> {
  let url = "https://raw.githubusercontent.com/rusnakdima/All_In_One_Toolkit_Tauri/master/css_library.json";

  let (file_path, _content) = read_file("css_library.json".to_string()).unwrap();

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
pub async fn update_library() -> String {
  let result = update_file().await.unwrap();
  format!("{}", result)
}

#[tauri::command]
pub async fn get_css_library() -> String {
  let (_file_path, context) = read_file("css_library.json".to_string()).unwrap();
  format!("{}", context)
}