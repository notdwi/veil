use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("storage: {0}")]
    Storage(#[from] rusqlite::Error),

    #[error("serialization: {0}")]
    Serde(#[from] serde_json::Error),

    #[error("keystore: {0}")]
    Keystore(String),

    #[error("{0}")]
    Other(String),
}

impl From<keyring::Error> for AppError {
    fn from(value: keyring::Error) -> Self {
        AppError::Keystore(value.to_string())
    }
}

impl AppError {
    fn kind(&self) -> &'static str {
        match self {
            AppError::Storage(_) => "storage",
            AppError::Serde(_) => "serde",
            AppError::Keystore(_) => "keystore",
            AppError::Other(_) => "unknown",
        }
    }
}

/// Commands reject with `{ kind, message }` so the UI can branch on `kind`.
#[derive(Debug, Serialize)]
struct CommandError<'a> {
    kind: &'a str,
    message: String,
}

impl Serialize for AppError {
    fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        CommandError {
            kind: self.kind(),
            message: self.to_string(),
        }
        .serialize(serializer)
    }
}

pub type AppResult<T> = Result<T, AppError>;
