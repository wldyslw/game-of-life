import { range } from './util';
import { CELL_SIZE, ALIVE_COLOR, DEAD_COLOR, GRID_COLOR } from './constants';
import FPSCounter from './FPSCounter';

/* types */
import { Universe } from 'pkg/game_of_life.d.ts';

(async function () {
    const { Universe, Cell } = await import('pkg/game_of_life');
    const { memory } = await import('pkg/game_of_life_bg.wasm');

    class UniverseRenderer {
        private universe: Universe;
        private canvasCtx: CanvasRenderingContext2D;
        private fps: FPSCounter;

        constructor(canvasId: string, height = 64, width = 64, fpsContainerId: string = 'fps') {
            this.universe = new Universe(height, width);

            const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            canvas.height = (CELL_SIZE + 1) * this.universe.height + 1;
            canvas.width = (CELL_SIZE + 1) * this.universe.width + 1;
            this.canvasCtx = canvas.getContext('2d');

            this.fps = new FPSCounter(fpsContainerId);
        }

        private getIndex(row: number, column: number): number {
            return row * this.universe.width + column;
        }

        private getUniverseArrayFromMemory(ptr: number) {
            return new Uint8Array(memory.buffer, ptr, this.universe.width * this.universe.height);
        }

        private drawGrid() {
            const { canvasCtx: ctx } = this;

            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;

            for (const i of range(this.universe.width)) {
                ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
                ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * this.universe.height + 1);
            }

            for (const j of range(this.universe.height)) {
                ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
                ctx.lineTo((CELL_SIZE + 1) * this.universe.width + 1, j * (CELL_SIZE + 1) + 1);
            }

            ctx.stroke();
        }

        private drawCells(deltaPtr?: number) {
            const cells = this.getUniverseArrayFromMemory(this.universe.cells);
            let delta = null;
            if (deltaPtr) {
                delta = this.getUniverseArrayFromMemory(deltaPtr);
            }

            const { canvasCtx: ctx } = this;

            ctx.beginPath();

            for (const row of range(this.universe.height)) {
                for (const col of range(this.universe.width)) {
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

        private renderLoop() {
            this.fps.start();
            this.drawCells(this.universe.tick());
            this.fps.end();

            requestAnimationFrame(this.renderLoop.bind(this));
        }

        render() {
            this.drawGrid();
            this.drawCells();
            requestAnimationFrame(this.renderLoop.bind(this));
        }
    }

    const renderer = new UniverseRenderer('canvas', 180, 320);
    renderer.render();
})();
