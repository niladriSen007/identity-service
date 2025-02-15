import express from 'express';
import { config } from './config';
import { apiRouter } from './routes';
const { config_env } = config;
const { PORT } = config_env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});