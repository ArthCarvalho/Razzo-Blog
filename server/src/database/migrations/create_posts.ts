import Knex from 'knex';

export async function up(knex: Knex) {
  // Create Tables
  return knex.schema.createTable('posts', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('date').notNullable();
    table.string('image_url');
    table.string('body').notNullable();
  });
}

export async function down(knex: Knex) {
  // Revert Tables/Delete
  return knex.schema.dropTable('posts');
}