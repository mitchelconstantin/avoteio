const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const db = require('../../../database/index');

const scope = [
  'user-read-email',
  'streaming',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-read',
  'playlist-read-private',
  'user-library-modify',
  'playlist-modify-public',
  'user-read-recently-played',
  'user-read-private',
  'playlist-modify-private',
  'user-top-read',
  'user-read-birthdate',
];

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  db.getUserById(id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      done(null, user);
    }
  });
});

passport.use(
  new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: '/auth/spotify/redirect'
  }, (accessToken, refreshToken, expires_in, profile, done) => {
    const tokenExpiresAt = new Date(Date.now() + (expires_in * 1000)).toISOString().slice(0, 19).replace('T', ' ');

    db.addUser({spotify_id: profile.id, spotify_display_name: profile.displayName, access_token: accessToken, refresh_token: refreshToken, token_expires_at: tokenExpiresAt}, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        db.getUserBySpotifyId(profile.id, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            done(null, user);
          }
        });
      }
    });
  })
);