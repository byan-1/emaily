//Mongo password: 5XgAGS3tUnM4tIte
//mongo url: mongodb+srv://admin:5XgAGS3tUnM4tIte@cluster0-roofd.mongodb.net/test?retryWrites=true
//google id: 788830662926-8psd99pt01oeqf1t0hcdvq8f0uggtkdt.apps.googleusercontent.com
//google secret: -lAVt3jZeQfn8SykKScynS6Z

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY
};
