<script lang="ts">
	let {
		value = $bindable(),
		label,
		color,
		id
	}: {
		value: number;
		label: string;
		color: string;
		id: string;
	} = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = parseFloat(target.value) || 0;
	}
</script>

<div class="flex items-center gap-3">
	<span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: {color}"></span>
	<label for={id} class="shrink-0 w-32 text-sm font-medium text-text-secondary">{label}</label>
	<div class="w-full flex items-center border border-border rounded transition-all has-[:focus]:ring-2 has-[:focus]:ring-accent/30 has-[:focus]:border-accent">
		<input
			type="number"
			{id}
			name={id}
			value={value}
			oninput={handleInput}
			class="flex-1 min-w-0 p-2 bg-transparent border-none outline-none
				   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
		/>
		<span class="shrink-0 pr-2 text-sm text-text-muted select-none">mm</span>
	</div>
</div>
