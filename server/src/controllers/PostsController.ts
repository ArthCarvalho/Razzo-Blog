import { Request, Response } from 'express';
import moment from 'moment';
import knex from '../database/connection';

class PostsController {
  async index(request: Request, response: Response) {
    const { sort }  = request.query;
    let sortOrder = 'asc';
    if(sort === 'descending'){
      sortOrder = 'desc';
    }
    const posts = await knex('posts').select('*').orderBy('id',sortOrder);
    const serializedPosts = posts.map(post => {
      return {
        post_id: post.id,
        author: post.author,
        title: post.title,
        date: post.date,
      };
    });
    return response.json(serializedPosts);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const post = await knex('posts').where('id', id).first();
    if(!post) {
      return response.status(404).json({
        title: 'Artigo não encontrado!',
        message: 'O link para este arquivo é inválido, não existe ou foi deletado.',
      });
    }
    return response.json(post);
  }

  async create(request: Request, response: Response) {
    const post = {
      date: moment().format("DD/MM/YYYY"),
      ...request.body,
    }

    const trx = await knex.transaction();

    const insertedIds = await trx('posts').insert(post);

    const postId = insertedIds[0];

    await trx.commit();

    return response.json(postId);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const post = {
      date: moment().format("DD/MM/YYYY"),
      ...request.body,
    }

    const trx = await knex.transaction();

    const updateStatus = await trx('posts').where('id',id).update(post);

    await trx.commit();

    if(updateStatus){
      return response.json({ message: 'Post editado com sucesso!' });
    } else {
      return response.status(400).json({ message: 'Erro: Post não existe para ser editado.' });
    }

  }

  async remove(request: Request, response: Response) {
    const { id } = request.params;

    const trx = await knex.transaction();

    const deleteStatus = await trx('posts').where('id',id).del();

    await trx.commit();

    if(deleteStatus){
      return response.json({ message: 'Post deletado com sucesso!' });
    } else {
      return response.status(400).json({ message: 'Erro: Post não existe para ser deletado.' });
    }
  }
}

export default PostsController;