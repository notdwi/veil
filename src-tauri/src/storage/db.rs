use std::path::Path;

use rusqlite::Connection;

use crate::error::AppResult;

use super::schema::migrate;

/// Opens the workspace database, enforcing the pragmas the app depends on.
pub fn open(path: &Path) -> AppResult<Connection> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| crate::error::AppError::Other(format!("workspace dir: {e}")))?;
    }

    let conn = Connection::open(path)?;
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.pragma_update(None, "synchronous", "NORMAL")?;
    conn.pragma_update(None, "foreign_keys", true)?;
    migrate(&conn)?;

    Ok(conn)
}
