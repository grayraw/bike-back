const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bikesDatabase');

const Bike = mongoose.model('Bike', {id: Number, title: String, frame: String, price: String, type: String, createdAt: Date, updatedAt: Date});

module.exports = {
    list: function(){
        return Bike.find({}, (err, docs)=>{
            if (err) return err;
            return docs;
        })
    },
    create: function(bike){
        const newBike = new Bike(bike);
        return newBike.save().then(()=>{
            console.log('Bike saved')
        })
    },
    find: function(id){
        return Bike.find({id: id}, (err, docs)=>{
            if(err) return err;
            return docs;
        })
    },
    update: function(bike){
        return Bike.find({id: bike.id}, (err, bikeInDatabase)=>{
            // bikeInDatabase = {...bikeInDatabase, ...bike}; 

            if(err) return err;

            console.log(bikeInDatabase);

            for (var key in bike) {
                if (bike.hasOwnProperty(key)) {
                    bikeInDatabase[0][key] = bike[key];
                }
            };

            return bikeInDatabase[0].save((err, bike)=>{
                return bike
            })
        })

    },
    remove: function(){

    },
    getLatestID: function(){
        return Bike.count({}, (err, count)=>{
            if (err) return err;
            console.log(count);
            return count + 1;
        })
    }
}