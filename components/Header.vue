<template>
	<b-container class="map-header-row">
		<b-row>
			<b-col>
				<header>
					<h1>Strike from the Air</h1>
					<div class="text-muted inline">First 100 days in the air campaign against ISIL</div>
					<p>servername</p>
					<p>{{ servername }}</p>
					<InfoModal />
				</header>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
export default {
	name: "Header",
	data: () => ({
		servername: "",
	}),
	mounted() {
		this.servername = process.env.elasticApmServiceName
	},
}
</script>

<style lang="scss" scoped>
.map-header-row {
	height: 100px;
	color: white;
}
</style>
