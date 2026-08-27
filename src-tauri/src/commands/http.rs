use tauri::State;

use crate::http::client;
use crate::http::types::{HttpFailure, HttpResponsePayload, SendRequestInput};
use crate::state::AppState;

#[tauri::command]
pub async fn send_request(
    state: State<'_, AppState>,
    input: SendRequestInput,
) -> Result<HttpResponsePayload, HttpFailure> {
    client::send(&state.http, input).await
}
