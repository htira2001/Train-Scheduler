// Initialize Firebase //
var config = {
  apiKey: "AIzaSyBSYoT-msRxGNxo-SF_-ZGO1Uvt3ZpBx9I",
  authDomain: "train-scheduler-bc4af.firebaseapp.com",
  databaseURL: "https://train-scheduler-bc4af.firebaseio.com",
  projectId: "train-scheduler-bc4af",
  storageBucket: "train-scheduler-bc4af.appspot.com",
  messagingSenderId: "860914498739"
};
firebase.initializeApp(config);

  // Assigning the reference to the database to a variable named 'database' //
  
 let database = firebase.database(); 

 // Show current time //
 
 let datetime = null,
 date = null;
 
 var update = function () {
   date = moment(new Date())
   datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
 };
 
 $(document).ready(function(){
   datetime = $('#currentStatus')
   update();
   setInterval(update, 1000);
 
 });
let name = "";
let destination = "";
let startTime = 0;
let frequency = 0; 

// Button for adding trains //

$("#addTrain").on("click", function(event) {
    event.preventDefault();

// Grab user input from "Add Train" section //

name = $("#trainNameInput").val().trim();
destination = $("#trainDestination").val().trim();
startTime = $("#startTime").val().trim();
frequency = $("#trainFrequency").val().trim();

console.log(name);
console.log(destination);
console.log(startTime);
console.log(frequency);

// Uploading train data to firebase database // 

database.ref().push({
    name: name, 
    destination: destination, 
    startTime: startTime, 
    frequency: frequency
});

// Need to clear out all of the text boxes in the "Add Train" section // 

$("#trainNameInput").val("");
$("#trainDestination").val(""); 
$("#startTime").val("");
$("#trainFrequency").val(""); 

}); 

// Clear button reset (will clear out all of the text boxes without a page refresh //

$("#clearTrain").on("click", function(event) {
    event.preventDefault();

    $("#trainNameInput").val("");
    $("#trainDestination").val(""); 
    $("#startTime").val("");
    $("#trainFrequency").val(""); 

}); 

// Creating a way to retrieve train information from train database // 

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

// Defining Time Variables //

let getName = childSnapshot.val().name; 
let getDestination = childSnapshot.val().destination;
let getTime = childSnapshot.val().startTime;
let getFrequency = parseInt(childSnapshot.val().frequency); 

// Calculating the time of next train arrival, and the minute until the next train arrives. 

let currentTime = moment();

    console.log("Current Time: " + moment(currentTime).format("HH:mm"));

// Used this as first time (pushed back 1 year to make sure it comes before current time)    
let convertedFirstTime = moment(getTime, "hh:mm").subtract(1, "years");
    console.log(convertedFirstTime);

// Difference between the start time and the current time //
let diffTime = moment().diff(moment(convertedFirstTime), "minutes");

    console.log("Difference in the time: " + diffTime) ;

// Divide the difference by the frequency to get the time apart remainder //

let tRemainder = diffTime % getFrequency;

    console.log(tRemainder);

// Figure out when the next train will come by subracting the time remainder from the frequency of when each train comes //

let minutesAway = getFrequency - tRemainder; 

    console.log("Minutes until train " + minutesAway);

// Figure out when the next train will come by adding the minutes from arrival to current time //

let nextTrain = moment().add(minutesAway, "minutes");

    console.log(nextTrain);

// Store arrival time in a usable format //

let nextArrival = moment(nextTrain, "HHmm").format("h:mm A");

// Adding entry to the "Add Train" section //

let row = $('<tr>');

row.append('<td>' + getName + "</td>")
row.append('<td>' + getDestination + "</td>")
row.append('<td>' + "Every " + getFrequency + " mins" + "</td>")
row.append('<td>' + nextArrival + "</td>")
row.append('<td>' + minutesAway +  " mins until arrival" + "</td>")

$("#trainTable > tbody").append(row)


});
