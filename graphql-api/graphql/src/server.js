const express = require("express");
const cors = require('cors');
const { postgraphile, PostGraphileInflectionPlugin } = require("postgraphile");
const PgManyToManyPlugin = require("@graphile-contrib/pg-many-to-many");
const PostGraphileNestedMutations = require('postgraphile-plugin-nested-mutations');
const PostGraphileConnectionFilterPlugin = require('postgraphile-plugin-connection-filter');
const PostGraphileFulltextFilterPlugin = require('postgraphile-plugin-fulltext-filter');
// simplifies things but i prefer verbosity makes things clearer
// const PgSimplifyInflectorPlugin = require("@graphile-contrib/pg-simplify-inflector");

const isProd = process.env.NODE_ENV === 'production'
const DATABASE_URL = isProd ? process.env.PROD_DATABASE_URL : process.env.DATABASE_URL;
const OWNER_URL = isProd ? process.env.PROD_OWNER_URL : process.env.OWNER_URL;

const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const COGNITO_DOMAIN = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
const jwkToPem = require('jwk-to-pem');
const fs = require('fs');

const selfJwk = JSON
  .parse(fs.readFileSync('./self-jwk.json', 'utf8'));
const selfPem = jwkToPem(selfJwk);

const jwtSecret = (req, header, payload, done) => {
  const issuer = payload.iss;
  // console.log(req);
  console.log(header);
  console.log(payload);
  if (issuer === COGNITO_DOMAIN) {
    console.log('proccesing cognito token')
    return jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${COGNITO_DOMAIN}/.well-known/jwks.json`,
      })(req, header, payload, done);
  }
  if (issuer === 'www.margins.me') {
    console.log('proccesing lambda token');
    const kid = header.kid;
    if (!kid) { return done(new Error('no kid'));}
    if (kid !== selfJwk.kid) { return done(new Error('no matching kid'));}
    const secret = selfPem;
    done(null, secret);
  }
}

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the `kid` in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwtSecret,

  // Validate the audience and the issuer.
  // audience: "4v1q302r040fct1ve3kkhoo30b",
  // issuer: ISSUER_DOMAIN,
  algorithms: ["RS256"],
});

const app = express();

const corsOptions = {
  origin: [ /localhost/, /margins\.me$/ ]
}

app.use(cors(corsOptions));

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set.
// On successful verification, the payload of the
// decrypted Access Token is appended to the
// request (`req`) as a `user` parameter.
app.use('/graphql', checkJwt);
app.use('/test-jwt', checkJwt);

app.get('/test', (req, res, next) => {
  res.send('hello');
});

app.get('/test-jwt', (req, res, next) => {
  res.send('secret hello');
});

app.use(
  postgraphile(DATABASE_URL, "margins_public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain: (req) => { return true; },
    appendPlugins: [
      PostGraphileNestedMutations,
      PgManyToManyPlugin,
      PostGraphileConnectionFilterPlugin,
      PostGraphileFulltextFilterPlugin
    ],
    ignoreRBAC: false,
    ignoreIndexes: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    classicIds: true,
    ownerConnectionString: OWNER_URL,
    retryOnInitFail: true,
    dynamicJson: false, //truly a pain and breaks spec
    pgSettings: req => {
      const settings = {};
      if (req.user) {
        if (req.user.sub) settings['margins.account_id'] = req.user.sub;
        if (req.user['cognito:groups'][0]) settings['role'] = req.user['cognito:groups'][0];
      }
      console.log('settings:\n', settings);
      return settings;
    }
  })
);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

app.listen(8080);