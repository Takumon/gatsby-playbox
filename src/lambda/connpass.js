const axios = require('axios');

const BASE_URL = 'https://connpass.com/api/v1/event/';

export async function handler(event, context, callback) {

  const respond = ({ status, context }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify(context),
    });
  };

  try {
    const options = {}
    if (event.queryStringParameters.event_id) {
      options.params = {
        event_id: event.queryStringParameters.event_id
      }
    }
    const res = await axios.get(BASE_URL, options);

    respond({ status: 200, context: { events: res.data.events } });
  } catch(err) {
    respond({ status: 422, context: { message: "Couldn't get the data"} });
  }
}


