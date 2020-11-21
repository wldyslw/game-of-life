export function* range(to: number) {
    for (let i = 0; i < to; i++) {
        yield i;
    }
}
