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


Copy the `client id` and `client secret key`.Create a `.env` file in the root directory.Structure should like be bellow.
```
JWT_SECRET=[String]
CLIENT_ID=[String]
CLIENT_SECRET=[String]
DATABASE_URL=[String]
```

|Key            |Type           |Description                            |
|---------------|---------------|---------------------------------------|
|JWT_SECRET     |`String`       |Can be any `string` for generate jwt   |
|CLIENT_ID      |`String`       |Can be obtain from google APIs         |
|CLIENT_SECRET  |`String`       |Can be obtain from google APIs         |
|DATABASE_URL   |`String`       |Mongodb url for database               |

run the project
```bash
$ npm start
```

project will starts at `localhost:3000/` in development enviroment.

## APIs

|Type   |API                        |Description            |Response           |
|-------|---------------------------|-----------------------|-------------------|
|post   |/oauth/google              |google oauth api       |JWT token          |

### Todo

- [x] backend should connect with mongodb still not configured.
