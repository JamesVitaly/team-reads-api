import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Highlight from '../../models/Highlight';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const highlight = data;

  connectToDatabase()
    .then(async () => {
        const newhighlight = await Highlight.create(highlight);
        callback(null, success(newHighlight))
        .catch(err => {
          console.log(err);
          callback(null, failure({
            status: false,
            error: err.message
          }))
        });
    })
    .catch(err => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }))
    });
}