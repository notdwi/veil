use rusqlite::Connection;
use serde_json::json;

use super::models::{Collection, Environment, HistoryEntry, RequestDraft};
use super::schema::migrate;
use super::{collections, environments, history};

fn workspace() -> Connection {
    let conn = Connection::open_in_memory().unwrap();
    conn.pragma_update(None, "foreign_keys", true).unwrap();
    migrate(&conn).unwrap();
    conn
}

fn collection(id: &str) -> Collection {
    Collection {
        id: id.into(),
        name: format!("{id} name"),
        created_at: 1,
    }
}

fn request(id: &str, collection_id: Option<&str>) -> RequestDraft {
    serde_json::from_value(json!({
        "id": id,
        "collectionId": collection_id,
        "name": "List users",
        "method": "GET",
        "url": "https://api.example.com/users",
        "updatedAt": 42,
        "params": [{ "id": "p1", "key": "page", "value": "1", "enabled": true }],
        "headers": [],
        "bodyMode": "none",
        "body": "",
        "auth": { "mode": "none", "username": "", "password": "", "token": "" }
    }))
    .unwrap()
}

#[test]
fn migrations_are_idempotent() {
    let conn = workspace();
    migrate(&conn).unwrap();
    let version: i64 = conn
        .query_row("PRAGMA user_version", [], |r| r.get(0))
        .unwrap();
    assert_eq!(version, 1);
}

#[test]
fn collection_save_is_an_upsert() {
    let conn = workspace();
    collections::save(&conn, &collection("c1")).unwrap();
    collections::save(
        &conn,
        &Collection {
            name: "Renamed".into(),
            ..collection("c1")
        },
    )
    .unwrap();

    let rows = collections::list(&conn).unwrap();
    assert_eq!(rows.len(), 1);
    assert_eq!(rows[0].name, "Renamed");
}

#[test]
fn request_payload_round_trips_unknown_fields() {
    let conn = workspace();
    collections::save(&conn, &collection("c1")).unwrap();
    collections::save_request(&conn, &request("r1", Some("c1"))).unwrap();

    let rows = collections::list_requests(&conn).unwrap();
    assert_eq!(rows.len(), 1);
    assert_eq!(rows[0].url, "https://api.example.com/users");
    assert_eq!(rows[0].rest["params"][0]["key"], "page");
    assert_eq!(rows[0].rest["auth"]["mode"], "none");
}

#[test]
fn deleting_a_collection_cascades_to_its_requests() {
    let conn = workspace();
    collections::save(&conn, &collection("c1")).unwrap();
    collections::save_request(&conn, &request("r1", Some("c1"))).unwrap();
    collections::save_request(&conn, &request("r2", None)).unwrap();

    collections::delete(&conn, "c1").unwrap();

    let remaining = collections::list_requests(&conn).unwrap();
    assert_eq!(remaining.len(), 1);
    assert_eq!(remaining[0].id, "r2");
}

#[test]
fn history_returns_newest_first_and_respects_the_limit() {
    let conn = workspace();
    for (index, id) in ["h1", "h2", "h3"].iter().enumerate() {
        history::push(
            &conn,
            &HistoryEntry {
                id: (*id).into(),
                method: "GET".into(),
                url: format!("https://api.example.com/{id}"),
                status: Some(200),
                duration_ms: Some(12),
                created_at: index as i64,
                snapshot: json!({ "id": id }),
            },
        )
        .unwrap();
    }

    let rows = history::list(&conn, 2).unwrap();
    assert_eq!(rows.len(), 2);
    assert_eq!(rows[0].id, "h3");
    assert_eq!(rows[1].id, "h2");

    history::clear(&conn).unwrap();
    assert!(history::list(&conn, 10).unwrap().is_empty());
}

#[test]
fn environment_variables_survive_a_round_trip() {
    let conn = workspace();
    let env = Environment {
        id: "e1".into(),
        name: "Development".into(),
        created_at: 7,
        variables: json!([{ "id": "v1", "key": "base_url", "value": "http://localhost", "secret": false, "enabled": true }]),
    };

    environments::save(&conn, &env).unwrap();
    environments::save(
        &conn,
        &Environment {
            name: "Staging".into(),
            ..env.clone()
        },
    )
    .unwrap();

    let rows = environments::list(&conn).unwrap();
    assert_eq!(rows.len(), 1);
    assert_eq!(rows[0].name, "Staging");
    assert_eq!(rows[0].variables[0]["key"], "base_url");

    environments::delete(&conn, "e1").unwrap();
    assert!(environments::list(&conn).unwrap().is_empty());
}
