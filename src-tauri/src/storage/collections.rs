use rusqlite::{params, Connection};

use crate::error::AppResult;

use super::models::{Collection, RequestDraft};

pub fn list(conn: &Connection) -> AppResult<Vec<Collection>> {
    let mut stmt =
        conn.prepare("SELECT id, name, created_at FROM collections ORDER BY created_at")?;
    let rows = stmt.query_map([], |row| {
        Ok(Collection {
            id: row.get(0)?,
            name: row.get(1)?,
            created_at: row.get(2)?,
        })
    })?;
    Ok(rows.collect::<Result<_, _>>()?)
}

pub fn save(conn: &Connection, collection: &Collection) -> AppResult<()> {
    conn.execute(
        "INSERT INTO collections (id, name, created_at) VALUES (?1, ?2, ?3)
         ON CONFLICT(id) DO UPDATE SET name = excluded.name",
        params![collection.id, collection.name, collection.created_at],
    )?;
    Ok(())
}

pub fn delete(conn: &Connection, id: &str) -> AppResult<()> {
    conn.execute("DELETE FROM collections WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn list_requests(conn: &Connection) -> AppResult<Vec<RequestDraft>> {
    let mut stmt = conn.prepare("SELECT payload FROM requests ORDER BY updated_at DESC")?;
    let rows = stmt.query_map([], |row| row.get::<_, String>(0))?;

    let mut out = Vec::new();
    for payload in rows {
        out.push(serde_json::from_str(&payload?)?);
    }
    Ok(out)
}

pub fn save_request(conn: &Connection, request: &RequestDraft) -> AppResult<()> {
    let payload = serde_json::to_string(request)?;
    conn.execute(
        "INSERT INTO requests (id, collection_id, name, method, url, updated_at, payload)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
         ON CONFLICT(id) DO UPDATE SET
            collection_id = excluded.collection_id,
            name          = excluded.name,
            method        = excluded.method,
            url           = excluded.url,
            updated_at    = excluded.updated_at,
            payload       = excluded.payload",
        params![
            request.id,
            request.collection_id,
            request.name,
            request.method,
            request.url,
            request.updated_at,
            payload
        ],
    )?;
    Ok(())
}

pub fn delete_request(conn: &Connection, id: &str) -> AppResult<()> {
    conn.execute("DELETE FROM requests WHERE id = ?1", params![id])?;
    Ok(())
}
