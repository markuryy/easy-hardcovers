<script lang="ts">
	import type { Dimensions } from '$lib/types.js';

	let { dims }: { dims: Dimensions } = $props();

	let cutOffset = $derived(2 * dims.fabricMargin - dims.boardT * Math.sqrt(2));
	let leftBoardX = $derived(dims.fabricMargin);
	let rightBoardX = $derived(dims.fabricMargin + dims.boardW + dims.gutter + dims.spineW + dims.gutter);
	let spineX = $derived(dims.fabricMargin + dims.boardW + dims.gutter);
	let pageLeftX = $derived(dims.fabricMargin + dims.coverMargin);
	let pageRightX = $derived(rightBoardX);
	let pageTopY = $derived(dims.fabricMargin + dims.coverMargin);
	let valid = $derived(dims.fabricW > 0 && dims.fabricH > 0);
</script>

{#if valid}
<svg viewBox="-60 -40 {dims.fabricW + 120} {dims.fabricH + 80}" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
	<defs>
		<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
			<path d="M 0 0 L 10 5 L 0 10 z"/>
		</marker>
	</defs>

	<!-- Fabric outline (red octagon) -->
	<path
		d="M {cutOffset} 0 L {dims.fabricW - cutOffset} 0 L {dims.fabricW} {cutOffset} L {dims.fabricW} {dims.fabricH - cutOffset} L {dims.fabricW - cutOffset} {dims.fabricH} L {cutOffset} {dims.fabricH} L 0 {dims.fabricH - cutOffset} L 0 {cutOffset} Z"
		fill="#f4a9a8" stroke="#dc2626" stroke-width="1.5"
	/>

	<!-- Cover boards (green) -->
	<rect x={leftBoardX} y={dims.fabricMargin} width={dims.boardW} height={dims.boardH} rx="2" ry="2" fill="none" stroke="#22c55e" stroke-width="1.5"/>
	<rect x={rightBoardX} y={dims.fabricMargin} width={dims.boardW} height={dims.boardH} rx="2" ry="2" fill="none" stroke="#22c55e" stroke-width="1.5"/>

	<!-- Spine fill + outline -->
	<rect x={spineX + dims.boardT} y={dims.fabricMargin + dims.coverMargin} width={dims.spineW - 2 * dims.boardT} height={dims.boardH - 2 * dims.coverMargin} fill="#fef3c7"/>
	<rect x={spineX} y={dims.fabricMargin} width={dims.spineW} height={dims.boardH} fill="none" stroke="#eab308" stroke-width="1.5"/>

	<!-- Page blocks (light blue) -->
	<rect x={pageLeftX} y={pageTopY} width={dims.pageW - dims.blockT / 2} height={dims.pageH} fill="#93c5fd"/>
	<rect x={pageRightX} y={pageTopY} width={dims.pageW - dims.blockT / 2} height={dims.pageH} fill="#93c5fd"/>

	<!-- Page dimension arrows (blue) -->
	<g fill="#1d4ed8" stroke="#1d4ed8">
		<!-- Page height -->
		<line x1={pageLeftX + dims.pageW / 2} y1={pageTopY} x2={pageLeftX + dims.pageW / 2} y2={pageTopY + dims.pageH} marker-start="url(#arrow)" marker-end="url(#arrow)"/>
		<text x={pageLeftX + dims.pageW / 2 + 10} y={pageTopY + dims.pageH / 2} style="font:500 12px 'Inter',sans-serif;text-anchor:middle;stroke:none" fill="#1d4ed8" stroke="none" transform="rotate(-90, {pageLeftX + dims.pageW / 2}, {pageTopY + dims.pageH / 2})">h</text>

		<!-- Page width -->
		<line x1={pageRightX} y1={pageTopY + dims.pageH / 2} x2={pageRightX + dims.pageW} y2={pageTopY + dims.pageH / 2} marker-start="url(#arrow)" marker-end="url(#arrow)"/>
		<text x={pageRightX + dims.pageW / 2} y={pageTopY + dims.pageH / 2 - 8} style="font:500 12px 'Inter',sans-serif;text-anchor:middle;stroke:none" fill="#1d4ed8" stroke="none">w</text>
	</g>

	<!-- Margin annotations (orange) -->
	<g fill="#16a34a" stroke="#16a34a">
		<line x1={-5} y1={dims.fabricMargin + dims.boardH / 2} x2={leftBoardX} y2={dims.fabricMargin + dims.boardH / 2} marker-end="url(#arrow)"/>
		<text x="-20" y={dims.fabricMargin + dims.boardH / 2 + 4} style="font:400 10px 'Inter',sans-serif;text-anchor:middle;stroke:none" fill="#16a34a" stroke="none">
			cover<tspan x="-20" dy="1.2em">margin</tspan>
		</text>

		<line x1={dims.fabricW - dims.fabricMargin - dims.boardW / 2} y1={dims.fabricMargin + dims.boardH + 5} x2={dims.fabricW - dims.fabricMargin - dims.boardW / 2} y2={dims.fabricH} marker-end="url(#arrow)"/>
		<text x={dims.fabricW - dims.fabricMargin - dims.boardW / 2} y={dims.fabricH + 15} style="font:400 10px 'Inter',sans-serif;text-anchor:middle;stroke:none" fill="#16a34a" stroke="none">fabric margin</text>
	</g>

	<!-- Calculated dimensions (orange) -->
	<g fill="#ea580c" stroke="#ea580c">
		<!-- Gutter -->
		<line x1={dims.fabricMargin + dims.boardW} y1={dims.fabricMargin + dims.boardH + 5} x2={dims.fabricMargin + dims.boardW + dims.gutter} y2={dims.fabricMargin + dims.boardH + 5} marker-start="url(#arrow)" marker-end="url(#arrow)"/>
		<text x={dims.fabricMargin + dims.boardW + dims.gutter / 2} y={dims.fabricMargin + dims.boardH + 18} style="font:500 12px 'Inter',sans-serif;text-anchor:middle;stroke:none" fill="#ea580c" stroke="none">g</text>

		<!-- Spine width -->
		<line x1={spineX} y1={dims.fabricMargin + dims.boardH / 2} x2={spineX + dims.spineW} y2={dims.fabricMargin + dims.boardH / 2} marker-start="url(#arrow)" marker-end="url(#arrow)"/>
		<text x={spineX + dims.spineW / 2} y={dims.fabricMargin + dims.boardH / 2 - 8} style="font:500 12px 'Inter',sans-serif;text-anchor:middle;stroke:none" fill="#ea580c" stroke="none">s</text>
	</g>

	<!-- Board thickness label (green) -->
	<g fill="#dc2626" stroke="#dc2626">
		<line x1={dims.fabricW - dims.fabricMargin} y1={dims.fabricH - dims.fabricMargin} x2={dims.fabricW - dims.fabricMargin + dims.boardT} y2={dims.fabricH - dims.fabricMargin + dims.boardT}/>
		<text x={dims.fabricW - dims.fabricMargin + dims.boardT + 8} y={dims.fabricH - dims.fabricMargin + dims.boardT + 20} style="font:400 10px 'Inter',sans-serif;text-anchor:start;stroke:none" fill="#dc2626" stroke="none">board th</text>
	</g>
</svg>
{/if}
