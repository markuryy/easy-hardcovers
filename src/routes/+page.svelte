<script lang="ts">
	import { computeAll } from '$lib/calculations.js';
	import type { BookInputs } from '$lib/types.js';
	import { Separator } from 'bits-ui';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import ExportMenu from '$lib/components/ExportMenu.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import ResultsPanel from '$lib/components/ResultsPanel.svelte';
	import FormulasPanel from '$lib/components/FormulasPanel.svelte';
	import FlatLayoutSVG from '$lib/components/FlatLayoutSVG.svelte';

	let pageWidth = $state(108);
	let pageHeight = $state(140);
	let blockThickness = $state(4);
	let boardThickness = $state(2.5);
	let coverMargin = $state(3);
	let fabricMargin = $state(20);

	let dims = $derived(computeAll({
		pageWidth,
		pageHeight,
		blockThickness,
		boardThickness,
		coverMargin,
		fabricMargin
	}));
</script>

<svelte:head>
	<title>Book Cover Calculator</title>
</svelte:head>

<div class="h-screen flex flex-col bg-surface-0">
	<Toolbar>
		<ExportMenu {dims} />
	</Toolbar>

	<div class="flex-1 min-h-0 flex flex-col gap-px bg-border">
		<!-- Top: 4 columns — Page Block | Materials | Dimensions | Formulas -->
		<div class="shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.5fr] gap-px">
			<div class="bg-surface-1 p-4 space-y-3 text-sm">
				<h3 class="text-xs font-medium text-text-muted uppercase tracking-wider">Page Block</h3>
				<div class="space-y-2">
					<NumberInput id="pageWidth" label="Width" color="#93c5fd" bind:value={pageWidth} />
					<NumberInput id="pageHeight" label="Height" color="#93c5fd" bind:value={pageHeight} />
					<NumberInput id="blockThickness" label="Thickness" color="#93c5fd" bind:value={blockThickness} />
				</div>
			</div>
			<div class="bg-surface-1 p-4 space-y-3 text-sm">
				<h3 class="text-xs font-medium text-text-muted uppercase tracking-wider">Materials</h3>
				<div class="space-y-2">
					<NumberInput id="boardThickness" label="Board Thick." color="#fca5a5" bind:value={boardThickness} />
					<NumberInput id="coverMargin" label="Cover Margin" color="#86efac" bind:value={coverMargin} />
					<NumberInput id="fabricMargin" label="Fabric Margin" color="#86efac" bind:value={fabricMargin} />
				</div>
			</div>
			<div class="bg-surface-1">
				<ResultsPanel {dims} />
			</div>
			<div class="bg-surface-1">
				<FormulasPanel {dims} />
			</div>
		</div>

		<!-- Bottom: diagrams side by side, fill remaining -->
		<div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-px">
			<div class="bg-surface-1 flex flex-col items-center justify-center p-2 min-h-0">
				<img src="/BookCoverDiagram_Labeled.svg" alt="Labeled book cover diagram" class="max-w-[70%] object-contain"/>
				<img src="/BookCoverDiagram_3Ways.png" alt="Book cover diagram — three views" class="max-w-full object-contain"/>
			</div>
			<div class="bg-surface-1 flex flex-col p-4 min-h-0">
				<h3 class="text-xs text-text-muted uppercase tracking-wider mb-2">Live Preview</h3>
				<div class="flex-1 min-h-0">
					<FlatLayoutSVG {dims} />
				</div>
			</div>
		</div>
	</div>
</div>
