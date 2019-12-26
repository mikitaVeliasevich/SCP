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
        tracer.entering("/employee", req, res);

        try {
            const db = new dbClass(req.db);
            const employees = await db.selectAllData("EMPLOYEE");
            tracer.exiting("/employees", "Employees Get works");
            res.type("application/json").status(201).send(JSON.stringify(employees));
        } catch (e) {
            tracer.catching("/Employee", e);
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oEmployee = _prepareObject(req.body, req);
				    oEmployee.usid = await db.getNextval("eid");

            const sSql = "INSERT INTO \"EMPLOYEE\" VALUES(?,?)";
						const aValues = [ oEmployee.eid, oEmployee.name ];

						console.log(aValues);
						console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oUser));
        } catch (e) {
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);

            const oUser = _prepareObject(req.body, req);
            const sSql = "UPDATE \"EMPLOYEE\" SET \"NAME\" = ? WHERE \"EID\" = ?";
						const aValues = [ oEmployee.name, oEmployee.eid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send(JSON.stringify(oUser));
        } catch (e) {
            next(e);
        }
    });

    return app;
};
