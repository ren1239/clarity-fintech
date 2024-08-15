const { Client } = require("pg");
const client = new Client({
  host: "aws-0-us-west-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.rhbhyefdyzmzugsdincq", // Replace with your Supabase username
  password: "W7l9KDynLOd2VSDt", // Replace with your Supabase password
  database: "postgres", // Replace with your Supabase database name
  ssl: {
    rejectUnauthorized: false, // Set to true if you have the correct SSL certificates
  },
});

client
  .connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Connection error", err.stack));
