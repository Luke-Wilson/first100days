<template>
	<div>
		<Header />
		<Map />
	</div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	data: () => ({
		title: "Strike from the Air: First 100 days in the air campaign against ISIL",
	}),
	head() {
		return {
			title: this.title,
			meta: [
				// hid is used as unique identifier. Do not use `vmid` for it as it will not work
				{
					hid: "description",
					name: "description",
					content: "Strike from the Air: First 100 days in the air campaign against ISIL",
				},
			],
			link: [
				{
					href: "https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css",
					rel: "stylesheet",
				},
			],
		}
	},
})
</script>

<style lang="scss">
body {
	background-color: #000;
}
</style>
