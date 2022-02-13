import express from 'express';

export default function() {
  const PORT = 8001;
  const app = express();

  app.use(
    express.static('public', {
      index: false,
      redirect: false,
    })
  );

  app.listen(PORT, () => {
    console.log(`Bext meta server listening on port ${PORT}`);
  });
}
