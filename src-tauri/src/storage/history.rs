use rusqlite::{params, Connection};

use crate::error::AppResult;

use super::models::HistoryEntry;

/// Rows kept on disk; older runs are trimmed after every insert.
const RETENTION: i64 = 300;

pub fn list(conn: &Connection, limit: i64) -> AppResult<Vec<HistoryEntry>> {
    let mut stmt = conn.prepare(
        "SELECT id, method, url, status, duration_ms, created_at, snapshot
         FROM history ORDER BY created_at DESC LIMIT ?1",
    )?;

    let rows = stmt.query_map(params![limit], |row| {
        Ok((
            row.get::<_, String>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, String>(2)?,
            row.get::<_, Option<i64>>(3)?,
            row.get::<_, Option<i64>>(4)?,
            row.get::<_, i64>(5)?,
            row.get::<_, String>(6)?,
        ))
    })?;

    let mut out = Vec::new();
    for row in rows {
        let (id, method, url, status, duration_ms, created_at, snapshot) = row?;
        out.push(HistoryEntry {
            id,
            method,
            url,
            status,
            duration_ms,
            created_at,
            snapshot: serde_json::from_str(&snapshot)?,
        });
    }
    Ok(out)
}

pub fn push(conn: &Connection, entry: &HistoryEntry) -> AppResult<()> {
    let snapshot = serde_json::to_string(&entry.snapshot)?;
    conn.execute(
        "INSERT OR REPLACE INTO history (id, method, url, status, duration_ms, created_at, snapshot)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            entry.id,
            entry.method,
            entry.url,
            entry.status,
            entry.duration_ms,
            entry.created_at,
            snapshot
        ],
    )?;

    conn.execute(
        "DELETE FROM history WHERE id NOT IN
            (SELECT id FROM history ORDER BY created_at DESC LIMIT ?1)",
        params![RETENTION],
    )?;
    Ok(())
}

pub fn clear(conn: &Connection) -> AppResult<()> {
    conn.execute("DELETE FROM history", [])?;
    Ok(())
}
