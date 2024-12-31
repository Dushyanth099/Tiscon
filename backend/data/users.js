import bcrypt from "bcryptjs";
const Users = [
  {
    name: "Anbu",
    email: "Anbu@gmail.com",
    password: bcrypt.hashSync("Anbu@123", 12),
    isAdmin: true,
  },
  {
    name: "Souhail Ouabou",
    email: "Ouabou.souhail@ump.ac.com",
    password: bcrypt.hashSync("souhail2020", 12),
    isAdmin: true,
  },
  {
    name: "Soufian Zaam",
    email: "Soufian.Zaam@ump.ac.com",
    password: bcrypt.hashSync("zaam2020", 12),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "JohnDoe2@gmail.com",
    password: bcrypt.hashSync("doe2020", 12),
    isAdmin: false,
  },
  {
    name: "Dharsh",
    email: "Dharsh@gmail.com",
    password: bcrypt.hashSync("Dharsh@123", 12),
    isAdmin: false,
  },
];
export default Users;
