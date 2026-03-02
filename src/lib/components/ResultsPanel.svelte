<script lang="ts">
	import { Separator } from 'bits-ui';
	import type { Dimensions } from '$lib/types.js';

	let { dims }: { dims: Dimensions } = $props();
</script>

<div class="p-4 space-y-3 text-sm">
	<h3 class="text-xs font-medium text-text-muted uppercase tracking-wider">Dimensions</h3>

	<div class="space-y-2">
		<div class="flex justify-between">
			<span class="text-text-secondary">Cover Board</span>
			<span class="text-diagram-board font-medium tabular-nums">{dims.boardW.toFixed(1)} x {dims.boardH.toFixed(1)} mm</span>
		</div>
		<div class="flex justify-between">
			<span class="text-text-secondary">Spine (s)</span>
			<span class="text-diagram-spine font-medium tabular-nums">{dims.spineW.toFixed(1)} mm</span>
		</div>
		<div class="flex justify-between">
			<span class="text-text-secondary">Gutter (g)</span>
			<span class="text-diagram-spine font-medium tabular-nums">{dims.gutter.toFixed(1)} mm</span>
		</div>
	</div>

	<Separator.Root class="h-px bg-border" />

	<div class="flex justify-between font-semibold">
		<span>Total Fabric</span>
		<span class="tabular-nums">{dims.fabricW.toFixed(1)} x {dims.fabricH.toFixed(1)} mm</span>
	</div>
</div>
