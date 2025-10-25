import 'dotenv/config';

import app from "./src/app.js"

import { connectDB } from "./src/config/dbconfig.js"


const PORT=process.env.PORT


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});



