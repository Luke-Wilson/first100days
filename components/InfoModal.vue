<template>
	<div class="inline">
		<button id="info-button" class="btn" @click="show">
			<div class="icon-circle"><b-icon-info /></div>
		</button>
		<modal name="my-first-modal" classes="vjs-modal" adaptive height="auto">
			<h2>About this map</h2>
			<p>This map is a representation of the first 100 days of the air campaign against the Islamic State of Iraq and the Levant (ISIL) during 2014.</p>
			<p>
				The dataset for this map was compiled by researchers at the Australian Strategic Policy Institute for the publication
				<span>
					<a rel="noopener noreferrer" target="_blank" href="https://www.aspi.org.au/report/strike-air-first-100-days-campaign-against-isil"
						>Strike from the air: The first 100 days of the campaign against ISIL</a
					>
				</span>
			</p>
			<div class="publication-cover-wrapper">
				<a rel="noopener noreferrer" target="_blank" href="https://www.aspi.org.au/report/strike-air-first-100-days-campaign-against-isil">
					<img src="/strike-from-the-air.jpg" />
				</a>
			</div>
		</modal>
	</div>
</template>

<script>
import { BIconInfo } from "bootstrap-vue"

export default {
	name: "InfoModal",
	components: {
		BIconInfo,
	},
	methods: {
		show() {
			console.log("firing show")
			this.$modal.show("my-first-modal")
		},
		hide() {
			this.$modal.hide("my-first-modal")
		},
	},
}
</script>

<style lang="scss">
#info-button {
	padding: 0;
}
.icon-circle {
	height: 20px;
	width: 20px;
	line-height: 16px;
	border-radius: 20px;
	background: black;
	text-align: center;
	font-size: 0.9em;
	border: 1px solid white;
	color: white;
	margin-bottom: 3px;
}
.inline {
	display: inline-block;
}
.publication-cover-wrapper {
	height: 200px;
	display: flex;
	justify-content: center;
	img {
		width: auto;
		height: 100%;
	}
}
.vjs-modal {
	padding: 20px;
	color: #212529;
}
</style>
