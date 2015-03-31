# Venn Email
Build in a redundant email service seamlessly. If your email provider goes down, it'll fall back to a secondary service. If you want to switch providers, just change their priority parameter.

## Install
```bash
npm install venn-email
```

## Example
```js
email = require("venn-email");

// initalize with your Venn API Key
email.initialize(VENN_API_KEY)

// send an email
email.send("to@email.com", "Subject 123", "How you doin", function(err, result){
	// email successfully sent if !err
});
```

##### Run Example
```
node examples/example.js
```

##### Run Example (with debug logging)
```
DEBUG=venn-email node examples/example.js
```



## API

#### Initializing

#### Use
###### initalize(api_key)
|params         | type   |    description      | example                    |
|---------------| ----   |   --------------------------- | ------------     |
|api_key        | String |   Venn API Key    | api_key         |
###### send(from, to, subject, message)
|params         | type   |    description      | example                    |
|---------------| ----   |   --------------------------- | ------------     |
|from           | String |   from email address    | from@email.com         |
|to             | String |   to email address      | to@email.com           |
|subject        | String |   email subject         | Subject 123            |
|message        | String |   email message         | How you doin           |



