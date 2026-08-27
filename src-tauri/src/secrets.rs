use keyring::Entry;

use crate::error::AppResult;

const SERVICE: &str = "VEIL";

fn entry(reference: &str) -> AppResult<Entry> {
    Ok(Entry::new(SERVICE, reference)?)
}

pub fn read(reference: &str) -> AppResult<Option<String>> {
    match entry(reference)?.get_password() {
        Ok(value) => Ok(Some(value)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(err) => Err(err.into()),
    }
}

pub fn write(reference: &str, value: &str) -> AppResult<()> {
    entry(reference)?.set_password(value)?;
    Ok(())
}

pub fn remove(reference: &str) -> AppResult<()> {
    match entry(reference)?.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(err) => Err(err.into()),
    }
}
