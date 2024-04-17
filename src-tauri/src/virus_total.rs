async fn req_site(url: String, key: String) -> core::result::Result<String, reqwest::Error> {
  let client = reqwest::Client::new();
  let response = client.get(url).header("x-apikey", key).send().await?;
  let json = response.text().await.unwrap();
  Ok(json)
}

#[tauri::command]
pub async fn virus_total(url: String, key: String) -> String {
  let data = req_site(url, key).await.unwrap();
  format!("{}", data)
}