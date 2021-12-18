# LMS API

Creating an api using a MySQL database.

## Setting up database in order to run the application

```docker-compose up -d```

## Create migrations

To create models and migrations together

```sequelize model:generate --name User --attributes name:string,email:string etc.```

```sequelize seed:generate --name User```
