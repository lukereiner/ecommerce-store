const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require('../models/usersModel');
const UserModelInstance = new UserModel();

module.exports = (app) => {
    // Initialize passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password'
            },
            async (email, password, done) => {
                try {
                    // Find user in DB
                    const user = await UserModelInstance.findUserByEmail(email);

                    // If no user is found, fail auth
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email or password.'})
                    };

                    // Compare password with hashed password in DB
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect email or password' });
                    };

                    // Success - pass user object forward
                    return done(null, user);
                } catch (err) {
                    throw done(err);
                }
            }
        )
    );

    // Serialize user (Determines what data is saved in the session cookie)
    passport.serializeUser((user, done) => {
        done(null, user.id); // stores only the user ID in the cookie session
    });

    // Deserialize user - Read ID from cookie, fetch full usere details from DB
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModelInstance.findUserById(id);

            if (!user) {
                return done(null, false);
            }

            // Strip password for security so req.user is clean through requests in app
            const { password, ...cleanUser } = user;
            done(null, cleanUser); // Attach user object to 'req.user'
        } catch (err) {
            done(err);
        }
    })
}