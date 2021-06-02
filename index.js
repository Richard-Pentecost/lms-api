const app = require('./src/app.js');

const APP_PORT = 3000;

app.listen(APP_PORT, () => {
  console.log(`App is listening on port ${APP_PORT}`);
});
