# DailyRadioServer

Simple node.js server for mobile radio app.

# API

## Syntax Notes

The examples below use these syntax conventions:

```
Lines prefixed with:  |  Are sent from:	 |         To:         |
        <                   client               server
        >                   server          connecting client
```

## Create User

Provide user creation and add it to database.  

```js
< POST http://<hostAddress>/user/create

> '<serverResponse>'
```

POST data:

```js
{
  "login": "<login>",
  "password": "<password>",
  "email": "<email>"
}
```

Where:  
_< hostAddress >_ - address of computer hosting this app.  
_< login >_ - user's login for authorization.  
_< password >_ - user's password for authorization.  
_< email >_ - user's email.  
_< serverResponse >_ - confirmation of action:  
- 'Successfuly created.' (status code 200).  
- 'Wrong post data.' (status code 400).  
- 'Login <login> is already exist.' (status code 422).  
- 'Email <email> is already exist.' (status code 422).  
- 'Internal Server Error' (status code 500).

**Example:**

```js
< POST http://localhost/user/create
```

POST data:  

```js
{
  "login": "Alex",
  "password": "TheBestPassword",
  "email": "myEmail@mail.com"
}
```

Response:  

```js
> 'Successfuly created.'
```

## Change User's Email

Allows user to change the mail.

```js
< POST http://<hostAddress>/user/changeEmail

> '<serverResponse>'
```

POST data:  

```js
{
  "login": "<login>",
  "newEmail": "<newEmail>"
}
```

Where:  
_< hostAddress >_ - address of computer hosting this app.  
_< login >_ - user's login for authorization.  
_< newEmail >_ - user's new email.  
_< serverResponse >_ - confirmation of action:  
- 'Email successfully changed.' (status code 200).  
- 'Wrong post data.' (status code 400).  
- 'User not found.' (status code 422).  
- 'Internal Server Error' (status code 500).

**Example:**

```js
< POST http://localhost/user/changeEmail
```

POST data:  

```js
{
  "login": "Alex",
  "newEmail": "mySecondEmail@mail.com"
}
```

Response:  

```js
> 'Email successfully changed.'
```

## Get User  

Provides user information.  

```js
< POST http://<hostAddress>/user/get
```

POST data:  

```js
{
  "login": "<login>",
  "password": "<password>",
}
```

If user exists (status code 200):  

```js
>  {
     "login": "<login>",
     "password": "<password>",
     "email": "<email>",
     "verified": "<boolean>"
   }
```

If user not found:  

```json
> '<serverResponse>'
```

Where:  
_< hostAddress >_ - address of computer hosting this app.  
_< login >_ - user's login for authorization.  
_< password >_ - user's password for authorization.  
_< email >_ - user's email.  
_< boolean >_ -  true/false - state of email verification.  
_< serverResponse >_ - confirmation of action:  
- 'Wrong post data.' (status code 400).  
- 'User not found.' (status code 404).  
- 'Internal Server Error' (status code 500).

**Example:**

```js
< POST http://localhost/user/get
```

POST data:  

```js
{
  "login": "Alex",
  "password": "TheBestPassword",
}
```

Response:  

```js
>  {
     "login": "Alex",
     "password": "TheBestPassword",
     "email": "<mySecondEmail@mail.com>",
     "verified": "false"
   }
```
