use rusqlite::Connection;

use crate::error::AppResult;

const MIGRATIONS: &[&str] = &[
    // v1 — initial workspace schema
    r#"
    CREATE TABLE IF NOT EXISTS collections (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        created_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS requests (
        id            TEXT PRIMARY KEY,
        collection_id TEXT REFERENCES collections(id) ON DELETE CASCADE,
        name          TEXT NOT NULL,
        method        TEXT NOT NULL,
        url           TEXT NOT NULL,
        updated_at    INTEGER NOT NULL,
        payload       TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_requests_collection ON requests(collection_id);

    CREATE TABLE IF NOT EXISTS history (
        id          TEXT PRIMARY KEY,
        method      TEXT NOT NULL,
        url         TEXT NOT NULL,
        status      INTEGER,
        duration_ms INTEGER,
        created_at  INTEGER NOT NULL,
        snapshot    TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_history_created ON history(created_at DESC);

    CREATE TABLE IF NOT EXISTS environments (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        variables  TEXT NOT NULL
    );
    "#,
];

/// Applies every migration above the stored `user_version`, in order.
pub fn migrate(conn: &Connection) -> AppResult<()> {
    let current: i64 = conn.query_row("PRAGMA user_version", [], |row| row.get(0))?;

    for (index, sql) in MIGRATIONS.iter().enumerate() {
        let version = index as i64 + 1;
        if version <= current {
            continue;
        }
        conn.execute_batch(sql)?;
        conn.pragma_update(None, "user_version", version)?;
    }

    Ok(())
}
