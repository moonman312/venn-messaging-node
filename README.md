# Venn Email
Build in a redundant email service seamlessly. If your email provider goes down, it'll fall back to a secondary service. If you want to switch providers, just change their priority parameter.

## Install
```
npm install venn-email
```

## Example
```
emailClient = require("venn-places");

emailClient.setDefaultFrom("from@email.com");
// set as primary email provider
emailClient.configureMandrill("aNdLxLa4xFG4JR-wpeMklw", 1);
// set as secodary email provider (since 1 < 2)
emailClient.configureSendgrid("venn-email", "Password123", 2);

emailClient.send("to@email.com", "Subject 123", "How you doin", function(err, result){
	console.info("done");
});
```


## API

#### Initializing
###### setDefaultFrom(email)
|params         | type   |    description                | example          |
|---------------| ----   |   --------------------------- | ------------     |
|email          | String |    default from email address | bob@email.com    |

###### configureSendgrid(api_user, api_key, priority)
|params         | type   |    description       | example          |
|---------------| ----   |   --------------------------- | ------------     |
|api_user       | String |   sendgrid user id   | "venn-email"     |
|api_key        | String |   sendgrid password  | "Password123"    |
|priority       | Number |   service priority   | 2                |

###### configureMandrill(api_key, priority)
|params         | type   |    description      | example                    |
|---------------| ----   |   --------------------------- | ------------     |
|api_key        | String |   mandrill api key  | "aNdLxLa4xFG4JR-wpeMklw"   |
|priority       | Number |   service priority  | 1                          |

#### Use
###### send(to, subject, message)
|params         | type   |    description      | example                    |
|---------------| ----   |   --------------------------- | ------------     |
|to             | String |   to email address      | "to@email.com"          |
|subject        | String |   email subject         | Subject 123             |
|message        | String |   email message         | How you doin          |



