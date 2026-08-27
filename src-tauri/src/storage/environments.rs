use rusqlite::{params, Connection};

use crate::error::AppResult;

use super::models::Environment;

pub fn list(conn: &Connection) -> AppResult<Vec<Environment>> {
    let mut stmt = conn
        .prepare("SELECT id, name, created_at, variables FROM environments ORDER BY created_at")?;
    let rows = stmt.query_map([], |row| {
        Ok((
            row.get::<_, String>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, i64>(2)?,
            row.get::<_, String>(3)?,
        ))
    })?;

    let mut out = Vec::new();
    for row in rows {
        let (id, name, created_at, variables) = row?;
        out.push(Environment {
            id,
            name,
            created_at,
            variables: serde_json::from_str(&variables)?,
        });
    }
    Ok(out)
}

pub fn save(conn: &Connection, environment: &Environment) -> AppResult<()> {
    let variables = serde_json::to_string(&environment.variables)?;
    conn.execute(
        "INSERT INTO environments (id, name, created_at, variables) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, variables = excluded.variables",
        params![
            environment.id,
            environment.name,
            environment.created_at,
            variables
        ],
    )?;
    Ok(())
}

pub fn delete(conn: &Connection, id: &str) -> AppResult<()> {
    conn.execute("DELETE FROM environments WHERE id = ?1", params![id])?;
    Ok(())
}
