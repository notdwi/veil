mod commands;
mod error;
mod http;
mod secrets;
mod state;
mod storage;

use tauri::Manager;

use state::AppState;

const WORKSPACE_FILE: &str = "workspace.db";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let dir = app.path().app_data_dir()?;
            let state = AppState::new(dir.join(WORKSPACE_FILE))?;
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::http::send_request,
            commands::collections::list_collections,
            commands::collections::save_collection,
            commands::collections::delete_collection,
            commands::collections::list_requests,
            commands::collections::save_request,
            commands::collections::delete_request,
            commands::history::list_history,
            commands::history::push_history,
            commands::history::clear_history,
            commands::environments::list_environments,
            commands::environments::save_environment,
            commands::environments::delete_environment,
            commands::secrets::read_secret,
            commands::secrets::write_secret,
            commands::secrets::remove_secret,
        ])
        .run(tauri::generate_context!())
        .expect("failed to launch VEIL");
}
