"use strict";

const { BusinessPartner } = require('@sap/cloud-sdk-vdm-business-partner-service');
const express = require("express");

async function getAllBusinessPartners(){
    return BusinessPartner.requestBuilder()
        .getAll()
        // .select(
        //     BusinessPartner.BUSINESS_PARTNER,
        //     BusinessPartner.FIRST_NAME,
        //     BusinessPartner.LAST_NAME
        // )
        // .filter(
        //     BusinessPartner.BUSINESS_PARTNER_CATEGORY.equals('1')
        // )
        .execute({
            //destinationName: "S4C"
            destinationConfiguration: {
                test: "test",
                url: "https://88.99.149.214:44300",
                username: "CLOUD",
                password: "309524be90f9e1270dc3cbad146d04d8",
                usage: "pt_system",
                isTrustingAllCertificates: true,
                Name: "CentralPTSystem",
                Description: "Central PT S4HANA",
                URL: "http://centra.pt.system:44300"
            }
        });
}

module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        getAllBusinessPartners()
            .then(businessPartners => {
                res.status(200).send(businessPartners);
            })
            .catch(error => {
                res.status(500).send(error.stack);
            })
    });

    return app;
};




