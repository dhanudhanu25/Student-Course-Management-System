const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'student_course_management',
      storageEngine: 'wiredTiger',
    },
  });
  const uri = mongod.getUri();
  console.log('Local MongoDB started at:', uri);
  console.log('Keep this process running. Press Ctrl+C to stop.');

  const shutdown = async () => {
    console.log('\nShutting down local MongoDB...');
    await mongod.stop();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})().catch((err) => {
  console.error('Failed to start local MongoDB:', err);
  process.exit(1);
});
