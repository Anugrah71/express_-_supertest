
/*const app = require('./app');
app.listen(10000, () => {
  console.log("Server is running on port 3000");
});
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

