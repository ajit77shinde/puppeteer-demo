// create // findAll// findOne // update // delete // deleteAll // findAllPublished
const dbs = require("../models");
const Tutorial = dbs.tutorials;

// Create and Save a new Tutorial
exports.create = (req: { body: { title: any; description: any; published: any; }; },
    res: {
        status: (arg0: number) => {
            (): any; new(): any; send: { (arg0: { message: any; }): void; new(): any; };
        }; send: (arg0: any) => void;
    }) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Tutorial
    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    });

    // Save Tutorial in the database
    tutorial
        .save(tutorial)
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: { message: any; }) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req: { query: { title: any; }; }, 
    res: { send: (arg0: any) => void; status: (arg0: number) => { 
        (): any; new(): any; send: { (arg0: { message: any; }): void; new(): any; }; }; }) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Tutorial.find(condition)
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: { message: any; }) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Find a single Tutorial with an id
// exports.findOne = (req: any, res: any) => {

// };

// // Update a Tutorial by the id in the request
// exports.update = (req: any, res: any) => {

// };

// // Delete a Tutorial with the specified id in the request
// exports.delete = (req: any, res: any) => {

// };

// // Delete all Tutorials from the database.
// exports.deleteAll = (req: any, res: any) => {

// };

// // Find all published Tutorials
// exports.findAllPublished = (req: any, res: any) => {

// };