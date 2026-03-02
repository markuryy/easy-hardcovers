<script lang="ts">
	import { Toolbar } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<Toolbar.Root
	class="flex items-center justify-between px-3 py-2 bg-surface-1 border-b border-border"
>
	<span class="text-sm font-medium text-text-primary tracking-tight">Book Cover Calculator</span>
	<div class="flex items-center gap-2">
		{@render children()}
	</div>
</Toolbar.Root>
