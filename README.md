## SETUP INSTRUCTIONS

### Installation
1. **Clone the Repository**

    ```bash
        git clone https://github.com/IT21252990/RESTful-API-university-s-timetable-system.git
    ```
2. **Navigate to the Project Directory**

    ```bash
        cd <project_directory>
    ```
3. **Install Dependencies**

    ```bash
        npm install
    ```
4. **Set up Environment Variables**
    - Create a .env file in the root directory of your application
    - Define the environment variable for the application
        ```makefile
            PORT = <port_number>
            DATABASE_CONNECTION_STRING = <mongodb_connection_string>
            ACCESS_TOKEN_SECRET_KEY = <secret_key>
        ```
5. **To run the Application**

    ```bash
        npm run dev
    ```


## API ENDPOINT DOCUMENTATION

*
    -  **POST**     `/api/users/register`   : Register a new user
    -  **POST**     `/api/users/login`  : Login a user
    -  **GET**   `/api/users/currentuser`   : Get the current user information

*
    -  **POST**     `/api/courses`   : Create a new course
    -  **GET**     `/api/courses`  : Get all courses
    -  **GET**   `/api/courses/:id`   : Get a single course
    -  **PUT**   `/api/courses/:id`   : Update a course
    -  **DELETE**   `/api/courses/:id`   : Delete a course
    -  **GET**   `/api/courses/faculty`   : Get All Courses Assigned to the faculty member

*
    -  **POST**     `/api/timetables`   : Create a new Timetable
    -  **GET**     `/api/timetables`  : Get all Timetables
    -  **GET**   `/api/timetables/:id`   : Get a single Timetable
    -  **PUT**   `/api/timetables/:id`   : Update a Timetable
    -  **DELETE**   `/api/timetables/:id`   : Delete a Timetable
    -  **GET**     `/api/timetables/courses`  : Get all Timetables Assigned to a Faculty member

*
    -  **POST**     `/api/rooms`   : Create a new Room
    -  **GET**     `/api/rooms`  : Get all Rooms
    -  **GET**   `/api/rooms/:id`   : Get a Room
    -  **PUT**   `/api/rooms/:id`   : Update a Room
    -  **DELETE**   `/api/rooms/:id`   : Delete a Room

*
    -  **POST**     `/api/bookings`   : Create a new Booking
    -  **GET**     `/api/bookings`  : Get all Booking
    -  **GET**   `/api/bookings/:id`   : Get a Booking
    -  **PUT**   `/api/bookings/:id`   : Update a Booking
    -  **DELETE**   `/api/bookings/:id`   : Delete a Booking

*
    -  **POST**     `/api/enrollments`   : Enroll to the course
    -  **GET**     `/api/enrollments`  : Get all Enrollments
    -  **GET**   `/api/enrollments/:id`   : Get a Enrollment
    -  **DELETE**   `/api/enrollments/:id`   : Unenroll from the course
    -  **GET**   `/api/enrollments/true`   : Get the Enrollments of each Student currently logged in
    -  **GET**   `/api/enrollments/true/timetables`   : Get the Timetables of Student enrolled courses

*
    -  **GET**     `/api/notifications`  : Get all Notification available in database

## RUN THE TEST

5. **To run the Unit Testing**

    ```bash
        npx jest
    ```

## Author

- **Kalinga Jayathilaka**
- **[GitHub Profile](https://github.com/IT21252990)**