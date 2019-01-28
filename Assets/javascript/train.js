$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAxbFDMQ1QqTzPFu1jvqceyV12HHlP9LKI",
    authDomain: "train-2ac77.firebaseapp.com",
    databaseURL: "https://train-2ac77.firebaseio.com",
    projectId: "train-2ac77",
    storageBucket: "train-2ac77.appspot.com",
    messagingSenderId: "311388538197"
  };
  firebase.initializeApp(config);


    // to rep the database
    var database = firebase.database();

    // button to submit the user given info
    $("#trainInfoButton").on("click", function (event) {

        event.preventDefault(); //no button reset

        // set user input values to variables
        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();

        // converts user input to usable info
        //var firstTime = moment($("#firstTime").val().trim(), "HH:mm").subtract(1, "years").format("X");
        //var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years");
        var firstTime = $("#firstTime").val().trim();
        var frequency = $("#freq").val().trim(); 

        // current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

         console.log(trainName);
         console.log(destination);
         console.log(firstTime);
         console.log(frequency);
         console.log(currentTime);

         //gathers together all our new train info

         var newTrain = {
                train: trainName,
                trainGoing: destination,
                trainComing: firstTime,
                everyXMin: frequency,

         };

            //uploads newTrain to Firebase
            database.ref().push(newTrain);
            //.push adds info, .set overwrites...
            
          console.log(newTrain.train);
          console.log(newTrain.trainGoing);
          console.log(newTrain.trainComing);
          console.log(newTrain.everyXMin);

            //clears before input
            $("#name").val("");
            $("#dest").val("");
            $("#firstTime").val("");
            $("#freq").val("");

            alert("A new train detail has been added...");

//no new page refresh
return false;

    }); //end of trainInfoButton onclick.

    //Creating a firebase event for adding train to the database and a row to the html...
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
      console.log(childSnapshot.val());
      //store in variables
      var trainName = childSnapshot.val().train;
      var destination = childSnapshot.val().trainGoing;
      var firstTime = childSnapshot.val().trainComing;
      var frequency = childSnapshot.val().everyXMin;

      console.log(trainName);
      console.log(destination);
      console.log(firstTime);
      console.log(frequency);

      //makes first train time neater (pushed back 1 year to ensure its before current time)
      //var trainTime = moment.unix(firstTime).format("HH:mm"); // to show in normal time
      //var trainTime = moment(firstTime).format("hh:mm");
      var trainTime = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log("converted first train time " + trainTime);

      //var firstTime = moment($("#firstTime").val().trim(), "HH:mm").subtract(1, "years").format("X");
     // console.log(firstTime);

      // calculates difference between first train time and the current time
      var difference = moment().diff(trainTime, "minutes");
      console.log(difference);

      //time apart (remainder)
      var remainder = difference % frequency;
      console.log("Remainder: " + remainder)
      
      //minutes until arrival
      var minUntil = frequency - remainder;
      console.log("Time Remaining: " + minUntil);

      //next arrival time
      //var nextArrival = moment().add(minUntil, "minutes").format("HH:mm");
      var nextArrival = moment().add(minUntil, "minutes");
      var nextArrivalFormatted = moment(nextArrival).format("HH:mm");
      console.log("Next Arrival Time: " + nextArrivalFormatted);

      // adding info to the DOM table
      $(".table").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrivalFormatted + "</td><td>" + minUntil + "</td></tr>");

    // why is the minutes difference not working? only works if time is less than 60 mins? 
    //Do I add firstTime to minutes rem?
    });

});