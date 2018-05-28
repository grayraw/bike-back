var restify = require('restify');
var model = require('./model.js');
const corsMiddleware = require('restify-cors-middleware')

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();

const cors = corsMiddleware({
    // preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
})
  
  server.pre(cors.preflight)
  server.use(cors.actual)

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

//try... catch..?
server.get('/filters', (req,res)=>{
    let filterList = ["frame", "type", "brand"]
    model.getUniqueValuesForParams(filterList)
    .then((values)=>{
        valuesWithTitles = [];
        values.forEach((filterArray, index)=>{
            
            let filterObjectsArray = [];
            filterArray.forEach(filter => {
                filterObjectsArray.push({
                    value: filter
                })
            });

            valuesWithTitles.push({
                title: filterList[index],
                values: filterObjectsArray
            });
        })
        res.send(valuesWithTitles);
    })
});


server.get('/list', (req,res,next)=>{
    let query = req.getQuery();
    model.list(req.query).then((bikes)=>{
        res.send(bikes);
    })
    next();
});

//Get bike by ID
// server.get('/:id', (req,res,next)=>{
//     model.find(req.params.id).then((bikes)=>{
//         console.log(bikes);
//         if(bikes.length === 0){
//             res.send('No bike found')
//         } else {
//             res.send(bikes)
//         }
//     })
//     next();
// });

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