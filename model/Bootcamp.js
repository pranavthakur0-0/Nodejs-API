const mongoos = require('mongoose');
const slugify = require('slugify')
const geocoder = require('../ultis/geocoder')

const BootcampSchema = new mongoos.Schema({
    name : {
        type : String,
        required : [true, 'Please add name'],
        unique : true,
        trim: true,
        maxlenght : [50, 'Name cannnot be more than 50 char']
    },
    slug : String,

    description : {
        type : String,
        required : [true, 'Please add name'],
        maxlenght : [1000, 'Description cannnot be more than 500 char']
    },
    website : {
        type:String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
          ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
      },
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      averageCost:{
        type: Number,
      },
      address: {
        type: String,
        required: [true, 'Please add an address']
      },
      location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
    
});

BootcampSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower:true});
  next();
})

//Geocoder & cerate location field
BootcampSchema.pre('save', async function(next){
  const loc =  await geocoder.geocode(this.address);
  this.location = {
    type : "Point",
    coordinates : [loc[0].longitude, loc[0].latitude],
    formattedAddress : loc[0].formattedAddress,
    street : loc[0].streetName,
    city : loc[0].city,
    state : loc[0].stateCode,
    zipcode : loc[0].zipcode,
    country : loc[0].countryCode,

  }
  //we don't have any need of address
  this.address = undefined;
  next();
})

module.exports = mongoos.model('Bootcamp', BootcampSchema);

