import type { BookInputs, Dimensions } from './types.js';

export function calculateBoardW(pageW: number, blockT: number, coverMargin: number): number {
	return pageW - 0.5 * blockT + coverMargin;
}

export function calculateBoardH(pageH: number, coverMargin: number): number {
	return pageH + 2 * coverMargin;
}

export function calculateSpineW(blockT: number, boardT: number): number {
	return blockT + 2 * boardT;
}

export function calculateGutter(blockT: number, boardT: number): number {
	return blockT / 2 + boardT;
}

export function calculateFabricW(
	boardW: number,
	spineW: number,
	gutter: number,
	fabricMargin: number
): number {
	return 2 * boardW + spineW + 2 * gutter + 2 * fabricMargin;
}

export function calculateFabricH(boardH: number, fabricMargin: number): number {
	return boardH + 2 * fabricMargin;
}

export function calculateCutOffset(fabricMargin: number, boardT: number): number {
	return 2 * fabricMargin - boardT * Math.sqrt(2);
}

export function computeAll(inputs: BookInputs): Dimensions {
	const { pageWidth: pageW, pageHeight: pageH, blockThickness: blockT, boardThickness: boardT, coverMargin, fabricMargin } = inputs;

	const boardW = calculateBoardW(pageW, blockT, coverMargin);
	const boardH = calculateBoardH(pageH, coverMargin);
	const spineW = calculateSpineW(blockT, boardT);
	const gutter = calculateGutter(blockT, boardT);
	const fabricW = calculateFabricW(boardW, spineW, gutter, fabricMargin);
	const fabricH = calculateFabricH(boardH, fabricMargin);
	const cutOffset = calculateCutOffset(fabricMargin, boardT);

	return { pageW, pageH, blockT, boardT, coverMargin, fabricMargin, boardW, boardH, spineW, gutter, fabricW, fabricH, cutOffset };
}
