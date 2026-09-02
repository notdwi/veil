use std::path::PathBuf;
use std::sync::Mutex;

use reqwest::Client;
use rusqlite::Connection;

use crate::error::AppResult;
use crate::http::client::build_client;
use crate::storage::db;

pub struct AppState {
    db: Mutex<Connection>,
    pub http: Client,
}

impl AppState {
    pub fn new(workspace: PathBuf) -> AppResult<Self> {
        Ok(Self {
            db: Mutex::new(db::open(&workspace)?),
            http: build_client(),
        })
    }

    /// Runs `f` against the single shared connection. A poisoned lock means a
    /// previous command panicked mid-transaction, so the workspace is suspect.
    pub fn with_db<T>(&self, f: impl FnOnce(&Connection) -> AppResult<T>) -> AppResult<T> {
        let guard = self.lock()?;
        f(&guard)
    }

    /// Same, for operations that need to open a transaction.
    pub fn with_db_mut<T>(&self, f: impl FnOnce(&mut Connection) -> AppResult<T>) -> AppResult<T> {
        let mut guard = self.lock()?;
        f(&mut guard)
    }

    fn lock(&self) -> AppResult<std::sync::MutexGuard<'_, Connection>> {
        self.db
            .lock()
            .map_err(|_| crate::error::AppError::Other("workspace lock poisoned".into()))
    }
}
