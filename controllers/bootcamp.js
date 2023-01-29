const Bootcamp = require('../model/Bootcamp');
const errorResponse = require('../ultis/errorresponse')
const asynchandler  = require('../middleware/async')

//@Desc       GET all bootcamps
//@Route      GET   /api/vi/bootcamps
//@Acess      Public
exports.getBootcamps = asynchandler (async (req, res, next)=>
    {
       
        let query;
        let reqquery = {...req.query};

        //FIelds to Exclude
        const  removeFields = ['select','sort','page','limit'];

        //Loop over remove fields and delete them form query
        removeFields.forEach(param => delete reqquery[param]);
         //Cerate query string
         let queryStr = JSON.stringify(reqquery);

        //Creating the operators
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);


        //Converting to JSON
        query = JSON.parse(queryStr);
        console.log(query);
        query = Bootcamp.find(query);

      
        //select fileds
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            console.log(fields);
            query =  query.select(fields);
        }

        //sort
        if(req.query.sort)
        {
            const sortby = req.query.sort.split(',').join(' ');
            query = query.sort(sortby);
        }

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 25;
            const startIndex = (page-1)*limit;
            const endIndex =  page*limit;
            const total  = await Bootcamp.countDocuments();
        
            query = query.skip(startIndex).limit(limit);




           //finding resource and Executing
        const bootcamp = await query;

        const pagniation = {}
        //pagniation result
        if(endIndex < total)
        {
            pagniation.next = {
                page: page+1,
                limit
            }
        }
        if(startIndex >  0)
        {
            pagniation.prev = {
                page: page-1,
                limit
            }
        }

        
        res.status(200).json({
            success : true,
            count : bootcamp.length,
            pagniation,
            data : bootcamp
        })
  })

//@Desc       GET single bootcamps
//@Route      GET   /api/vi/bootcamps
//@Acess      Public
exports.getBootcamp = asynchandler(async (req, res, next)=>
{

        const bootcamp = await Bootcamp.findById(req.params.id)
        res.status(200).json({
            success : true,
            data : bootcamp
            })
})


//@Desc       Create new  bootcamps
//@Route      POST   /api/vi/bootcamps
//@Acess      Private
exports.createBootcamp = asynchandler(async (req, res, next)=>
{
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
         success : true,
         data : bootcamp,
        })
})

//@Desc       Update  bootcamps
//@Route      PUT   /api/vi/bootcamps
//@Acess      Private
exports.updateBootcamp =asynchandler(async (req, res, next)=>
{
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body)
    if(!bootcamp)
    {
        res.status(404).json({success : false, data: req.body})
    }
    res.status(201).json({success : true,  data: req.body})
})


//@Desc       Delete  bootcamps
//@Route      DELETE   /api/vi/bootcamps
//@Acess      Private
exports.deleteBootcamp = async (req, res, next)=>
{

    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp)
        {
            res.status(404).json({
                success : false,
               })
               return res.status(201).json({success : true})
        }
        res.status(201).json({success : true,  data: req.body})
    } catch (error) {
        res.status(400).json({
            success :false
        })
    }
}