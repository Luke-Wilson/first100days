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
	mounted() {
		this.map = new mapboxgl.Map({
			container: "myMap",
			style: "mapbox://styles/luke-wilson/ckryk3wlk0kns19kd1n3361hd",
			center: {
				lat: 34.1911,
				lng: 41.0092,
			},
			zoom: 5.5,
		})

		this.map.on("load", () => {
			// Add controls
			this.map.addControl(new mapboxgl.NavigationControl())

			this.map.addSource("airstrikes", {
				type: "geojson",
				data: airstrikes,
				cluster: true,
				clusterMaxZoom: 14, // Max zoom to cluster points on
				clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
			})

			this.map.addLayer({
				id: "clusters",
				type: "circle",
				source: "airstrikes",
				filter: ["has", "point_count"],
				paint: {
					"circle-color": ["step", ["get", "point_count"], "#ff00d4", 30, "#ff0090", 60, "#ff0040"],
					"circle-opacity": 0.8,
					"circle-radius": ["step", ["get", "point_count"], 15, 30, 20, 60, 30],
				},
			})

			this.map.addLayer({
				id: "cluster-count",
				type: "symbol",
				source: "airstrikes",
				filter: ["has", "point_count"],
				layout: {
					"text-field": "{point_count_abbreviated}",
					"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
					"text-size": 12,
				},
			})

			this.map.addLayer({
				id: "unclustered-point",
				type: "circle",
				source: "airstrikes",
				filter: ["!", ["has", "point_count"]],
				paint: {
					"circle-color": "#c800ff",
					"circle-radius": 5,
					"circle-stroke-width": 1,
					"circle-stroke-color": "#fff",
				},
			})
		})
		// inspect a cluster on click
		this.map.on("click", "clusters", (e) => {
			console.log({ e })
			const features = this.map.queryRenderedFeatures(e.point, {
				layers: ["clusters"],
			})
			const clusterId = features[0].properties.cluster_id
			this.map.getSource("airstrikes").getClusterExpansionZoom(clusterId, (err, zoom) => {
				if (err) return

				this.map.easeTo({
					center: features[0].geometry.coordinates,
					zoom,
				})
			})
		})

		// When a click event occurs on a feature in
		// the unclustered-point layer, open a popup at
		// the location of the feature, with
		// description HTML from its properties.
		this.map.on("click", "unclustered-point", (e) => {
			console.log(e.features)
			this.renderPopup(e, true)
		})

		this.map.on("click", "clustered-point", (e) => {
			console.log("clustered-point")
			console.log(e)
		})
	},
	methods: {
		renderPopup(e, isCluster) {
			const feature = e.features[0]
			const coordinates = feature.geometry.coordinates.slice()

			// Ensure that if the map is zoomed out such that
			// multiple copies of the feature are visible, the
			// popup appears over the copy being pointed to.
			// while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			// 	coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
			// }

			new mapboxgl.Popup()
				.setLngLat(coordinates)
				.setHTML(this.createPopupHTML(feature.properties, isCluster))
				.addTo(this.map)
		},
		createPopupHTML(strike, isCluster = false) {
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

			// if (isCluster) {
			// 	returnVar += "<button class='btn-next'>Next</button>"
			// }

			return returnVar
		},
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
