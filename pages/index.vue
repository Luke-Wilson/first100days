<template>
	<Map />
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	data: () => ({
		title: "Strike from the Air: First 100 Days",
	}),
	head() {
		return {
			title: this.title,
			meta: [
				// hid is used as unique identifier. Do not use `vmid` for it as it will not work
				{
					hid: "description",
					name: "description",
					content: "My custom description",
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
