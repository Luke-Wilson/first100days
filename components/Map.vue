<template>
	<div id="myMap"></div>
</template>

<script>
import jQuery from "jquery"
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js"
import airstrikes from "@/data/airstrikes.json"
mapboxgl.accessToken = process.env.mapboxToken

const $ = jQuery
export default {
	name: "Map",
	data: () => ({
		map: {},
		currentIndex: 0,
		currentPopup: null,
		currentFeatures: [],
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
				clusterMaxZoom: 9, // Max zoom to cluster points on
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
					"circle-radius": 6,
					"circle-stroke-width": 1,
					"circle-stroke-color": "#fff",
				},
			})

			$("body").on("click", ".btn-next", (e) => {
				this.closePopup()
				this.currentIndex++
				this.renderPopup()
			})
			$("body").on("click", ".btn-prev", (e) => {
				this.closePopup()
				this.currentIndex--
				this.renderPopup()
			})
		})

		// inspect a cluster on click
		this.map.on("click", "clusters", (e) => {
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

		// unclustered click handler
		this.map.on("click", "unclustered-point", (e) => {
			this.currentIndex = 0
			this.currentFeatures = e.features.slice(0, e.features.length / 2)
			this.renderPopup()
		})
	},
	methods: {
		closePopup() {
			this.currentPopup?.remove()
		},
		renderPopup() {
			const feature = this.currentFeatures[this.currentIndex]
			const coordinates = feature?.geometry.coordinates.slice()

			this.currentPopup = new mapboxgl.Popup({ maxWidth: "500px" })
				.setLngLat(coordinates)
				.setHTML(this.createPopupHTML(feature.properties))
				.addTo(this.map)
		},
		createPopupHTML(strike) {
			const weapon = JSON.parse(strike.platform).WEAPON
			const outcome = JSON.parse(strike.effect).OUTCOME

			let returnVar = `
				<h3>${strike.location}</h3>
				<p><strong>Country</strong>: ${strike.country}</p>
				<p><strong>Date range</strong>: ${strike.date}</p>
				<p><strong>Platform/Weapon</strong>: ${weapon}</p>
				<p><strong>Target</strong>: ${strike.target}</p>
				<p><strong>Purpose</strong>: ${strike.purpose}</p>
				<p><strong>Effect</strong>: ${outcome}</p>
			`

			if (strike.youtube_clip.includes("youtube.com")) {
				returnVar += `<p><a target="_blank" href="${strike.youtube_clip}">Video</a></p>`
			}

			returnVar += `<p class="text-center">Strike ${this.currentIndex + 1} of ${this.currentFeatures.length}</p>`
			returnVar += "<div class='popup-btn-wrapper'>"

			if (this.currentIndex >= 1) {
				returnVar += "<button class='btn btn-link btn-prev'>Prev</button>"
			} else {
				returnVar += "<button disabled class='btn btn-link btn-prev'>Prev</button>"
			}

			if (this.currentIndex < this.currentFeatures.length - 1) {
				returnVar += "<button class='btn btn-link btn-next'>Next</button>"
			} else {
				returnVar += "<button disabled class='btn btn-link btn-next'>Next</button>"
			}

			returnVar += "</div>"

			return returnVar
		},
	},
}
</script>

<style lang="scss">
#myMap {
	height: calc(100vh - 100px);
	width: 100%;
	.marker {
		background-image: url("/static/mapbox-icon.png");
		background-size: cover;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		cursor: pointer;
	}
	.mapboxgl-popup {
		.mapboxgl-popup-content {
			/* text-align: center; */
			font-family: "Open Sans", sans-serif;
			width: 500px;
			p {
				margin-bottom: 0.5rem;
			}
		}

		.popup-btn-wrapper {
			display: flex;
			justify-content: center;
		}
	}
}
</style>
