// Import the Mongoose library
const mongoose = require('mongoose');

mongoose
  .connect("mongodb+srv://gulsanvarma:Gulshan%403265@cluster0.o3aqqr8.mongodb.net/MyHisabbook")
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));
 