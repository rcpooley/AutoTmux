const Util = require('./util');

async function main() {
    console.log(JSON.stringify(await Util.listSessions(), null, 2));
}

main().catch(console.error);