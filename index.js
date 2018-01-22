var restify = require('restify');
var model = require('./model.js');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();

server.use(restify.plugins.bodyParser())


server.get('/list', (req,res,next)=>{

    model.list().then((bikes)=>{
        res.send(bikes);
    })
    next();
})

//Get bike by ID
server.get('/:id', (req,res,next)=>{
    model.find(req.params.id).then((bikes)=>{
        console.log(bikes);
        if(bikes.length === 0){
            res.send('No bike found')
        } else {
            res.send(bikes)
        }
    })
    next();
});

//Create a new bike with params from post body and a new ID
server.post('/create', (req, res, next)=>{
    model.getLatestID().then((id)=>{
        let newBike = req.body;
        newBike.id = id;
        console.log(newBike);
        model.create(req.body).then((response)=>{
            console.log(response);

            res.send(req.body);
            next();
        });
    });
    
});

//Save changes to a bike
server.patch('/update', (req,res,next)=>{
    model.update(req.body).then((response)=>{
        res.send(response);
    })
    next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
  
  model.list().then((res)=>{
    console.log(res);
  })
});