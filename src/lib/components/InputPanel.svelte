<script lang="ts">
	import { Separator } from 'bits-ui';
	import NumberInput from './NumberInput.svelte';

	let {
		pageWidth = $bindable(),
		pageHeight = $bindable(),
		blockThickness = $bindable(),
		boardThickness = $bindable(),
		coverMargin = $bindable(),
		fabricMargin = $bindable()
	}: {
		pageWidth: number;
		pageHeight: number;
		blockThickness: number;
		boardThickness: number;
		coverMargin: number;
		fabricMargin: number;
	} = $props();
</script>

<div class="p-4 space-y-4">
	<h3 class="text-xs font-medium text-text-muted uppercase tracking-wider">Page Block</h3>
	<div class="space-y-3">
		<NumberInput id="pageWidth" label="Width" color="#93c5fd" bind:value={pageWidth} />
		<NumberInput id="pageHeight" label="Height" color="#93c5fd" bind:value={pageHeight} />
		<NumberInput id="blockThickness" label="Thickness" color="#93c5fd" bind:value={blockThickness} />
	</div>

	<Separator.Root class="h-px bg-border" />

	<h3 class="text-xs font-medium text-text-muted uppercase tracking-wider">Materials</h3>
	<div class="space-y-3">
		<NumberInput id="boardThickness" label="Board Thick." color="#fca5a5" bind:value={boardThickness} />
		<NumberInput id="coverMargin" label="Cover Margin" color="#86efac" bind:value={coverMargin} />
		<NumberInput id="fabricMargin" label="Fabric Margin" color="#86efac" bind:value={fabricMargin} />
	</div>
</div>
