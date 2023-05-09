const user = require('./src/models/user'),
    event = require('./src/models/event');

const syncAll = async () => {
    await user.sync();
    await event.sync();
};

syncAll()
    .then(() => console.log('All table sync'))
    .catch(error => console.error(error))
    .finally(() => process.exit(0))

