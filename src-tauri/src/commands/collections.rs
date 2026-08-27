use tauri::State;

use crate::error::AppResult;
use crate::state::AppState;
use crate::storage::collections;
use crate::storage::models::{Collection, RequestDraft};

#[tauri::command]
pub fn list_collections(state: State<'_, AppState>) -> AppResult<Vec<Collection>> {
    state.with_db(collections::list)
}

#[tauri::command]
pub fn save_collection(state: State<'_, AppState>, collection: Collection) -> AppResult<()> {
    state.with_db(|conn| collections::save(conn, &collection))
}

#[tauri::command]
pub fn delete_collection(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state.with_db(|conn| collections::delete(conn, &id))
}

#[tauri::command]
pub fn list_requests(state: State<'_, AppState>) -> AppResult<Vec<RequestDraft>> {
    state.with_db(collections::list_requests)
}

#[tauri::command]
pub fn save_request(state: State<'_, AppState>, request: RequestDraft) -> AppResult<()> {
    state.with_db(|conn| collections::save_request(conn, &request))
}

#[tauri::command]
pub fn delete_request(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state.with_db(|conn| collections::delete_request(conn, &id))
}
