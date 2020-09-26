// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || '127.0.0.1';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 9696;

// Grab the blacklist from the command-line so that we can update the blacklist without deploying
// again. CORS Anywhere is open by design, and this blacklist is not used, except for countering
// immediate abuse (e.g. denial of service). If you want to block all origins except for some,
// use originWhitelist instead.
function parseEnvList(env) {
    if (!env) {
	    return [];
    }
    return env.split(',');
}
const originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
const originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
module.exports = function(extApi) {
    const nodecg = extApi;

    const cors_proxy = require('./lib/cors-anywhere');
    cors_proxy.createServer({
        originBlacklist: originBlacklist,
        originWhitelist: originWhitelist,
        requireHeader: ['origin', 'x-requested-with'],
        removeHeaders: [
	        'cookie',
	        'cookie2',
	        'x-request-start',
        ],
        redirectSameOrigin: true,
        httpProxyOptions: {
	        xfwd: false,
        },
    }).listen(port, host, function() {
        nodecg.log.info('Running CORS Anywhere on ' + host + ':' + port);
    });
}
