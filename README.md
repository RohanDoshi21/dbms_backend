# DBMS Mini Project

## Relational Diagram

<img src= "https://user-images.githubusercontent.com/63660267/199528051-cd86ec71-a02c-4b8f-9f69-05e5bee6d417.png" height=500></img>

## ER Diagram

<img src= "https://user-images.githubusercontent.com/63660267/199527388-f25a8ad7-0e5a-4bbc-9a04-60331d4fb31e.png" height=500></img>

> Steps to build using docker-compose

### 1. Starting all containers (including building)

```
    docker compose up -d
```

### 2. Stopping all containers (including removing)

```
    docker compose down
```

### 3. Removing volumes associated with containers

```
    docker compose down -v
```

> Connecting to postgres database

### 1. Get the postgres container id

```
    docker ps
```

### 2. Connect to postgres database

```
    docker exec -it postgres psql -U postgres
```

### 3. Some Useful Commands

```
    # List all databases
    \l

    # Use a databases
    \c postgres

    # List all tables
    \dt
```
