# Liri

The repo can be found here: (https://github.com/mattsainson/liri)

This project is LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data.

Here is a gif showing Liri in action: ![liri gif](https://github.com/mattsainson/liri/blob/master/liri.gif)

The app support the following commands:

* concert-this
* movie-this
* spotify-this-song
* do-what-it-says

Input can be one or more strings without need to enclose in quotes.

Call example: node liri.js concert-this dave matthews

Output is to the console and to log.txt. The text is appended to previous command results.

One challenge to this project was an approach I wanted to have where I listed my commands in an array, checked if the entered command was known, and then called the corresponding function. I attempted to create a simple array of functions but that didn't work. With code from Jose Cobos, below is the code that finally worked.

```javascript
//the object with cmds array, cmdFunc function, and dispatcher method
var app = {
  cmds: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
  cmdFunc: function () { //thanks Jose!
    return [
      this.concertThis,
      this.spotifyThisSong,
      this.movieThis,
      this.doWhatItSays];
  },
   dispatcher: function (cmd, data) {
   var idx = app.cmds.indexOf(cmd);
   if (idx === -1) {
     app.errMsg(cmd, data);
   } else {
     app.cmdFunc()[idx](cmd, data); //thanks Jose!
   }
  }
}
```
