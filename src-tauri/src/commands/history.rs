use tauri::State;

use crate::error::AppResult;
use crate::state::AppState;
use crate::storage::history;
use crate::storage::models::HistoryEntry;

#[tauri::command]
pub fn list_history(state: State<'_, AppState>, limit: i64) -> AppResult<Vec<HistoryEntry>> {
    state.with_db(|conn| history::list(conn, limit.clamp(1, 300)))
}

#[tauri::command]
pub fn push_history(state: State<'_, AppState>, entry: HistoryEntry) -> AppResult<()> {
    state.with_db(|conn| history::push(conn, &entry))
}

#[tauri::command]
pub fn clear_history(state: State<'_, AppState>) -> AppResult<()> {
    state.with_db(history::clear)
}
