# Treflor NodeJS backend

[Treflor APIs deployed app on heroku](https://api-treflor.herokuapp.com)

## Description
This is a `expressJS` server app for **treflor** backend.We used google APIs for authentication and many things will be there in future.As the database we used `mongoDB` which is hosted on [mongoDB](https://www.mongodb.com/).You can find hosted app on [Heroku](https://www.mongodb.com/) by [this Link](https://api-treflor.herokuapp.com).

### Instructions to run the project

clone the repository
```bash
$ git clone https://github.com/Treflor/backend
```
then create a new project and enable [google+ API](https://console.developers.google.com/apis/library/plus.googleapis.com) and create credentials on [Google APIs](https://console.developers.google.com).

> [Tutorial to setup Google OAuth](https://youtu.be/JgSLf-HS5gg)


Copy the `client id` and `client secret key`.Create a `.env` file in the root directory.
<br>
Create IAM Admin credentials at google api and copy `project_id`,`private_key` and `client_id` from the json and paste them in  `.env` file
<br>
Structure should like be bellow.
```
JWT_SECRET=[String]
CLIENT_ID=[String]
CLIENT_SECRET=[String]
DATABASE_URL=[String]
PROJECT_ID=[String]
PRIVATE_KEY=[String]
CLIENT_EMAIL=[String]
```

|Key            |Type           |Description                                    |
|---------------|---------------|-----------------------------------------------|
|JWT_SECRET     |`String`       |Can be any `string` for generate jwt           |
|CLIENT_ID      |`String`       |Can be obtain from google APIs                 |
|CLIENT_SECRET  |`String`       |Can be obtain from google APIs                 |
|DATABASE_URL   |`String`       |Mongodb url for database                       |
|PROJECT_ID     |`String`       |Can be obtain from google apis IAM admin json  |
|PRIVATE_KEY    |`String`       |Can be obtain from google apis IAM admin json  |
|CLIENT_EMAIL   |`String`       |Can be obtain from google apis IAM admin json  |

run the project in production environment
```bash
$ npm start
```


run the project in production environment
```bash
$ npm run dev
```

project will starts at `localhost:3000/` in development environment.

## APIs

### Google oauth api
Exchange access token with profile details and store it in `mongodb` Database.Then convert `mongodb` document id into jwt and send it back.

|Type   |API                        |Response                         |
|-------|---------------------------|---------------------------------|
|post   |/oauth/google              |json web token with id and method|

required fields</br>
- `body`
    - `access_token` : required : from google sign in 

### Local sign up oauth api
Create a user according to the user email and password in `mongodb` Database.Password will store after encrypt using `bcryptjs`.Then convert `mongodb` document id into jwt and send it back.

|Type   |API                        |Response                         |
|-------|---------------------------|---------------------------------|
|post   |/oauth/signup              |json web token with id and method|

required fields</br>
- `body`
    - `email` : required
    - `password` : required
    - `family_name` : required
    - `given_name` : required
    - `photo` : 

### Local Sign in oauth api
Find user according to the email and password and convert `mongodb` document id into jwt and send it back.

|Type   |API                        |Response                         |
|-------|---------------------------|---------------------------------|
|post   |/oauth/signin              |json web token with id and method|

required fields</br>
- `body`
    - `email` : required 
    - `password` : required 

### Current user api
return current user according to the jwt and method used to sign in

|Type   |API                        |Response           |
|-------|---------------------------|-------------------|
|get    |/user                      |current user       |

required fields</br>
- `headers`
    - `Authorization` : jwt from sign in

## Overview

- [x] Google signin api
- [x] Local signup api
- [x] Local signin api
- [x] get user api
