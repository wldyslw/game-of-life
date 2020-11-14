use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(name: &str) {
    use web_sys::console;

    let string = format!("Hello, dear {}!", name);

    console::log_1(&string.into());
}