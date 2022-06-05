const nodeApm = require("elastic-apm-node")

if (!nodeApm.isStarted()) {
	nodeApm.start({
		// Override service name from package.json
		// Allowed characters: a-z, A-Z, 0-9, -, _, and space
		serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
		// Use if APM Server requires a token
		secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,

		// Use if APM Server uses API keys for authentication
		apiKey: "",

		// Set custom APM Server URL (default: http://localhost:8200)
		serverUrl: process.env.ELASTIC_APM_SERVER_URL,

		// Only activate the agent if it's running in production
		// active: process.env.NODE_ENV === "production",
		active: true,
	})
}
