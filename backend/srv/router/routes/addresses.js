/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

const dbClass = require(global.__base + "utils/dbClass");


function _prepareObject(oAddress, req) {
    oAddress.changedBy = "DebugUser";
    return oAddress;
}


module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        const logger = req.loggingContext.getLogger("/Application");
        logger.info('addresses get request');
        let tracer = req.loggingContext.getTracer(__filename);
        tracer.entering("/addresses", req, res);

        try {
            const db = new dbClass(req.db);
            const sSql = "SELECT * FROM \"ADDRESS\"";
            const employees = await db.executeUpdate(sSql, []);
            tracer.exiting("/addresses", "Addresses Get works");
            res.type("application/json").status(201).send(JSON.stringify(employees));
        } catch (e) {
            tracer.catching("/addresses", e);
            next(e);
        }
    });

    app.get("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;

            const sSql = "SELECT * FROM \"ADDRESS\" WHERE \"ADID\" = ?";
            const aValues = [ adid ];

            console.log(aValues);
            console.log(sSql);
            const oAddress = await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oAddress));
        } catch (e) {
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const oAddress = _prepareObject(req.body, req);
            const sSql = "INSERT INTO \"ADDRESS\" VALUES(?,?,?,?,?,?)";
            const aValues = [ oAddress.adid, oAddress.eid, oAddress.city, oAddress.street, oAddress.housenum, oAddress.flatnum ];

            console.log(aValues);
            console.log(sSql);
            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(201).send(JSON.stringify(oAddress));
        } catch (e) {
            next(e);
        }
    });

    app.put("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;

            const oAddress = _prepareObject(req.body, req);
            console.log(req.body);
            const sSql = "UPDATE \"ADDRESS\" SET \"EID\" = ?, \"CITY\" = ?, \"STREET\" = ?, \"HOUSENUM\" = ?, \"FLATNUM\" = ?  WHERE \"ADID\" = ?";
            const aValues = [  oAddress.eid, oAddress.city, oAddress.street, oAddress.housenum, oAddress.flatnum, oAddress.adid = adid ];

            await db.executeUpdate(sSql, aValues);

            res.type("application/json").status(200).send("Success");
        } catch (e) {
            next(e);
        }
    });

    app.delete("/:adid", async (req, res, next) => {
        try {
            const db = new dbClass(req.db);
            const adid = req.params.adid;
            console.log(req.params.adid)

            const sSql = "DELETE FROM \"ADDRESS\" WHERE \"ADID\" = ?";
            const aValues = [ adid ];

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
