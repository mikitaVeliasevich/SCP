/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oEmployee, req) {
		oEmployee.changedBy = "DebugUser";
    return oEmployee;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('employees get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/employees", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"EMPLOYEE\"";
            const employees = await db.executeUpdate(sSql, []);
            tracer.exiting("/employees", "Employees Get works");
            res.type("application/json").status(201).send(JSON.stringify(employees));
        } catch (e) {
            tracer.catching("/employees", e);
            next(e);
        }
    });

    app.get("/:eid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const eid = req.params.eid;

            const sSql = "SELECT * FROM \"EMPLOYEE\" WHERE \"EID\" = ?";
            const aValues = [ eid ];

            console.log(aValues);
            console.log(sSql);
            const oEmployee = await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oEmployee));
        } catch (e) {
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            console.log(req.body);
            const oEmployee = _prepareObject(req.body, req);
            console.log(oEmployee);
                  //oEmployee.eid = await db.getNextval("eid");
            const sSql = "INSERT INTO \"EMPLOYEE\" VALUES(?,?,?,?,?,?)";
            const aValues = [ oEmployee.eid, oEmployee.pid, oEmployee.name, oEmployee.surname, oEmployee.email, oEmployee.phoneNumber ];

						console.log(aValues);
						console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oEmployee));
        } catch (e) {
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oEmployee = _prepareObject(req.body, req);
            const sSql = "UPDATE \"EMPLOYEE\" SET \"PID\" = ?, \"NAME\" = ?, \"SURNAME\" = ?, \"EMAIL\" = ?, \"PHONENUMBER\" = ?  WHERE \"EID\" = ?";

            console.log(oEmployee);
            const aValues = [ oEmployee.eid, oEmployee.pid,  oEmployee.name, oEmployee.surname, oEmployee.email, oEmployee.phoneNumber];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send(JSON.stringify("Success"));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:eid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const eid = req.params.eid;
            console.log(req.params.eid)

            const sSql = "DELETE FROM \"EMPLOYEE\" WHERE \"EID\" = ?";
            const aValues = [ eid ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send("Success");
        } catch (e) {
            next(e);
        }
    });

    return app;
};
