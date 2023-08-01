const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');
admin.initializeApp();


exports.api = onRequest((req, res) => {
    switch (req.method) {
        case "GET":
            res.send('GET request')
        case "POST":
            res.send(req.body)
        case "DELETE":
            res.send('DELETE request')
        case "PUT":
            res.send("PUT request")
    }
})

exports.getAll = onRequest(async (req, res) => {
    let data = [];
    const collRef = await admin.firestore().collection('locations').get();
    collRef.forEach(doc => {
        data.push(doc.data())
    });
    res.send(data);
})

exports.getByName = onRequest(async (req, res) => {
    const { name } = req.body;
    let data = [];
    const collRef = await admin.firestore().collection('notes').where('name', '==', name).get();
    collRef.forEach(doc => {
        data.push(doc.data())
    });
    res.send(data);
})

exports.deleteByName = onRequest(async (req, res) => {
    const { name } = req.body;
    const collRef = await admin.firestore().collection('notes').where('name', '==', name).get();
    collRef.forEach(doc => {
        doc.ref.delete();
    });
    res.send("Data deleted!");
})

exports.create = onRequest(async (req, res) => {
    const { name, lat, lng, tags } = req.body;
    let data = [];
    const collRef = await admin.firestore().collection('notes').add({
        name: name,
        lat: lat,
        lng: lng,
        tags: [...tags]
    });

    res.send("Data created!");
})