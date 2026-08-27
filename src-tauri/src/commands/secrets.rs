use crate::error::AppResult;
use crate::secrets;

#[tauri::command]
pub fn read_secret(reference: String) -> AppResult<Option<String>> {
    secrets::read(&reference)
}

#[tauri::command]
pub fn write_secret(reference: String, value: String) -> AppResult<()> {
    secrets::write(&reference, &value)
}

#[tauri::command]
pub fn remove_secret(reference: String) -> AppResult<()> {
    secrets::remove(&reference)
}
