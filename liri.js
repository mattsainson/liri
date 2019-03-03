//setup application
require("dotenv").config(); //install
var keys = require("./keys.js"); //mine; no need to install
var Spotify = require('node-spotify-api'); //install
var axios = require("axios"); //install
var fs = require('fs'); //built in; no need to install
var moment = require('moment'); //npm install moment --save

//utility method to write object to a file
function writeObj(obj) {
  fs.writeFile('log.json', JSON.stringify(obj), function (err) {
    if (err) {
      console.log(err);
    }
  });
}

//main app object
var app = {

  cmds: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
  cmdFunc: function () { //thanks Jose!
    return [
      this.concertThis,
      this.spotifyThisSong,
      this.movieThis,
      this.doWhatItSays];
  },

  concertThis: function (cmd, data) {
    // 1. `node liri.js concert-this <artist/band name here>`
    //  * This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:

    var artist = data.split(' ').join('');

    // console.log('artist', artist);
    var url = 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp';
    // console.log(url);
    axios
      .get(url)
      .then(function (response) {
        var events = response.data;
        // writeObj(response.data[0]);

        //write the header
        app.doHeader(events.length + ' results found for: ' + data + ' (' + cmd + ')');

        events.forEach(function (evt) {
          //    * Name of the venue
          //    * Venue location
          //    * Date of the Event (use moment to format this as "MM/DD/YYYY")
          //build event block
          var eventData = [
            'Venue: ' + evt.venue.name,
            'Location: ' + evt.venue.city + ' ' + evt.venue.country,
            'Date: ' + moment(evt.datetime).format('L') //MM/DD/YYYY
          ].join('\n');

          //output the event block
          app.doData(eventData);

        });

      })
      .catch(function (error) {
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
  spotifyThisSong: function (cmd, data) {
    // 2. `node liri.js spotify-this-song '<song name here>'`
    //  * This will show the following information about the song in your terminal/bash window
    //  * If no song is provided then your program will default to "The Sign" by Ace of Base.
    // console.log('spotify-this-song');

    if (!data) {
      data = 'The Sign';
    }

    var spotify = new Spotify(keys.spotify);
    spotify
      .search({ type: 'track', query: data })
      .then(function (response) {
        // writeObj(response);

        var tracks = response.tracks.items; //array

        //write the header
        app.doHeader(tracks.length + ' results found for: ' + data + ' (' + cmd + ')');

        //    * Artist(s)
        //    * The song's name
        //    * A preview link of the song from Spotify
        //    * The album that the song is from

        tracks.forEach(function (track) {

          //build artist block
          var artists = track.artists; //array
          var artistsData = [];
          artists.forEach(function (artist) {
            artistsData = [
              artist.name
            ].join(' * ');
          });

          //build event block
          var trackData = [
            'Artist (s): ' + artistsData,
            'Song: ' + track.name,
            'Album: ' + track.album.name,
            track.preview_url ? 'Preview URL: ' + track.preview_url : 'Preview URL: ' + 'none provided'
          ].join('\n');

          //output the data block
          app.doData(trackData);

        });
      })
      .catch(function (err) {
        console.log(err);
      });
  },
  movieThis: function (cmd, data) {
    // console.log('movie-this');
    // 3. `node liri.js movie-this '<movie name here>'`
    //  * This will output the following information to your terminal/bash window:
    //* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

    if (!data) {
      data = 'Mr. Nobody';
    }

    var movieName = data.split(' ').join('+');

    axios
      .get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy")
      .then(function (response) {

        // writeObj(response.data);
        var movie = response.data;

        //write the header
        app.doHeader('Result found for: ' + data + ' (' + cmd + ')');

        //      * Title of the movie.
        //      * Year the movie came out.
        //      * IMDB Rating of the movie.
        //      * Rotten Tomatoes Rating of the movie.
        //      * Country where the movie was produced.
        //      * Language of the movie.
        //      * Plot of the movie.
        //      * Actors in the movie.

        //get the rotten tomatoes rating out of Ratings[] Source=Rotten Tomatoes
        var rtRating = '';
        var ratings = movie.Ratings;
        ratings.forEach(function (rating) {
          if (rating.Source === 'Rotten Tomatoes') {
            rtRating = rating.Value;
            return;
          }
        });

        //build event block
        var movieData = [
          'Title: ' + movie.Title,
          'Year: ' + movie.Year,
          'IMDB Rating: ' + movie.imdbRating,
          'Rotten Tomatoes Rating: ' + rtRating,
          'Country: ' + movie.Country,
          'Language (s): ' + movie.Language,
          'Plot: ' + movie.Plot,
          'Actors: ' + movie.Actors
        ].join('\n');

        //output the data block
        app.doData(movieData);

      })
      .catch(function (error) {
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
  doWhatItSays: function (cmd) {
    // 4. `node liri.js do-what-it-says`
    //  * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    //    * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
    //    * Edit the text in random.txt to test out the feature for movie-this and concert-this.
    fs.readFile("random.txt", "utf8", function (error, fileData) {

      // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log(error);
      } else {

        //['cmd','data']
        var fileArr = fileData.split(',');
        var cmdFile = fileArr[0];
        var cmdFileData = fileArr[1];

        //write the header for this call
        app.doHeader('Reading file (' + cmd + ')');

        app.dispatcher(cmdFile, cmdFileData);
      }
    });
  },
  dispatcher: function (cmd, data) {
    var idx = app.cmds.indexOf(cmd);
    if (idx === -1) {
      app.errMsg(cmd, data);
    } else {
      // console.log(data);
      app.cmdFunc()[idx](cmd, data); //thanks Jose!
    }
  },
  errMsg: function (cmd, data) {
    console.log('The command ' + cmd + ' is not known.');
    console.log('I know the following commands: ' + cmds);
  },
  doHeader: function (info) {
    //build a header
    var header = div + info + '\n';
    //Clear the file and console
    fs.appendFile('log.txt', header + div, function (err) {
      if (err) throw err;
    });
    console.log(header + div2);
  },
  doData: function (data) {
    fs.appendFile('log.txt', data + '\n' + divU, function (err) {
      if (err) throw err;
    });
    //write event block to console
    console.log(data + '\n' + divU2);
  }
};

var divU2 = '>';
var divU = divU2 + '\n';
var div2 = '=================================================='; //console is different from fs
var div = div2 + '\n';

//get the command line input
var cmd = process.argv[2];
var cmdData = process.argv.splice(3).join(' ');

// console.log('input', cmd, cmdData);

//call the dispatcher
app.dispatcher(cmd, cmdData);
