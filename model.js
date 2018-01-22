const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bikesDatabase');

const Bike = mongoose.model('Bike', {id: Number, title: String, frame: String, price: String, type: String, createdAt: Date, updatedAt: Date});

console.log('yo');

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
    update: function(){

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