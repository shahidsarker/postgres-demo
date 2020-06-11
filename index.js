require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

//use the same hat definition as before
const Hat = sequelize.define("hat", {
  name: Sequelize.STRING,
  material: Sequelize.STRING,
  height: Sequelize.INTEGER,
  brim: Sequelize.BOOLEAN,
});
//define a simple person model
const Person = sequelize.define("person", { name: Sequelize.STRING });
//a person can have many hats...
Person.hasMany(Hat);
//... but a hat belongs to a single person.
Hat.belongsTo(Person);

//sync the models
sequelize
  .sync()
  .then(function () {
    //then create a person
    //turns into INSERT INTO "people" ("id", "name") VALUES (DEFAULT, 'Jane Smith')
    return Person.create({ name: "Jane Smith" });
  })
  .then(function (person) {
    //then create a hat for that person
    //turns into INSERT INTO "hats" ("id", "name", "material", "height", "brim", "personId") // VALUES (DEFAULT, 'cowboy', 'straw', 3, true, 1) RETURNING *;
    return person.createHat({
      name: "cowboy",
      material: "straw",
      height: 3,
      brim: true,
    });
  });
