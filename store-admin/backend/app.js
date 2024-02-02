require('dotenv').config();

const express = require('express');
const app = express();
const path = require("path")
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname,'..','frontend','dist')));
//public static folder
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname,'..','frontend', "dist", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});