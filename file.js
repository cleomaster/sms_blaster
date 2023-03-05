// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC68901effe0e625024b009928dd87f8c0";
const authToken = "74dbd14f5421ca0ae2628370817c7fde";
const client = require("twilio")(accountSid, authToken);


    client.messages
      .create({ 
        body: "Hello this is NABIL from USA", 
        from: "5075747593", 
        to: "8583585148" 
      })
      .then(message => console.log(message.sid));
