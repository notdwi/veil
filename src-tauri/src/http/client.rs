use std::str::FromStr;
use std::time::{Duration, Instant};

use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use reqwest::{Client, Method};

use super::types::{HttpFailure, HttpResponsePayload, SendRequestInput};

const USER_AGENT: &str = concat!("VEIL/", env!("CARGO_PKG_VERSION"));
const MAX_TIMEOUT_MS: u64 = 300_000;

pub fn build_client() -> Client {
    Client::builder()
        .user_agent(USER_AGENT)
        .redirect(reqwest::redirect::Policy::limited(10))
        .pool_idle_timeout(Duration::from_secs(30))
        .build()
        .expect("reqwest client")
}

fn header_map(pairs: &[(String, String)]) -> Result<HeaderMap, String> {
    let mut map = HeaderMap::with_capacity(pairs.len());
    for (key, value) in pairs {
        let name =
            HeaderName::from_str(key.trim()).map_err(|_| format!("invalid header name: {key}"))?;
        let value =
            HeaderValue::from_str(value).map_err(|_| format!("invalid header value for {key}"))?;
        map.append(name, value);
    }
    Ok(map)
}

fn classify(err: &reqwest::Error) -> &'static str {
    if err.is_timeout() {
        "timeout"
    } else if err.is_builder() || err.is_request() && err.url().is_none() {
        "invalid_url"
    } else if err.is_connect() {
        "network"
    } else {
        "unknown"
    }
}

/// Performs the request and always reports elapsed time, success or failure.
pub async fn send(
    client: &Client,
    input: SendRequestInput,
) -> Result<HttpResponsePayload, HttpFailure> {
    let started = Instant::now();
    let elapsed = |start: Instant| start.elapsed().as_millis() as u64;

    let method = Method::from_str(&input.method).map_err(|_| {
        HttpFailure::new(
            "invalid_url",
            format!("unsupported method {}", input.method),
            0,
        )
    })?;

    let url = reqwest::Url::parse(&input.url)
        .map_err(|e| HttpFailure::new("invalid_url", e.to_string(), 0))?;

    let headers = header_map(&input.headers)
        .map_err(|message| HttpFailure::new("invalid_url", message, 0))?;

    let mut builder = client
        .request(method, url)
        .headers(headers)
        .timeout(Duration::from_millis(
            input.timeout_ms.clamp(1_000, MAX_TIMEOUT_MS),
        ));

    if let Some(body) = input.body {
        builder = builder.body(body);
    }

    let response = builder
        .send()
        .await
        .map_err(|e| HttpFailure::new(classify(&e), e.to_string(), elapsed(started)))?;

    let status = response.status();
    let final_url = response.url().to_string();
    let headers = response
        .headers()
        .iter()
        .map(|(k, v)| {
            (
                k.as_str().to_owned(),
                v.to_str().unwrap_or("<binary>").to_owned(),
            )
        })
        .collect();

    let bytes = response
        .bytes()
        .await
        .map_err(|e| HttpFailure::new("network", e.to_string(), elapsed(started)))?;

    Ok(HttpResponsePayload {
        status: status.as_u16(),
        status_text: status.canonical_reason().unwrap_or_default().to_owned(),
        headers,
        size_bytes: bytes.len() as u64,
        body: String::from_utf8_lossy(&bytes).into_owned(),
        duration_ms: elapsed(started),
        final_url,
    })
}
