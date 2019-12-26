/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oPosition, req) {
    oPosition.changedBy = "DebugUser";
    return oPosition;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('positions get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/positions", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"POSITION\"";
            const positions = await db.executeUpdate(sSql, []);
            tracer.exiting("/positions", "Positions Get works");
            res.type("application/json").status(201).send(JSON.stringify(positions));
        } catch (e) {
            tracer.catching("/positions", e);
            next(e);
        }
    });

    app.get("/:pid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const pid = req.params.pid;

            const sSql = "SELECT * FROM \"POSITION\" WHERE \"PID\" = ?";
            const aValues = [ pid ];

            console.log(aValues);
            console.log(sSql);
            const oPosition = await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oPosition));
        } catch (e) {
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            console.log(req.body);
            const oPosition = _prepareObject(req.body, req);
            console.log(oPosition);
            const sSql = "INSERT INTO \"POSITION\" VALUES(?,?,?)";
            const aValues = [ oPosition.pid, oPosition.name, oPosition.salary ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oPosition));
        } catch (e) {
            next(e);
        }
    });

    app.put("/:pid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const pid = req.params.pid;
            const oPosition = _prepareObject(req.body, req);
            const sSql = "UPDATE \"POSITION\" SET \"NAME\" = ?, \"SALARY\" = ? WHERE \"PID\" = ?";

            console.log(oPosition);
            const aValues = [ oPosition.name, oPosition.salary,  oPosition.pid = pid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send(JSON.stringify("Success"));
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:pid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const pid = req.params.pid;
            console.log(req.params.pid)

            const sSql = "DELETE FROM \"POSITION\" WHERE \"PID\" = ?";
            const aValues = [ pid ];

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
