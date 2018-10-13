import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Book from '../../models/Book';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'
  connectToDatabase()
    .then(async () => {
        console.log(event.queryStringParameters)
        const books = await Book.find();
        callback(null, success({
          object: 'list',
          url: event.path,
          count: books.length,
          data: books,
        }))
        .catch(err => {
          callback(null, failure({
            status: false,
            error: err.message
          }))
        });
    });
}