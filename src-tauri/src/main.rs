// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod manage_file;
mod about;
mod css_library;
mod virus_total;
mod manage_xls;

use manage_file::get_file_path;
use manage_file::get_data_by_path;
use manage_file::open_file_in_app;
use manage_file::write_data_to_file;
use about::download_update;
use css_library::update_library;
use css_library::get_css_library;
use virus_total::virus_total;
use manage_xls::get_data_by_xls;
use manage_xls::write_xls_data_to_file;

fn main() {
	tauri::Builder::default()
    // .setup(|app| {
		// 	let _ = app.get_window("main").unwrap();
		// 	Ok(())
    // })
		.invoke_handler(tauri::generate_handler![
			get_file_path,
			get_data_by_path,
			open_file_in_app,
			write_data_to_file,
			download_update,
			update_library,
			get_css_library,
			virus_total,
			get_data_by_xls,
			write_xls_data_to_file,
		])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
