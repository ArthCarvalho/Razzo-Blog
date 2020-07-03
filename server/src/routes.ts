import express from 'express';
import { celebrate, Joi } from 'celebrate';

import PostsController from './controllers/PostsController';

const routes =   express.Router();

const postsController = new PostsController();

routes.get('/', (request, response) => {
  return response.json({ message: 'Index - Razzo Blog' });
});

routes.get('/posts', postsController.index);

routes.get('/posts/:id', postsController.show);

routes.post(
  '/posts',
  celebrate({
    body: Joi.object().keys({
      author: Joi.string().required(),
      title: Joi.string().required(),
      image_url: Joi.number().allow(''),
      body: Joi.string().required(),
    }),
  },{
    abortEarly: false
  }),
  postsController.create
);

routes.put('/posts/:id', postsController.update);

routes.delete('/posts/:id', postsController.remove);

export default routes;