use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendRequestInput {
    pub method: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: Option<String>,
    pub timeout_ms: u64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpResponsePayload {
    pub status: u16,
    pub status_text: String,
    pub headers: Vec<(String, String)>,
    pub body: String,
    pub duration_ms: u64,
    pub size_bytes: u64,
    pub final_url: String,
}

/// Transport-level failures. `kind` mirrors the union used by the UI.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpFailure {
    pub kind: &'static str,
    pub message: String,
    pub duration_ms: u64,
}

impl HttpFailure {
    pub fn new(kind: &'static str, message: impl Into<String>, duration_ms: u64) -> Self {
        Self {
            kind,
            message: message.into(),
            duration_ms,
        }
    }
}
