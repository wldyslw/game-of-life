# Under construction

This will eventually become a Game of Life written in Rust + JS and utilizing WebAssembly (it already does).

## How to run (for now)

First, install [Rust toolchain](https://www.rust-lang.org/tools/install):

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

...and [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/):

```sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

Then run:

```sh
npm i
npm start # check localhost:1234
```

Enjoy!
