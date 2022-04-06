const express = require('express')
import AuthRoutes from "./Routes/Auth";
import BookRoutes from "./Routes/Books";

const server = express();

server.use(AuthRoutes);
server.use(BookRoutes);

const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
})