const express = require('express');
const dotenv = require('dotenv').config();
const connectToDatabe = require('./src/config/dbConnection');

const errorHandler = require('./src/middleware/errorHandler');

const userRoutes = require('./src/routes/userRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const timeTabaleRoutes = require('./src/routes/timeTableRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const port = process.env.PORT || 5000;

const app = express();

connectToDatabe();

app.use(express.json());

app.use("/api/courses" , courseRoutes);
app.use("/api/users" , userRoutes);
app.use("/api/timetables" , timeTabaleRoutes);
app.use("/api/rooms" , roomRoutes);
app.use("/api/bookings" , bookingRoutes);
app.use("/api/enrollments" , enrollmentRoutes);
app.use("/api/notifications" , notificationRoutes);

app.use(errorHandler);

app.listen(port , () => {
    console.log(`Server running on port ${port}`);
});