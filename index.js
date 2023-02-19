const express = require("express");  // Import express library
const app = express(); // Create instance of express
const mongoClient = require("mongodb").MongoClient; // Import mongodb library
const url = "mongodb://localhost:27017";  // String that holds default mongodb URL

app.use(express.json());  // Configure middleware to parse incoming requests with JSON payloads

app.use((request, response, next) => {
  console.log(`${request.method}:${request.url}`);  // Middleware function that logs information about incoming requests to the console
  next();
});
mongoClient.connect(url, (err, db) => {  // Establishes a connection to the MongoDB server
  if (err) {
    console.log("Connection Error.");
  } else {
    const VIVAPAIN_DB = db.db("VIVAPAIN_DB");                                           // Database name  |
    const collection = VIVAPAIN_DB.collection("GymOwners");                             // Table 1        |
    const collectionB = VIVAPAIN_DB.collection("Breakfast");                            // Table 2        |
    const collectionD = VIVAPAIN_DB.collection("Dinner");                               // Table 3        |
    const collectionL = VIVAPAIN_DB.collection("Lunch");                                // Table 4        |
    const collectionS = VIVAPAIN_DB.collection("Snacks");                               // Table 5        |---> init database with tables    
    const collectionUsersHistory = VIVAPAIN_DB.collection("UsersHistory");              // Table 6        |
    const collectionGymOnwersHistory = VIVAPAIN_DB.collection("GymOwnerHistory");       // Table 7        |
    const collectionGymD = VIVAPAIN_DB.collection("Gyms");                              // Table 8        |
    const collectionRequestedGym = VIVAPAIN_DB.collection("GymRequests");               // Table 9        |
    const collection1 = VIVAPAIN_DB.collection("Users");                                // Table 10       |

    
    
    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //This is gym owner database
    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////


    app.post("/signup", (req, res) => {                         // Route 1 : signup
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
        gainedWeight: req.body.gainedWeight,
        date: req.body.date,
        Created_At: req.body.CreatedAt,
        lastUpdated: req.body.lastUpdated,
        count: 0,
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

    app.post("/login", (req, res) => {                      // Route 2 : login
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
            gainedWeight: result.gainedWeight,
            lastUpdated: result.lastUpdated,
          };
          console.log("user found.");
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("user not found.");
          res.status(404);
        }
      });
    });

    app.post("/update", (req, res) => {                             // Route 3 : update , requested after we change profile data
      const query1 = {
        email: req.body.email,
        password: req.body.password,
      };

      const countStatic = {
        count: 0,
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
        gainedWeight: req.body.gainedWeight,
        date: req.body.date,
        lastUpdated: req.body.lastUpdated,
        Created_At: req.body.CreatedAt,
      };

      const query3 = {
        GETCOUNT: "COUNT",
      };

      collectionGymOnwersHistory.findOne(query3, (err, result) => {
        if (result == null) {
          console.log("couldn't get count.");
        } else {
          countStatic.count = result.count;
          console.log("count = " + countStatic.count);
        }
      });

      collection.deleteOne(query1);

      collection.insertOne(updatedUser, (err, result) => {
        console.log("Updated.");
      });

      const historyInsertRecord = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
        gainedWeight: req.body.gainedWeight,
        date: req.body.date,
        Created_At: req.body.CreatedAt,
      };

      collectionGymOnwersHistory.insertOne(
        historyInsertRecord,
        (err, result) => {
          console.log("History recorded.");
        }
      );
    });

    app.post("/GetGymOwnerHistory", (req, res) => {              // Route 4 : GetGymOwnerHistory , returns last 4 updates of a gym owner
      const queryF = { name: req.body.name };

      console.log(req.body.name);

      collectionGymOnwersHistory
        .find(queryF)
        .sort({ _id: -1 })
        .limit(4)
        .toArray((err, result) => {
          console.log("still trying to retrieve history...");
          if (result != null) {
            console.log("History retrieved successfully!");
            console.log(result);
            res.status(200).send(result);
          } else {
            console.log("unknown error");
            res.status(400).send();
          }
        });
    });

    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //This is gym owner database
    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////









    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////GET GYMS DATA/////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    app.get("/GymData", (req, res) => {                             // Route 5 : GymData , Retrieve promoted gyms
      console.log("trying to get gym details...");
      collectionGymD.find({}).toArray((err, result) => {
        console.log("still trying...");
        if (result != null) {
          console.log("Gyms details retrieved successfully!");
          console.log(result);
          res.status(200).send(result);
        } else {
          console.log("unknown error");
          res.status(400).send();
        }
      });
    });

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////GET GYMS DATA/////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////










    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////REQUEST TO ADD A GYM////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    app.post("/requestG", (req, res) => {                      // Route 6 : requestG , Requested gym data to upload
      const RequestedGym = {
        RequestedAt: req.body.RequestedAt,
        UserName: req.body.UserName,
        UserEmail: req.body.UserEmail,
        GymName: req.body.GymName,
        GymAddress: req.body.GymAddress,
        GymPhoneNumber: req.body.GymPhoneNumber,
        GymAllowedGender: req.body.GymAllowedGender,
        GymMonthlyPlan: req.body.GymMonthlyPlan,
      };

      console.log("Received requested gym data from client.");

      const query = { GymName: RequestedGym.GymName };

      collectionRequestedGym.findOne(query, (err, result) => {
        if (result == null) {
          console.log("Request Sent.");
          collectionRequestedGym.insertOne(RequestedGym, (err, result) => {
            res.status(200).send();
          });
        } else {
          console.log("Gym is already requested!");
          res.status(400).send();
        }
      });
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////REQUEST TO ADD A GYM////////////////////////////
    ///////////////////////////////////////////////////////////////////////////











    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////GET YOUR DIET///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    app.post("/breakfast", (req, res) => {                        // Route 7 : breakfast , get breakfast list
      const query = {
        num: req.body.num,
      };

      console.log("Received breakfast data from client.");

      collectionB.findOne(query, (err, result) => {
        if (result != null) {
          const objToSend = {
            steps: result.steps,
            calories: result.calories,
          };
          console.log("Data found.");
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("Data not found.");
          res.status(404);
        }
      });
    });

    app.post("/snacks", (req, res) => {                         // Route 8 : snacks , get snacks list 
      const query = {
        num: req.body.num,
      };

      console.log("Received snacks data from client.");

      collectionS.findOne(query, (err, result) => {
        if (result != null) {
          const objToSend = {
            steps: result.steps,
            calories: result.calories,
          };
          console.log("Data found.");
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("Data not found.");
          res.status(404);
        }
      });
    });

    app.post("/dinner", (req, res) => {                      // Route 9 : dinner , get dinner list
      const query = {
        num: req.body.num,
      };

      console.log("Received dinner data from client.");

      collectionD.findOne(query, (err, result) => {
        if (result != null) {
          const objToSend = {
            steps: result.steps,
            calories: result.calories,
          };
          console.log("Data found.");
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("Data not found.");
          res.status(404);
        }
      });
    });

    app.post("/lunch", (req, res) => {                  // Route 10 : lunch , get lunch list
      const query = {
        num: req.body.num,
      };

      console.log("Received lunch data from client.");

      collectionL.findOne(query, (err, result) => {
        if (result != null) {
          const objToSend = {
            steps: result.steps,
            calories: result.calories,
          };
          console.log("Data found.");
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("Data not found.");
          res.status(404);
        }
      });
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////GET YOUR DIET///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////






    

    

    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //This is users database
    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////


    app.post("/signup1", (req, res) => {                             // Route 11 : signup 
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
        gainedWeight: req.body.gainedWeight,
        date: req.body.date,
        Created_At: req.body.CreatedAt,
        lastUpdated: req.body.lastUpdated,
        count: 0,
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

    app.post("/login1", (req, res) => {                     // Route 12 : login
      const query = {
        email: req.body.email,
        password: req.body.password,
      };

      console.log("Received user data from client.");

      collection1.findOne(query, (err, result) => {
        console.log("user found.");
        if (result != null) {
          const objToSend = {
            name: result.name,
            email: result.email,
            age: result.age,
            weight: result.weight,
            trainedHrs: result.trainedHrs,
            lostWeight: result.lostWeight,
            gainedWeight: result.gainedWeight,
            password: req.body.password,
            lastUpdated: result.lastUpdated,
          };
          res.status(200).send(JSON.stringify(objToSend));
        } else {
          console.log("user not found.");
          res.status(404);
        }
      });
    });

    app.post("/update1", (req, res) => {                    // Route 13 : update , requested after we change profile data
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
        gainedWeight: req.body.gainedWeight,
        date: req.body.date,
        lastUpdated: req.body.lastUpdated,
        Created_At: req.body.CreatedAt,
      };

      collection1.deleteOne(query1);

      collection1.insertOne(updatedUser, (err, result) => {
        console.log("Updated.");
        res.status(200).send();
      });

      const historyInsertRecord = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        weight: req.body.weight,
        trainedHrs: req.body.trainedHrs,
        lostWeight: req.body.lostWeight,
        gainedWeight: req.body.gainedWeight,
        date: req.body.date,
        Created_At: req.body.CreatedAt,
      };

      collectionUsersHistory.insertOne(historyInsertRecord, (err, result) => {
        console.log("History recorded.");
      });
    });

    app.post("/GetUserHistory", (req, res) => {                          // Route 14 : GetUserHistory , returns last 4 updates of a Trainee
      const queryF = { name: req.body.name };

      console.log(req.body.name);

      collectionUsersHistory
        .find(queryF)
        .sort({ _id: -1 })
        .limit(4)
        .toArray((err, result) => {
          console.log("still trying to retrieve history...");
          if (result != null) {
            console.log("History retrieved successfully!");
            console.log(result);
            res.status(200).send(result);
          } else {
            console.log("unknown error");
            res.status(400).send();
          }
        });
    });
    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    //This is users database
    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
  }
});

app.listen(3000, () => {                                // start the server and listen for incoming requests on port 3000
  console.log("Listining on port 3000...");
});
