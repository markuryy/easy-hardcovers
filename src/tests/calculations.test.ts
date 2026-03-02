import { describe, it, expect } from 'vitest';
import {
	calculateBoardW,
	calculateBoardH,
	calculateSpineW,
	calculateGutter,
	calculateFabricW,
	calculateFabricH,
	calculateCutOffset,
	computeAll
} from '$lib/calculations.js';

describe('individual calculation functions', () => {
	it('calculates board width', () => {
		expect(calculateBoardW(108, 4, 3)).toBe(109);
	});

	it('calculates board height', () => {
		expect(calculateBoardH(140, 3)).toBe(146);
	});

	it('calculates spine width', () => {
		expect(calculateSpineW(4, 2.5)).toBe(9);
	});

	it('calculates gutter', () => {
		expect(calculateGutter(4, 2.5)).toBe(4.5);
	});

	it('calculates fabric width', () => {
		expect(calculateFabricW(109, 9, 4.5, 20)).toBe(276);
	});

	it('calculates fabric height', () => {
		expect(calculateFabricH(146, 20)).toBe(186);
	});

	it('calculates cut offset', () => {
		const co = calculateCutOffset(20, 2.5);
		expect(co).toBeCloseTo(2 * 20 - 2.5 * Math.sqrt(2), 10);
	});
});

describe('computeAll with default inputs', () => {
	const dims = computeAll({
		pageWidth: 108,
		pageHeight: 140,
		blockThickness: 4,
		boardThickness: 2.5,
		coverMargin: 3,
		fabricMargin: 20
	});

	it('returns correct board dimensions', () => {
		expect(dims.boardW).toBe(109);
		expect(dims.boardH).toBe(146);
	});

	it('returns correct spine width', () => {
		expect(dims.spineW).toBe(9);
	});

	it('returns correct gutter', () => {
		expect(dims.gutter).toBe(4.5);
	});

	it('returns correct fabric dimensions', () => {
		expect(dims.fabricW).toBe(276);
		expect(dims.fabricH).toBe(186);
	});

	it('passes through input values', () => {
		expect(dims.pageW).toBe(108);
		expect(dims.pageH).toBe(140);
		expect(dims.blockT).toBe(4);
		expect(dims.boardT).toBe(2.5);
		expect(dims.coverMargin).toBe(3);
		expect(dims.fabricMargin).toBe(20);
	});
});

describe('computeAll with varied inputs', () => {
	it('handles small page block', () => {
		const dims = computeAll({
			pageWidth: 80,
			pageHeight: 100,
			blockThickness: 2,
			boardThickness: 2,
			coverMargin: 3,
			fabricMargin: 15
		});
		expect(dims.boardW).toBe(82);
		expect(dims.boardH).toBe(106);
		expect(dims.spineW).toBe(6);
		expect(dims.gutter).toBe(3);
		expect(dims.fabricW).toBe(206);
		expect(dims.fabricH).toBe(136);
	});

	it('handles thick block', () => {
		const dims = computeAll({
			pageWidth: 150,
			pageHeight: 200,
			blockThickness: 10,
			boardThickness: 3,
			coverMargin: 5,
			fabricMargin: 25
		});
		expect(dims.boardW).toBe(150);
		expect(dims.boardH).toBe(210);
		expect(dims.spineW).toBe(16);
		expect(dims.gutter).toBe(8);
		expect(dims.fabricW).toBe(382);
		expect(dims.fabricH).toBe(260);
	});
});
