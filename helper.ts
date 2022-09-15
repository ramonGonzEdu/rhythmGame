export function map(mb: number, Mb: number, ma: number, Ma: number) {
	const M = (Ma - ma) / (Mb - mb);
	const A = ma - M * mb;
	return (n: number) => M * n + A;
}

export function hex2(num: number) {
	return Math.round(num).toString(16).padStart(2, '0');
}
