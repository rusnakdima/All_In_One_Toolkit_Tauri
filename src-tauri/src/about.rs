use std::fs::File;
use std::io::Write;
use tauri::api::path;

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
pub async fn download_update(url: String, file_name: String) -> String {
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

#[tauri::command]
pub async fn get_binary_name_file() -> String {
  if cfg!(target_os = "linux") {
    format!("all_in_one_toolkit")
  } else if cfg!(target_os = "windows") {
    format!("all_in_one_toolkit.exe")
  } else if cfg!(target_os = "macos") {
    format!("all_in_one_toolkit.app")
  } else {
    format!("Unknown")
  }
}