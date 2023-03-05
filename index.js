const express = require('express');
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors());

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require("twilio")(accountSid, authToken);


app.post("/postsinglemessage", (req, res) => {
  client.messages
      .create({ 
        body: req.body.data.message, 
        from: req.body.data.selectedPhonenumber, 
        to: req.body.data.recieverPhoneNumber 
      })
      .then(message => console.log(message.sid));
})

app.post("/postbulkmessages", (req, res) => {

  console.log(req.body.data.recieverPhoneNumbers[0]);

  for(let i = 0; i < req.body.data.recieverPhoneNumbers.length; i++) {
    client.messages
    .create({ 
      body: req.body.data.message, 
      from: req.body.data.selectedPhonenumber, 
      to: req.body.data.recieverPhoneNumbers[i] 
    })
    .then(message => console.log(message.sid));
  }
})


app.get('/me', (req, res) => {
  const myPhonenumbers = ["+0332434545"];
  client.incomingPhoneNumbers
  .list()
  .then(phoneNumbers => {
    phoneNumbers.forEach(phoneNumber => {
      //console.log(phoneNumber.phoneNumber);
      myPhonenumbers.push(phoneNumber.phoneNumber);
    });
    return res.send(myPhonenumbers);
  })
  .catch(error => {
    console.log(`Error: ${error.message}`);
  });

})

app.get('/balance', (req, res) => {

  client.balance
  .fetch()
  .then(balance => {
    res.send({ balance: balance.balance });
    //console.log(`Current balance: ${balance.balance}`);
  })

})


app.get("/history", (req, res) => {

  const myMessages = [];
  
  client.messages.list((err, messages) => {
    if (err) {
      console.error(err);
      return;
    }
  

    messages.forEach((message) => {
      myMessages.push({sid: message.sid, price: message.price, from: message.from, to: message.to, status: message.status,  dateSent: message.dateSent, body: message.body})  
    });

    res.send(myMessages);
  });
})

app.delete("/deleteall", (req, res) => {
  client.messages.list((err, messages) => {
    if (err) {
      console.error(err);
      return;
    }
  
    messages.forEach((message) => {
      client.messages(message.sid).remove((err, message) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Message with SID ${message.sid} deleted.`);
      });
    });
  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));