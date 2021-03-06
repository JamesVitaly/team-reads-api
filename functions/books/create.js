import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Book from '../../models/Book';
import User from '../../models/User';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const { userId } = data;

  // remove the user id for creating book
  delete data.userId;
  const book = data;

  book.createdAt = Date.now();

  connectToDatabase()
    .then(async () => {
      const newBook = await Book.create(book);
      await User.updateOne({ _id: userId }, {
        $addToSet: {
          books: newBook._id,
        },
      });
      callback(null, success(newBook));
    })
    .catch((err) => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
