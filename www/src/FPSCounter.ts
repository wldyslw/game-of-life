class FPSCounter {
    private now: number = performance.now();
    private latestValues: Array<number> = [];
    private container: HTMLElement;
    private options: FPSOptions;

    currentFPS: number = 0;
    averageFPS: number = 0;

    constructor(containerId: string, options: FPSOptions = { latestValuesLength: 60, formatter: '{a}' }) {
        this.container = document.getElementById(containerId);
        this.options = options;
    }

    start() {
        this.now = performance.now();
    }

    end() {
        this.currentFPS = (1 / (performance.now() - this.now)) * 1000;
        this.now = performance.now();

        this.latestValues = this.latestValues.slice(-this.options.latestValuesLength);
        this.latestValues.push(this.currentFPS);

        this.averageFPS = this.latestValues.reduce((acc, v) => acc + v, 0) / this.latestValues.length;

        if (!!this.container) {
            this.render();
        }
    }

    private render() {
        const value = this.options.formatter
            .replace('{c}', Math.round(this.currentFPS).toString())
            .replace('{n}', this.options.latestValuesLength.toString())
            .replace('{a}', Math.round(this.averageFPS).toString());

        if (value !== this.container.innerText) {
            this.container.innerText = value;
        }
    }
}

export default FPSCounter;
