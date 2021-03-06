import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Team from '../../models/Team';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    callback(null, 'Lambda is warm!');
  }

  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(async () => {
      const teamId = event.pathParameters.id;
      const team = await Team.findOneAndDelete({ _id: teamId });
      callback(null, success(team));
    })
    .catch((err) => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message,
      }));
    });
}
