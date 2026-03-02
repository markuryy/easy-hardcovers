<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import type { Dimensions } from '$lib/types.js';
	import { exportFabricSVG, exportCoverPanelsSVG, exportReferencePDF } from '$lib/exports.js';

	let { dims }: { dims: Dimensions } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-border
			   text-text-secondary hover:bg-surface-2 hover:text-text-primary cursor-pointer transition-colors"
	>
		Export
		<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path d="M19 9l-7 7-7-7"/>
		</svg>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content sideOffset={4}>
		<DropdownMenu.Item onSelect={() => exportFabricSVG(dims)}>
			Fabric SVG
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={() => exportCoverPanelsSVG(dims, true)}>
			Cover Panels SVG
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onSelect={() => exportReferencePDF(dims)}>
			Reference PDF
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
