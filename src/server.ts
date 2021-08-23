import express from 'express';
import { router } from './routes/api';
import { errorHandlerMiddleware } from './utils/middlewares/errorHandlerMiddleware';
import { noRouteMiddleware } from './utils/middlewares/noRouteMiddleware';

const app = express();

app.use(express.json());

app.use(router);
app.use(noRouteMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => {
  console.log(`http is listening on port ${port}`);
});
