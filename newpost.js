const knex = require("knex");
const bcrypt = require("bcryptjs");

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

app.delete("/deletepost", async (req, res) => {
  const id = req.body.id;
  const token = await db("posts").where({ id }).del();
  res.json({ token });
});
app.patch("/updatepost", async (req, res) => {
  const { id, title } = req.body;
  const token = await db("posts").where({ id: id }).update({
    title: title,
  });
  res.json({ token });
});

app.get("/applytoken", getverification, async (req, res) => {
  const id = req.user;
  const data = await db.select("*").from("posts").where("id", id);
  console.table(data);
  res.json({ data });
});

// app.post("/createpost", async (req, res) => {
//   const { id, title, content } = req.body;
//   if (!id || !title || !content) {
//     return res.status(400).json({ message: "id ,title&content required" });
//   } else {
//     const user = await db("posts").where("id", id).first();
//     if (user) {
//       //   res.json({ message: "id exists", user });
//       res.redirect(`/loginApi?id=${id}`);
//         } else {
//         await db("posts").insert({ id, title, content });
//       res
//         .status(201)
//         .json({ message: "id not found so registration done check db" });
//     }
//   }
// });

// app.get("/loginApi", async (req, res) => {
//   const { id } = req.query;
//   //   const token = jwt.sign(id, secret); //
//   // res.json({ token });
//   if (!id) {
//     return res.status(400).json({ message: "id required" });
//   } else {
//     const user = await db("posts").where("id", id).first();
//     if (user) {
//       await db("posts").insert({ id, title, content });

//       res.json({ message: "login success" });
//     } else {
//       res.status(201).json({ message: "login failed id not found" });
//     }
//   }
// });

app.post("/login", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "id is required for login" });
  }
  const user = await db("posts").where("id", id).first();
  console.log(user.id);
  if (user) {
    const token = jwt.sign(user.id, secret);
    res.json({
      message: "Login successful use jwt token to create post",
      token,
    });
  } else {
    res.status(404).json({ message: "User not found, login failed" });
  }
});

app.post("/createpost", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "title & content required" });
  }
  if (req.user) {
    const createdPost = await db("posts")
      .insert({ title, content })
      .returning("*");
    res.json({ message: "post created", createdPost });
  } else {
    res.json({ msg: "verification failed" });
  }
});
function getverification(req, res, next) {
  let header = req.headers.authorization;
  header = header.split(" ")[1];
  if (header) {
    jwt.verify(header, secret, (err, data) => {
      if (err) {
        res.status(403).send("Forbidden");
      } else {
        req.user = data;
        next();
      }
    });
  }
}
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
