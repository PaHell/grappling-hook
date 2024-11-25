<script lang="ts">
	import './InfobarDisplay.css';

	let {
		action,
		timer
	}: {
		action: string | undefined;
		timer: number | undefined;
	} = $props();
</script>

<div class="infobar">
	<div class="spacer"></div>
	<h2 class="text">{action}</h2>
	<div class="spacer"></div>
	<div class="timer">
		<div class="spacer"></div>
		<h1 class="text">{timer}</h1>
		<div class="spacer"></div>
	</div>
</div>
