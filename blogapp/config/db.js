if (process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://williamCesar:will0104@cluster0-8wgph.azure.mongodb.net/test?retryWrites=true&w=majority"}
}
else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}