export function map(mb, Mb, ma, Ma) {
    const M = (Ma - ma) / (Mb - mb);
    const A = ma - M * mb;
    return (n)=>M * n + A;
}
export function hex2(num) {
    return Math.round(num).toString(16).padStart(2, '0');
}
