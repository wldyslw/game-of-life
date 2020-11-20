use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(getter)]
    pub fn width(&self) -> u32 {
        self.width
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> u32 {
        self.height
    }

    #[wasm_bindgen(getter)]
    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;

        for dr in [self.height - 1, 0, 1].iter().cloned() {
            for dc in [self.width - 1, 0, 1].iter().cloned() {
                if dr == 0 && dc == 0 {
                    continue;
                }

                let neighbor_row = (row + dr) % self.height;
                let neighbor_col = (column + dc) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
            }
        }

        count
    }

    pub fn tick(&mut self) -> *const u8 {
        let mut next_universe_state = self.cells.clone();
        let mut cells_delta_map: Vec<u8> = Vec::new();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell_state = match (cell, live_neighbors) {
                    (Cell::Alive, x) if x < 2 => Cell::Dead,
                    (Cell::Alive, x) if x == 2 || x == 3 => Cell::Alive,
                    (Cell::Alive, x) if x > 3 => Cell::Dead,
                    (Cell::Dead, 3) => Cell::Alive,
                    (other, _) => other,
                };

                cells_delta_map.push(if cell == next_cell_state { 0 } else { 1 });

                next_universe_state[idx] = next_cell_state;
            }
        }

        self.cells = next_universe_state;

        cells_delta_map.as_ptr()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(height: u32, width: u32) -> Universe {
        let mut rng = rand::thread_rng();
        let cells = (0..width * height)
            .map(|_| match rng.gen_range(0, 2) {
                0 => Cell::Dead,
                1 => Cell::Alive,
                _ => Cell::Dead,
            })
            .collect();

        Universe {
            width,
            height,
            cells,
        }
    }
}
