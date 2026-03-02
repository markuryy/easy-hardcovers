import type { Dimensions } from './types.js';

function downloadFile(content: string | Uint8Array, filename: string, mimeType: string): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function exportFabricSVG(dims: Dimensions): void {
	const { boardT, fabricMargin, fabricW: W, fabricH: H } = dims;
	const co = 2 * fabricMargin - boardT * Math.sqrt(2);
	const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W.toFixed(2)}mm" height="${H.toFixed(2)}mm" viewBox="0 0 ${W.toFixed(4)} ${H.toFixed(4)}">
  <path d="M ${co.toFixed(4)} 0 L ${(W - co).toFixed(4)} 0 L ${W.toFixed(4)} ${co.toFixed(4)} L ${W.toFixed(4)} ${(H - co).toFixed(4)} L ${(W - co).toFixed(4)} ${H.toFixed(4)} L ${co.toFixed(4)} ${H.toFixed(4)} L 0 ${(H - co).toFixed(4)} L 0 ${co.toFixed(4)} Z" fill="none" stroke="#000000" stroke-width="0.01"/>
</svg>`;
	downloadFile(svg, `fabric_${W.toFixed(1)}x${H.toFixed(1)}mm.svg`, 'image/svg+xml');
}

export function exportCoverPanelsSVG(dims: Dimensions, solid: boolean): void {
	const { boardW, boardH: H, spineW, gutter } = dims;
	const totalW = 2 * boardW + spineW + 2 * gutter;
	const spineX = boardW + gutter;
	const rightX = boardW + gutter + spineW + gutter;
	const rectStyle = solid
		? 'fill="#000000" stroke="none"'
		: 'fill="none" stroke="#000000" stroke-width="0.01"';
	const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalW.toFixed(2)}mm" height="${H.toFixed(2)}mm" viewBox="0 0 ${totalW.toFixed(4)} ${H.toFixed(4)}">
  <rect x="0" y="0" width="${boardW.toFixed(4)}" height="${H.toFixed(4)}" ${rectStyle}/>
  <rect x="${spineX.toFixed(4)}" y="0" width="${spineW.toFixed(4)}" height="${H.toFixed(4)}" ${rectStyle}/>
  <rect x="${rightX.toFixed(4)}" y="0" width="${boardW.toFixed(4)}" height="${H.toFixed(4)}" ${rectStyle}/>
</svg>`;
	downloadFile(svg, `cover_panels_${totalW.toFixed(1)}x${H.toFixed(1)}mm.svg`, 'image/svg+xml');
}

export async function exportReferencePDF(dims: Dimensions): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const { pageW, pageH, blockT, boardW, boardH, boardT, spineW, gutter, fabricMargin, fabricW, fabricH, coverMargin } = dims;

	const landscape = fabricW > fabricH;
	const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: landscape ? 'landscape' : 'portrait' });
	const pw = doc.internal.pageSize.getWidth();
	const ph = doc.internal.pageSize.getHeight();

	const ox = (pw - fabricW) / 2;
	const oy = (ph - fabricH) / 2;

	const co = 2 * fabricMargin - boardT * Math.sqrt(2);
	const bY = oy + fabricMargin;
	const lbX = ox + fabricMargin;
	const rbX = ox + fabricMargin + boardW + gutter + spineW + gutter;
	const spX = ox + fabricMargin + boardW + gutter;
	const plX = ox + fabricMargin + coverMargin;
	const prX = rbX;
	const ptY = oy + fabricMargin + coverMargin;

	doc.setDrawColor(0);
	doc.setLineWidth(0.3);

	const W = fabricW, H = fabricH;
	const pts: [number, number][] = [
		[ox + co, oy], [ox + W - co, oy], [ox + W, oy + co], [ox + W, oy + H - co],
		[ox + W - co, oy + H], [ox + co, oy + H], [ox, oy + H - co], [ox, oy + co]
	];
	for (let i = 0; i < pts.length; i++) {
		const n = pts[(i + 1) % pts.length];
		doc.line(pts[i][0], pts[i][1], n[0], n[1]);
	}

	doc.rect(lbX, bY, boardW, boardH, 'S');
	doc.rect(rbX, bY, boardW, boardH, 'S');
	doc.rect(spX, bY, spineW, boardH, 'S');
	doc.rect(plX, ptY, pageW - blockT / 2, pageH, 'S');
	doc.rect(prX, ptY, pageW - blockT / 2, pageH, 'S');

	doc.save('book-cover-template.pdf');
}
