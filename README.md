# Treflor NodeJS backend

### Instructions to run the project

clone the repository
```bash
$ git clone https://github.com/Treflor/backend
```
then create a new project and enable [google+ API](https://console.developers.google.com/apis/library/plus.googleapis.com) and create credentials on [Google APIs](https://console.developers.google.com).

[Tutorial for Google OAuth setup](https://youtu.be/JgSLf-HS5gg)

Copy the `client id` and `client secret key`.Create a `.env` file in the root directory.Structure should like be bellow
```
JWT_SECRET=[String]
CLIENT_ID=[String]
CLIENT_SECRET=[String] 
```

run the project
```bash
$ npm start
```

## APIs

|Type   |API                        |Response           |
|-------|---------------------------|-------------------|
|<td colspan=3>google oauth                             |
|post   |/oauth/google              |JWT token          |