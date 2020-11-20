import { range } from './util';
import { CELL_SIZE, GRID_COLOR, DEAD_COLOR, ALIVE_COLOR } from './constants';

(async function () {
    const { Universe, Cell } = await import('../pkg');
    const { memory } = await import('../pkg/game_of_life_bg.wasm');

    class UniverseRenderer {
        constructor(canvasId, height = 64, width = 64) {
            this.universe = new Universe(height, width);

            const canvas = document.getElementById(canvasId);
            canvas.height = (CELL_SIZE + 1) * this.universe.height + 1;
            canvas.width = (CELL_SIZE + 1) * this.universe.width + 1;
            this.canvasCtx = canvas.getContext('2d');

            this.fps = {
                time: Date.now(),
                latestValues: [],
                container: document.getElementById('fps'),
            };
        }

        /**
         * @private
         * @param {Number} row Cell row index
         * @param {Number} column Cell column index
         * @returns {Number} Index
         */
        getIndex(row, column) {
            return row * this.universe.width + column;
        }

        /**
         * @private
         * @param {Number} ptr u8 array pointer
         */
        getUniverseArrayFromMemory(ptr) {
            return new Uint8Array(memory.buffer, ptr, this.universe.width * this.universe.height);
        }

        /**
         * @private
         */
        drawGrid() {
            const { canvasCtx: ctx } = this;

            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;

            for (const i of range(0, this.universe.width)) {
                ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
                ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * this.universe.height + 1);
            }

            for (const j of range(0, this.universe.height)) {
                ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
                ctx.lineTo((CELL_SIZE + 1) * this.universe.width + 1, j * (CELL_SIZE + 1) + 1);
            }

            ctx.stroke();
        }

        /**
         * @private
         * @param {Number} deltaPtr u8 poiner to delta array
         */
        drawCells(deltaPtr) {
            const cells = this.getUniverseArrayFromMemory(this.universe.cells);
            let delta = null;
            if (deltaPtr) {
                delta = this.getUniverseArrayFromMemory(deltaPtr);
            }

            const { canvasCtx: ctx } = this;

            ctx.beginPath();

            for (const row of range(0, this.universe.height)) {
                for (const col of range(0, this.universe.width)) {
                    const idx = this.getIndex(row, col);
                    if (delta?.[idx] === 0) {
                        continue;
                    }
                    ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;
                    ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
                }
            }

            ctx.stroke();
        }

        /**
         * @private
         */
        renderLoop() {
            const currentFps = (1 / (Date.now() - this.fps.time)) * 1000;

            this.fps.latestValues = this.fps.latestValues.slice(-100);
            this.fps.latestValues.push(currentFps);

            const avFps = this.fps.latestValues.reduce((acc, v) => acc + v, 0) / this.fps.latestValues.length;
            this.fps.container.innerText = `${Math.round(currentFps)}, last 100 frames avg: ${Math.round(avFps)}`;
            this.fps.time = Date.now();

            this.drawCells(this.universe.tick());

            requestAnimationFrame(this.renderLoop.bind(this));
        }

        render() {
            this.fps.time = Date.now();

            this.drawGrid();
            this.drawCells();
            requestAnimationFrame(this.renderLoop.bind(this));
        }
    }

    const renderer = new UniverseRenderer('canvas', 180, 320);
    renderer.render();
})();
