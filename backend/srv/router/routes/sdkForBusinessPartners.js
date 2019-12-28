"use strict";

const { BusinessPartner } = require('@sap/cloud-sdk-vdm-business-partner-service');
const express = require("express");

async function getAllBusinessPartners(){
    return BusinessPartner.requestBuilder()
        .getAll()
        .select(
            BusinessPartner.BUSINESS_PARTNER,
            BusinessPartner.FIRST_NAME,
            BusinessPartner.LAST_NAME
        )
        .filter(
            BusinessPartner.BUSINESS_PARTNER_CATEGORY.equals('1')
        )
        .execute({
            destinationName: "E01"
        });
}

module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res) =>{
        getAllBusinessPartners()
            .then(businessPartners => {
                res.status(200).send(businessPartners);
            })
            .catch(error => {
                res.status(500).send(error.message);
            });
    });

    return app;
};

