# Venn Email
[ ![Codeship Status for VennHQ/venn-email-node](https://codeship.com/projects/40a5efb0-c00d-0132-200e-021ec7688aff/status?branch=master)](https://codeship.com/projects/73117)

Build in a redundant email service seamlessly. If your email provider goes down, it'll fall back to a secondary service. If you want to switch providers, just change their priority parameter.

# Use

### Install
```bash
npm install venn-email
```

### Functions
##### initialize(api_key, callback)
|params         | type   |    description      | example                    |
|---------------| ----   |   --------------------------- | ------------     |
|api_key        | String |   Venn API Key    | 64d2fa24h3f6f7cc61asp3e8         |
##### send(from, to, subject, message, callback)
|params         | type   |    description      | example                    |
|---------------| ----   |   --------------------------- | ------------     |
|from           | String |   from email address    | from@email.com         |
|to             | String |   to email address      | to@email.com           |
|subject        | String |   email subject         | Subject 123            |
|message        | String |   email message         | How you doin           |

### Example
```js
email = require("venn-email");

// initialize and send an email
email.initialize(VENN_API_KEY)
email.send("from@email.com", "to@email.com", "Subject 123", "How you doin", function(err, result){
	// email successfully sent if !err
})
```



#Development

##### adding a new email provider
* write failing tests
* add service to lib/models/providers (copy an existing provider)
	* change initialize and send functions to service specific way of initializing client/sending message
* edit email_client.js and require lib/models/providers/[newservice].js
	* then add it in the configureServices

##### install dependencies
```
npm install
```

##### Run Example
```
node examples/example.js
```

##### Run Example (with debug logging)
```
export VENN_API_KEY=""
DEBUG=email node examples/example.js
```

##### Run Tests
###### Export api keys
```bash
export SENDGRID_API_USER=""
export SENDGRID_API_KEY=""
export MANDRILL_API_KEY=""

mocha
```



