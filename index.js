const express = require("express");
const multer = require("multer");
const app = express();
const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

app.use(express.json());

app.use((request, response, next) => {
  console.log(`${request.method}:${request.url}`);
  next();
});

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now + file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("UploadImage");

mongoClient.connect(url, (err, db) => {
  if (err) {
    console.log("Connection Error.");
  } else {
    const VIVAPAIN_DB = db.db("VIVAPAIN_DB");
    const collection = VIVAPAIN_DB.collection("GymOwners");

    //This is Gym Owners database

    app.post("/signup", (req, res) => {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
      };

      console.log("Received user data from client.");

      const query = { email: newUser.email };

      collection.findOne(query, (err, result) => {
        if (result == null) {
          console.log("GymOwner created.");
          collection.insertOne(newUser, (err, result) => {
            res.status(200).send();
          });
        } else {
          console.log("user already exists.");
          res.status(400).send();
        }
      });
    });

    app.post("/login", (req, res) => {
      const query = {
        email: req.body.email,
        password: req.body.password,
      };

      console.log("Received user data from client.");

      collection.findOne(query, (err, result) => {
        if (result != null) {
          const objToSend = {
            name: result.name,
            email: result.email,
            password: result.password,
            age: result.age,
            weight: result.weight,
            trainedHrs: result.trainedHrs,
            lostWeight: result.lostWeight,
          };
          console.log("user found.");
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("user not found.");
          res.status(404);
        }
      });
    });

    app.post("/update", (req, res) => {
      const query1 = {
        email: req.body.email,
        password: req.body.password,
      };

      console.log("Received user data from client.");

      collection.findOne(query1, (err, result) => {
        if (result == null) {
          console.log("Object not found for updating.");
          res.sendStatus(404);
          return;
        } else {
          console.log("Object found for updating.");
        }
      });

      const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
      };

      collection.deleteOne(query1);

      collection.insertOne(updatedUser, (err, result) => {
        console.log("Updated.");
        res.status(200).send();
      });
    });

    //This is users database

    const collection1 = VIVAPAIN_DB.collection("Users");

    app.post("/signup1", (req, res) => {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
      };

      console.log("Received user data from client.");

      const query = { email: newUser.email };

      collection1.findOne(query, (err, result) => {
        if (result == null) {
          console.log("User created.");
          collection1.insertOne(newUser, (err, result) => {
            res.status(200).send();
          });
        } else {
          console.log("user already exists.");
          res.status(400).send();
        }
      });
    });

    app.post("/login1", (req, res) => {
      const query = {
        email: req.body.email,
        password: req.body.password,
      };

      console.log("Received user data from client.");

      collection1.findOne(query, (err, result) => {
        if (result != null) {
          const objToSend = {
            name: result.name,
            email: result.email,
            age: result.age,
            weight: result.weight,
            trainedHrs: result.trainedHrs,
            lostWeight: result.lostWeight,
          };
          console.log("user found.");
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("user not found.");
          res.status(404);
        }
      });
    });

    app.post("/update1", (req, res) => {
      const query1 = {
        email: req.body.email,
      };

      console.log("Received user data from client.");

      collection1.findOne(query1, (err, result) => {
        if (result == null) {
          console.log("Object not found for updating.");
          res.sendStatus(404);
          return;
        } else {
          console.log("Object found for updating.");
        }
      });

      const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
      };

      collection1.deleteOne(query1);

      collection1.insertOne(updatedUser, (err, result) => {
        console.log("Updated.");
        res.status(200).send();
      });
    });
  }
});

app.listen(3000, () => {
  console.log("Listining on port 3000...");
});
