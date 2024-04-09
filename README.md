# Movie API

## Overview

This project is a movie API built with Nest.js, a progressive Node.js framework for building efficient and scalable server-side applications.

## Installation

Before running the application, you need to follow these steps:

### Step 1: Install MySQL

Make sure you have MySQL installed on your machine. If not, download and install it from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/).

### Step 2: Configure MySQL

Start the MySQL server and configure it with the following commands:

```bash
mysql -u root -p
```

### Step 3: Create Database

```sql
CREATE DATABASE movie_db;
```

### Step 4: Configure Environment

In your project directory, create a .env file and configure the database connection. 
Replace the placeholders with your MySQL username, password, host, and database name.

```.env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin
DB_DATABASE=movie_db
```

## Usage
### Swagger Configuration

Swagger documentation is automatically generated for this API. You can explore and interact with the API endpoints using the Swagger UI.

## Running the App

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run start:prod
```

# API Endpoints

## Movies

### List all movies

- **URL:** `/movies`
- **Method:** `GET`
- **Description:** Retrieves a list of all movies.
- **Query Parameters:**
  - `page` (optional): The page number for pagination. Default is `1`.
  - `limit` (optional): The maximum number of movies to return per page. Default is `10`.
- **Response:**
  - `movies`: An array of movie objects.
  - `total`: Total number of movies.
  - `page`: Current page number.
  - `totalPages`: Total number of pages.

### Get a specific movie

- **URL:** `/movies/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific movie by its ID.
- **Parameters:**
  - `id`: The ID of the movie to retrieve.
- **Response:** Returns the movie object with the specified ID.

### Create a new movie

- **URL:** `/movies`
- **Method:** `POST`
- **Description:** Creates a new movie.
- **Request Body:** Expects a JSON object with the following properties:
  - `title`: The title of the movie.
  - `description`: The description of the movie.
  - `releaseDate`: The release date of the movie.
- **Response:** Returns the newly created movie object.

### Update an existing movie

- **URL:** `/movies/:id`
- **Method:** `PUT`
- **Description:** Updates an existing movie.
- **Parameters:**
  - `id`: The ID of the movie to update.
- **Request Body:** Expects a JSON object with the movie properties to update.
- **Response:** Returns the updated movie object.

### Delete a movie

- **URL:** `/movies/:id`
- **Method:** `DELETE`
- **Description:** Deletes a movie by its ID.
- **Parameters:**
  - `id`: The ID of the movie to delete.

## Genres
### List all genres

- **URL:** `/genres`
- **Method:** `GET`
- **Description:** Retrieves a list of all genres.
- **Response:** An array of genre objects.

### Delete a Genre

- **URL:** `/genres/:id`
- **Method:** `DELETE`
- **Description:** Deletes a genre with the specified ID.
- **Path Parameters:**
  - `id`: The ID of the genre to delete.

### Create a new Genre

- **URL:** `/genres`
- **Method:** `POST`
- **Description:** Creates a new genre.
- **Request Body:** Expects a JSON object with the following property:
  - `name`: The Name of the genre.
- **Response:** The newly created genre object.
