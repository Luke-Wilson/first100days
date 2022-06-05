const nodeApm = require("elastic-apm-node")

module.exports = function () {
	this.nuxt.hook("ready", async (nuxt) => {
		if (!nodeApm.isStarted()) {
			await nodeApm.start({
				// Override service name from package.json
				serviceName: process.env.elasticApmServiceName,
				// Use if APM Server requires a token
				secretToken: process.env.elasticApmSecretToken,

				// Use if APM Server uses API keys for authentication
				// apiKey: "",

				// Set custom APM Server URL (default: http://localhost:8200)
				serverUrl: process.env.elasticApmServerUrl,

				// Only activate the agent if it's running in production
				active: process.env.NODE_ENV === "production",
			})

			// Now explicitly require the modules we want APM to hook into, as otherwise
			// they would not be instrumented.
			//
			// Docs: https://www.elastic.co/guide/en/apm/agent/nodejs/master/custom-stack.html
			// Modules: https://github.com/elastic/apm-agent-nodejs/tree/master/lib/instrumentation/modules
			// require("http")
			// require("http2")
			// require("https")
		}
	})
}
