use tauri::State;

use crate::error::AppResult;
use crate::state::AppState;
use crate::storage::environments;
use crate::storage::models::Environment;

#[tauri::command]
pub fn list_environments(state: State<'_, AppState>) -> AppResult<Vec<Environment>> {
    state.with_db(environments::list)
}

#[tauri::command]
pub fn save_environment(state: State<'_, AppState>, environment: Environment) -> AppResult<()> {
    state.with_db(|conn| environments::save(conn, &environment))
}

#[tauri::command]
pub fn delete_environment(state: State<'_, AppState>, id: String) -> AppResult<()> {
    state.with_db(|conn| environments::delete(conn, &id))
}
