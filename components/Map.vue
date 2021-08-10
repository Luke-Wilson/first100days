<template>
	<div id="myMap"></div>
</template>

<script>
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js"
import airstrikes from "@/data/airstrikes.json"
mapboxgl.accessToken = process.env.mapboxToken

export default {
	name: "Map",
	data: () => ({
		map: {},
	}),
	methods: {
		addMarkers() {
			airstrikes.forEach((strike, idx) => {
				const el = document.createElement("div")
				el.className = "marker"
				const marker = new mapboxgl.Marker()
					.setLngLat([strike.lng, strike.lat])
					.setPopup(new mapboxgl.Popup().setHTML(this.createPopupHTML(strike)))
					.addTo(this.map)
			})
		},
		createPopupHTML(strike) {
			let returnVar = `
				<h3>${strike.location}</h3>
				<p>Country: ${strike.country}</p>
				<p>Date range: ${strike.date}</p>
				<p>Platform/Weapon: ${strike.platform.WEAPON}</p>
				<p>Target: ${strike.target}</p>
				<p>Purpose: ${strike.purpose}</p>
			`
			if (strike.youtube_clip.includes("youtube.com")) {
				returnVar += `<p><a target="_blank" href="${strike.youtube_clip}">Video</a></p>`
			}

			return returnVar
		},
	},
	mounted() {
		console.log(airstrikes[3])
		this.map = new mapboxgl.Map({
			container: "myMap",
			// style: "mapbox://styles/mapbox/streets-v11",
			style: "mapbox://styles/luke-wilson/ckryk3wlk0kns19kd1n3361hd",

			center: {
				lat: 34.1911,
				lng: 41.0092,
			},
			zoom: 5.5,
		})
		this.map.on("load", () => {
			this.addMarkers()
		})
	},
}
</script>

<style lang="scss" scoped>
#myMap {
	height: 100vh;
	width: 100%;
}

.marker {
	background-image: url("/static/mapbox-icon.png");
	background-size: cover;
	width: 100px;
	height: 100px;
	border-radius: 50%;
	cursor: pointer;
}

.mapboxgl-popup {
	max-width: 200px;
}

.mapboxgl-popup-content {
	text-align: center;
	font-family: "Open Sans", sans-serif;
	background-color: red;
	h3 {
		color: purple !important;
	}
}
</style>
