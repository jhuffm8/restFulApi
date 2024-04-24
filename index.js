const express = require("express");
const app = express();
const port = 3000;

// Importing the data from our fake database files.
const users = require("./data/users");

const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')
const error = require("./utilities/error");


//middleware to parse in json data 
app.use(express.json());
// Logging Middlewaare
app.use((req, res, next) => {
    const time = new Date();
  
    console.log(
      `-----
  ${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
    );
    if (Object.keys(req.body).length > 0) {
      console.log("Containing the data:");
      console.log(`${JSON.stringify(req.body)}`);
    }
    next();
  });

  // Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
    console.log(req.query)
    let key = req.query["api-key"];

  // Check for the absence of a key.
  if (!key) {
    res.status(400);
    return res.json({ error: "API Key Required" });
  }

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) {
    res.status(401);
    return res.json({ error: "Invalid API Key" });
  }

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

app.use(postRoutes)
app.use(userRoutes)


// Adding some HATEOAS links.
app.get("/", (req, res) => {
    res.json({
      links: [
        {
          href: "/api",
          rel: "api",
          type: "GET",
        },
      ],
    });
  });
  
  // Adding some HATEOAS links.
  app.get("/api", (req, res) => {
    res.json({
      links: [
        {
          href: "api/users",
          rel: "users",
          type: "GET",
        },
        {
          href: "api/users",
          rel: "users",
          type: "POST",
        },
        {
          href: "api/posts",
          rel: "posts",
          type: "GET",
        },
        {
          href: "api/posts",
          rel: "posts",
          type: "POST",
        },
      ],
    });
  });


 // error-handling middleware
app.use((req, res, next) => {
    res.status = 404;
    res.json({error: 'Resource not found'})
})
 
// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
  });

 
app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
