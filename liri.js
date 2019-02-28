//setup application
require("dotenv").config(); //install
var keys = require("./keys.js"); //mine; no need to install
var Spotify = require('node-spotify-api'); //install
var axios = require("axios"); //install
var fs = require('fs'); //built in; no need to install

//app object

var app = {
  concertThis: function () {
  // 1. `node liri.js concert-this <artist/band name here>`
  //  * This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:
  //    * Name of the venue
  //    * Venue location
  //    * Date of the Event (use moment to format this as "MM/DD/YYYY")
  console.log('concert-this');
//"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
  },
  spotifyThisSong: function () {
  // 2. `node liri.js spotify-this-song '<song name here>'`
  //  * This will show the following information about the song in your terminal/bash window
  //    * Artist(s)
  //    * The song's name
  //    * A preview link of the song from Spotify
  //    * The album that the song is from
  //  * If no song is provided then your program will default to "The Sign" by Ace of Base.
  console.log('spotify-this-song');
  var spotify = new Spotify(keys.spotify);
  spotify
  .search({ type: 'track', query: 'All the Small Things' })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });
  },
  movieThis: function () {
    console.log('movie-this');
    // 3. `node liri.js movie-this '<movie name here>'`
    //  * This will output the following information to your terminal/bash window:
    //      * Title of the movie.
    //      * Year the movie came out.
    //      * IMDB Rating of the movie.
    //      * Rotten Tomatoes Rating of the movie.
    //      * Country where the movie was produced.
    //      * Language of the movie.
    //      * Plot of the movie.
    //      * Actors in the movie.
    //* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    
    //rework the cmdData assuming it was entered using quotes if more than one word
    //'the red shoe'
    //['the','red','shoe']
    //the+red+shoe
    cmdData = cmdData.splice(' ').join('+'); 
  
    axios
    .get("http://www.omdbapi.com/?t="+cmdData+"&y=&plot=short&apikey=trilogy")
    .then(function(response) {
      // If the axios was successful...
      // Then log the body from the site!
      console.log(response.data);
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
  },
  doWhatItSays: function () {
    //['cmd','data']
    var myData = fs.parse().splice(',');
    var cmd = myData[0];
    if(cmd === 'spotify-this-song') {
      this.spotifyThisSong(myData[1]);
    }
    // 4. `node liri.js do-what-it-says`
    //  * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    //    * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
    //    * Edit the text in random.txt to test out the feature for movie-this and concert-this.
  
  }
};

//get the command line input
var cmd = process.argv[2];
var cmdData = process.argv[3]; 

if(cmd === 'concert-this') {
  app.concertThis();

} else if (cmd === 'spotify-this-song') {
  app.spotifyThisSong();

} else if (cmd === 'movie-this') {
  app.movieThis();

} else if (cmd === 'do-what-it-says') {
  app.doWhatItSays();
}
