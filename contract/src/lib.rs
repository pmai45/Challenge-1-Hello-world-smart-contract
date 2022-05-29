use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc};
use near_sdk::collections::LookupMap;

setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Welcome {
    account_names: LookupMap<String, String>,
}

impl Default for Welcome {
    fn default() -> Self {
        Self {
            account_names: LookupMap::new(b"a".to_vec()),
        }
    }
}

#[near_bindgen]
impl Welcome {
    pub fn set_account_name(&mut self, message: String) {
        let account_id = env::signer_account_id();

        env::log(format!("Saving greeting '{}' for account '{}'", message, account_id,).as_bytes());

        self.account_names.insert(&account_id, &message);
    }

    pub fn get_account_name(&self, account_id: String) -> Option<String> {
        match self.account_names.get(&account_id) {
            Some(username) => Some(username),
            None => None,
        }
    }
}