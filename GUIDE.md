## How to run the website locally on your machine:

1. Clone the repository.

2. Navigate to the `frontend` directory and run `npm install` to install all the necessary dependencies.

3. Create a `.env` file in the `frontend` directory and add the following environment variables:
    - `VITE_API_URL` - The URL of the backend server. (Set as `http://localhost:<PORT>/api` if you are running the backend server locally).

4. You will need to have a MySQL server running on your machine.

5. You can use a docker container to run the MySQL server. Refer to #Docker setup for more information.

6. Create a `.env` file in the `backend` directory and add the following environment variables:
    - `DB_USER` - Your MySQL username (Set as root if you are using a docker container).
    - `DB_PASSWORD` - Your MySQL password (Set as the password you set for the root user if you are using a docker container).
    - `DB_NAME` - The name of the database you want to use (Set as the name of the database you created if you are using a docker container).
    - `DB_HOST` - The host of the MySQL server (The IP address of the MySQL server if you are using a docker container).
    - `DB_PORT` - The port of the MySQL server (Set as 3306 if you are using a docker container).
    - `JWT_SECRET` - A secret key for JWT. (Key used for signing JWT tokens).
    - `PORT` - The port you want the backend server to run on.

7. Navigate to the `backend` directory and run `go run main.go` to start the backend server (This will install dependencies on its own).

8. Navigate to the `frontend` directory and run `npm start` to start the frontend server.

9. Open your browser and go to `http://localhost:<REACT_APP_PORT>` to view the website. (or input 'o' after running `npm start` to open the website in your default browser).

## Docker setup:
- Install Docker on your machine.

- Get the latest MySQL image from Docker Hub.
    ```
    docker pull mysql:latest
    ```

- Run the MySQL container
    ```
    docker run --name <name> -e MYSQL_ROOT_PASSWORD=<pwd> -e MYSQL_DATABASE=<db_name> -p 3306:3306 -d mysql:latest
    ```
    `<name>` - The name you want to give to the docker container (can be anything).
    `<pwd>` - The password you want to set for the root user of container. (make sure it is the same as the DB_PASSWORD you put in the `.env` file).
    `<db_name>` - The name of the database you want to create. (make sure it is the same as the DB_NAME you put in the `.env` file).

- To access the MySQL container:
    ```
    docker exec -it <name> mysql -u root -p
    ```

