// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs;
use dirs;
use tauri::command;

#[command]
fn open_formato() -> Result<(), String> {
    let source_path = if cfg!(debug_assertions) {
        env::current_dir().map_err(|e| e.to_string())?.join("src").join("assets").join("formato.xlsx")
    } else {
        env::current_exe().map_err(|e| e.to_string())?.parent().ok_or("No parent")?.join("assets").join("formato.xlsx")
    };

    let download_path = dirs::download_dir().ok_or("No download directory found")?;
    let dest_path = download_path.join("formato.xlsx");

    fs::copy(&source_path, &dest_path).map_err(|e| format!("Failed to copy file: {}", e))?;

    open::that(dest_path).map_err(|e| format!("Failed to open file: {}", e))?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_formato])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
