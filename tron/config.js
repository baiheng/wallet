const isDebug = process.env.DEBUG && process.env.DEBUG === 'true';
module.exports = {
	isDebug,
	cgiHost: `https://api.tronscan.org/api/`,
}
