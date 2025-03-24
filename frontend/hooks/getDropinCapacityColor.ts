export function getDropinCapacityTextColor(active: number, capacity: number) {
    const percentage = active / capacity;

    if(percentage <= 1/3) {
        return '#00a20d';
    } else if(percentage <= 2/3) {
        return '#f4a100';
    } else {
        return '#c41e3a';
    }
}