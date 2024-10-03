const knex = require("knex");
const Joi = require("joi");

const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;
const routes = require("./routes/index.js");
app.use(express.json());
const knexfile = require("./knexfile"); // Ensure the path to knexfile.js is correct
const secret = "secret";
// Initialize knex with the correct environment (e.g., 'development')
const db = knex(knexfile.development);

app.use(routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// app.get("/applytoken", getverification, async (req, res) => {
//   const id = req.user;
//   const data = await db.select("*").from("users").where("id", id);
//   res.json({ data });

//   // const dpassword = bcrypt.compareSync(password, 8);
//   // if (dpassword) {
//   // } else {
//   // res.json({ message: "password not match" });
// });

// app.get("/gettoken", async (req, res) => {
//   const email = req.body.email;
//   const token = jwt.sign(email, secret);
//   res.json({ token });
// });

// app.post("/signupApi", async (req, res) => {
//   try {
//     let password = req.body.password;

//     const data = {
//       name: req.body.name,
//       email: req.body.email,
//     };

//     console.log(data);

//     const schema = Joi.object({
//       name: Joi.string().min(3).required(),
//       email: Joi.string().email().required(),
//       // password: Joi.string().required(),
//     });
//     // console.log(schema);

//     const { error, value } = schema.validate(data);

//     if (error) {
//       console.log("Validation error:", error.details[0].message);
//     } else {
//       const user = await db("users").where("email", data.email).first();
//       console.log(user);
//       if (user) {
//         res.json({ message: "Email exists", user });
//       } else {
//         let passwordHash = await bcrypt.hashSync(password, 8);
//         password = passwordHash;
//         const id = await db("users").insert({
//           name: data.name,
//           email: data.email,
//           password: password,
//         });

//         res.status(201).json({ message: "user hase been registered" });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// });
// app.post("/loginApi", async (req, res) => {
//   try {
//     const data = {
//       email: req.body.email,
//       password: req.body.password,
//     };
//     const schema = Joi.object({
//       email: Joi.string().email().required(),
//       password: Joi.string().required(),
//     });
//     const { error, value } = schema.validate(data);
//     if (error) {
//       console.log("Validation error:", error.details[0].message);
//     } else {
//       const userdata = await db
//         .select("*")
//         .from("users")
//         .where("email", data.email);
//       const token = jwt.sign({ id: userdata.id }, secret); //

//       const user = await db("users").where("email", data.email).first();
//       if (user) {
//         res.json({ message: "login success", token });
//       } else {
//         res.status(201).json({ message: "login failed Email not found" });
//       }
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(400).json({ message: "err 400 bad request" });

//     throw e;
//   }
// });

// function getverification(req, res, next) {
//   let header = req.headers.authorization;
//   header = header.split(" ")[1];
//   if (header) {
//     jwt.verify(header, secret, (err, data) => {
//       if (err) {
//         res.status(403).send("Forbidden");
//       } else {
//         req.user = data;
//         next();
//       }
//     });
//   }
// }
// const knexfile = require("./knexfile");

// const knex = require("knex")({
//   client: "postgresql",
//   connection: {
//     database: "abdul",
//     user: "postgres",
//     password: "admin",
//   },
// });
//  app.get("/join", async (req, res) => {

// //   try {
// //     // Create a table
// //     await knex.schema
// //       .createTable('users', (table) => {
// //         table.increments('id');
// //         table.string('user_name');
// //       })
// //       // ...and another
// //       .createTable('accounts', (table) => {
// //         table.increments('id');
// //         table.string('account_name');
// //         table.integer('user_id').unsigned().references('users.id');
// //       });

// //     // Then query the table...
// //     const insertedRows = await knex('users').insert({ user_name: 'Tim' });

// //     // ...and using the insert id, insert into the other table.
// //     await knex('accounts').insert({
// //       account_name: 'knex',
// //       user_id: insertedRows[0],
// //     });

//     // Query both of the rows.
//     const selectedRows = await knex('users')
//       .join('accounts', 'users.id', 'accounts.user_id')
//       .select('users.user_name as user', 'accounts.account_name as account');

//     // map over the results
//     const enrichedRows = selectedRows.map((row) => ({ ...row, active: true }));

//     // Finally, add a catch statement
//   } catch (e) {
//     console.error(e);
//   }
app.get("/getfulldata", async (req, res) => {
  try {
    const full = await db("doctor").select("*");
    res.json({ data: full });
  } catch (e) {
    console.error(e);
    res.json({ message: e });
    throw e;
  }
});
app.get("/getdata", async (req, res) => {
  try {
    const name = req.body.name;
    const getdata = await db("doctor").where({ patientName: name }).select("*");
    res.json({ data: getdata });
  } catch (e) {
    console.error(e);
    res.json({ message: e });
    throw e;
  }
});

app.patch("/update", async (req, res) => {
  try {
    const { name, timings } = req.body;
    await db("doctor")
      .where({ patientName: name })
      .update({ timings: timings });

    res.json({ message: "updated" });
  } catch (e) {
    console.error(e);
    res.json({ message: e });
    throw e;
  }
});
app.delete("/delete", async (req, res) => {
  try {
    const { name } = req.body;
    await db("doctor").where({ patientName: name }).del();

    res.json({ message: "deleted record" });
  } catch (e) {
    console.error(e);
    res.json({ message: e });
    throw e;
  }
});

app.post("/discharge", async (req, res) => {
  try {
    const name = req.body.name;
    const timings = req.body.timings;
    const [dischargecheck] = await db("doctor")
      .where({ patientName: name, timings: timings })
      .select();

    console.log(dischargecheck);
    // console.log(dischargecheck.patientName);

    // console.log(req.body.name);
    // console.log(dischargecheck.timings);

    if (
      !dischargecheck ||
      !dischargecheck.timings ||
      !dischargecheck.patientName
    ) {
      return res.json({ message: "patient not exists" });
    } else {
      if (
        name === dischargecheck.patientName &&
        timings === dischargecheck.timings
      ) {
        res.json({ message: "patient discharged" });
      } else {
        res.json({ message: "patient not discharged" });
      }
    }
  } catch (e) {
    console.error(e);
    res.json({ message: e });

    throw e;
  }
});
app.post("/insert", async (req, res) => {
  try {
    const name = req.body.name;
    const timings = req.body.timings;

    const insertedRows = await db("doctor")
      .insert({ patientName: name, timings: timings })
      .returning("*");

    res.json({ data: insertedRows });
  } catch (e) {
    console.error(e);
    res.json({ message: e });

    throw e;
  }
});

// async function bookingverification(req, res, next) {
//   const name = req.body.name;
//   const timings = req.body.timings;
//   const checkpatient = await db("doctor")
//     .where("patientName", name)
//     .where("timings", timings)
//     .first();
//   if (checkpatient) {
//     res.json({ message: "patient exists" });
//     req.patient = checkpatient;
//     next();
//   } else {
//     res.json({ message: "patient not exists" });
//   }
// }
