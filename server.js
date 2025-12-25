import fastify from 'fastify';

const server = () => {
  const app = fastify();

  app.post('/tickets', (_req, reply) => {
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ message: 'tickets has been found successfully' });
  });

  return app;
};

const port = 3000;

server().listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
