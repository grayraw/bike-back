const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bikeModel = require('./bikeModel');

mongoose.connect('mongodb://localhost/bikesDatabase');

const bikeSchema = new mongoose.Schema(bikeModel);
bikeSchema.plugin(mongoosePaginate);

const Bike = mongoose.model('Bike', bikeSchema);



module.exports = {
    list(query = {}) {
        // debugger;
        let page = query.page ? parseInt(query.page) : 1;
        delete query.page;
        return Bike.paginate(query, { page, limit: 3 }, (err, docs) => {
            if (err) return err;
            return docs;
        })
    },

    getUniqueValuesForParams(params) {
        let valuesArray = [];
        params.forEach((param) => {
            valuesArray.push(
                Bike.find({})
                    .distinct(param)
                    .exec()
            )
        });
        return Promise.all(valuesArray);

    },
    //takes an object {param: value} i.e. {"brand": "Giant"}
    getByParam(requestObject) {
        return Bike.find(requestObject, (err, docs) => {
            if (err) return err;
            return docs;
        })
    },
    create(bike) {
        const newBike = new Bike(bike);
        return newBike.save().then(() => {
            console.log('Bike saved')
        })
    },
    getById(id) {
        return Bike.find({ id: id }, (err, docs) => {
            if (err) return err;
            return docs;
        })
    },
    update(bike) {
        return Bike.find({ id: bike.id }, (err, bikeInDatabase) => {
            if (err) return err;
            console.log(bikeInDatabase);

            for (var key in bike) {
                if (bike.hasOwnProperty(key)) {
                    bikeInDatabase[0][key] = bike[key];
                }
            };

            return bikeInDatabase[0].save((err, bike) => {
                return bike
            })
        })

    },
    remove() {

    },
    getLatestID() {
        return Bike.count({}, (err, count) => {
            if (err) return err;
            console.log(count);
            return count + 1;
        })
    }
}