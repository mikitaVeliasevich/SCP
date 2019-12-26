"use strict";

module.exports = (app, server) => {
    app.use("/employees", require("./routes/employees")());
    //app.use("/positions", require("./routes/positions")());
};
