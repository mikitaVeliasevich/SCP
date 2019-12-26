"use strict";

module.exports = (app, server) => {
    app.use("/employees", require("./routes/employees")());
    app.use("/addresses", require("./routes/addresses")());
    app.use("/positions", require("./routes/positions")());
    app.use("/dest", require("./routes/dest")());
};
