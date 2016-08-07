//Add Stripe Key here
var live_secret_key = "";

var stripe = require("stripe")(live_secret_key);
var fs = require('fs');
var csv = require('fast-csv');

//filename here
var stream = fs.createReadStream("coupons.csv");

stream.pipe( csv().on("data", function(data){

  //adding a timeout as an easy hack to avoid hitting rate limits by stripe
    setTimeout(function(){

      stripe.coupons.retrieve(
        data[0],
        function(err, coupon){
          if(!coupon){
            stripe.coupons.create({
              amount_off: 7900,
              duration: 'once',
              id: data[0],
              max_redemptions: 1,
              currency: "USD"
            }, function(err, coupon) {
              // asynchronously called
              if(err){
                console.log(err);
              }else{
                console.log("Successfully created " + coupon.id)
              }
            }
          )}
        })}, 1000);
  })
  .on("end", function(){
    console.log("processed");
  })
);
