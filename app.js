//REQUIRE THE EXPRESS
let express = require("express");
//object of express
let app = express();
//for reading value from .env
let dotenv = require("dotenv");
//to connect to .env
dotenv.config();
//morgan-->for logs purposes
let morgan = require("morgan");
let fs = require("fs");
//middleware function-->are the supporting libraries
let port = process.env.PORT || 9800;
let cors = require("cors");
let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.MONGOLOCAL;
//to achieve the functionality of the post api then only we will be able to use the body
let bodyParser = require("body-parser");
let db;
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//tiny,common,combined--can get all the logs of ur routes
app.use(morgan("short", { stream: fs.createWriteStream("./app.logs") }));
app.use(cors());
//if u want to save the logs then u can also save it with require

//define route
//req->what we send to the server
//res->whst we get back from the server
app.get("/", (req, res) => {
  res.send("This is  from express");
});
//
app.get("/category", (req, res) => {
  db.collection("cat")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//based on languages all movies
//-----------------------------------------

//based on actor actresses
//--------------------------------------------

app.get("/all", (req, res) => {
  //query param;
  // "category": "1"
  let query = {};
  let title = req.query.Title;
  let Year = req.query.Year;
  let category = Number(req.query.category);
  let imdb = req.query.imdbRating;
  console.log(imdb);
  if (category) {
    query = {
      category: category,
    };
  } else if (title) {
    query = { Title: title };
  } else if (imdb) {
    query = {
      imdbRating: imdb,
    };
  } else if (Year) {
    query = {
      Year: Year,
    };
  }
  db.collection("allmovies")
    .find(query)

    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//learning param
//every filter I apply category id is compulsory

app.get("/filter/:category", (req, res) => {
  let query = {};
  let sort = { imdbRating: -1 };
  let category = Number(req.params.category);
  let year = Number(req.query.year);
  if (year) {
    query = {
      category: category,
      Year: year,
    };
  }
  db.collection("allmovies")
    .find(query)
    .sort(sort)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//wrt to genre

// Action
app.get("/action", (req, res) => {
  let query = {};
  //query param;
  // "category": "1"
  let Title = req.query.Title;
  if (Title) {
    query = {
      Title: Title,
    };
  }
  db.collection("action")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//api-->http://localhost:2500/action
//Action and imdb

//Adventure
app.get("/adventure", (req, res) => {
  let query = {};
  //query param;
  // "category": "1"
  let Title = req.query.Title;
  if (Title) {
    query = {
      Title: Title,
    };
  }
  db.collection("adventure")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//api-->http://localhost:2500/adventure

//Horror
app.get("/horror", (req, res) => {
  let query = {};
  //query param;
  // "category": "1"
  let Title = req.query.Title;

  if (Title) {
    query = {
      Title: Title,
    };
  }
  db.collection("horror")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//api-->http://localhost:2500/horror

//Crime
app.get("/crime", (req, res) => {
  let query = {};
  //query param;
  // "category": "1"
  let Title = req.query.Title;
  if (Title) {
    query = {
      Title: Title,
    };
  }
  db.collection("crime")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//api-->http://localhost:2500/crime

//TV shows
app.get("/TVShows", (req, res) => {
  let query = {};
  //query param;
  // "category": "1"
  let Title = req.query.Title;
  if (Title) {
    query = {
      Title: Title,
    };
  }
  db.collection("TVshows")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

app.get("/restaurants", (req, res) => {
  let query = {};
  let stateId = Number(req.query.stateId);
  let mealId = Number(req.query.mealId);
  if (stateId) {
    query = { state_id: stateId };
  } else if (mealId) {
    query = { "mealTypes.mealtype_id": mealId };
  }
  db.collection("restaurantsData")
    .find(query)

    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
//post

app.post("/subscriptions", (req, res) => {
  // console.log(req.body);
  db.collection("suscriptions").insertOne(req.body, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/subscriptions", (req, res) => {
  // console.log(req.body);
  let email = req.query.email;
  let query = {};
  if (email) {
    query = { email };
  }
  db.collection("suscriptions")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
// app.post("plan", (err, result) => {
//   if (Array.isArray(req.body.id)) {
//     db.collection("").find({ plan_id: { $in: req.body.id } });
//   } else {
//     res.send("Invalid input");
//   }
// });

//update order
app.put("/updateplan/:id", (req, res) => {
  let oid = Number(req.params.id);
  db.collection("suscriptions").updateOne(
    {
      planno: oid,
    },
    {
      $set: {
        status: req.body.status,
        bank_name: req.body.bank_name,
        date: req.body.date,
      },
    },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

//delete

app.delete("/deleteOrder/:id", (req, res) => {
  let _id = mongo.ObjectId(req.params.id);
  db.collection("suscriptions").deleteOne({ _id: _id }, (err, result) => {
    if (err) throw err;
    res.send("Order Deleted");
  });
});

//connection with mongo
MongoClient.connect(mongoUrl, (err, client) => {
  if (err) console.log("Error while connecting");
  db = client.db("category");
  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
});
////////////////////////////////////////////////////
////////////extraaaaaaaaaaaaaaaaaaaaaaaaaaaa
// app.get("/meals", (req, res) => {
//   db.collection("mealTypes")
//     .find()
//     .toArray((err, data) => {
//       if (err) throw err;
//       res.send(data);
//     });
// });
// // // //with express u can define multiple routes

// //////////////////////////////////////

// let express = require("express");
// let app = express();
// /// for reading value form .env
// let dotenv = require("dotenv");
// dotenv.config();
// // for logging purposes
// let morgan = require("morgan");
// let fs = require("fs");
// let port = process.env.PORT || 9800;
// let mongoUrl = process.env.MONGOLOCAL;
// let cors = require("cors");
// // let mongo = require("mongodb");
// const { MongoClient } = require("mongodb");
// // let MongoClient = mongo.MongoClient;
// console.log(mongoUrl);
// let db;

// // middleware
// app.use(morgan("short", { stream: fs.createWriteStream("./app.logs") }));
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("This is From Express App code");
// });

// //list of city
// app.get("/location", (req, res) => {
//   db.collection("location")
//     .find()
//     .toArray((err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
// });
// // app.get("/locations", (req, res) => {
// //   if (err) throw err;
// //   console.log("atleast opened");
// // });

// MongoClient.connect(mongoUrl, (err, client) => {
//   if (err) console.log(`Error while connecting`);
//   db = client.db("ZomatoData");
//   app.listen(port, () => {
//     console.log(`Listing to port ${port}`);
//   });
// });
// var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://127.0.0.1:27017";

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("ZomatoData");
//   dbo.collection("locations").findOne({}, function (err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });
