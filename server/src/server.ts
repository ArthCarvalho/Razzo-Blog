import path from 'path';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());

app.use(express.json());

// Artifical delay
//app.use( ( req, res, next ) => {
//  setTimeout(next, Math.floor( ( 1000 ) + 100 ) );
//});

app.use(routes);

app.use(errors());

app.listen(3333);