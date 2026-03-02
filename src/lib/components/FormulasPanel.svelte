<script lang="ts">
	import type { Dimensions } from '$lib/types.js';

	let { dims }: { dims: Dimensions } = $props();
</script>

<div class="p-4 space-y-3 text-sm">
	<h3 class="text-xs font-medium text-text-muted uppercase tracking-wider">Formulas</h3>

	<div class="space-y-2">
		<div class="bg-surface-0 rounded px-3 py-2">
			<span class="text-diagram-board font-medium">Board W</span>
			<span class="text-text-muted ml-1">
				{dims.pageW.toFixed(1)} - 0.5 x {dims.blockT.toFixed(1)} + {dims.coverMargin.toFixed(1)} =
			</span>
			<span class="text-text-primary font-semibold">{dims.boardW.toFixed(1)} mm</span>
		</div>

		<div class="bg-surface-0 rounded px-3 py-2">
			<span class="text-diagram-spine font-medium">Spine</span>
			<span class="text-text-muted ml-1">
				{dims.blockT.toFixed(1)} + 2 x {dims.boardT.toFixed(1)} =
			</span>
			<span class="text-text-primary font-semibold">{dims.spineW.toFixed(1)} mm</span>
		</div>

		<div class="bg-surface-0 rounded px-3 py-2">
			<span class="text-diagram-spine font-medium">Gutter</span>
			<span class="text-text-muted ml-1">
				{dims.blockT.toFixed(1)} / 2 + {dims.boardT.toFixed(1)} =
			</span>
			<span class="text-text-primary font-semibold">{dims.gutter.toFixed(1)} mm</span>
		</div>

		<div class="bg-surface-0 rounded px-3 py-2">
			<span class="text-text-secondary font-medium">Fabric W</span>
			<span class="text-text-muted ml-1">
				2 x {dims.boardW.toFixed(1)} + {dims.spineW.toFixed(1)} + 2 x {dims.gutter.toFixed(1)} + 2 x {dims.fabricMargin.toFixed(1)} =
			</span>
			<span class="text-text-primary font-semibold">{dims.fabricW.toFixed(1)} mm</span>
		</div>
	</div>
</div>
