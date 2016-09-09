export function find<T>(arr: T[], pred: (value: T) => boolean) {
    let found: T | undefined;
    arr.some(el => pred(el) ? (found = el, true) : false);
    return found;
}
