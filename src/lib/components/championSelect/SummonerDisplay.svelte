<script lang="ts">
	import './SummonerDisplay.css';

	let {
		value
	}: {
		value: string;
	} = $props();
</script>

<div class="summoner">
	<img src={value} alt={value} />
</div>
