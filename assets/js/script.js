// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  let descriptions = ["", "", "", "", "", "", "", "", ""];

  function retreiveDescriptions() {
    // Getting the descriptions from local storage
    descriptions = JSON.parse(localStorage.getItem("descriptions")).slice();

    // Displaying the descriptions to the user
    $(".description").each(function() {
      let index = Number($(this).parent().attr("id").slice(5)) - 9;
      $(this).val(descriptions[index]);
    });
  }

  retreiveDescriptions();

  function setDescriptionBackgroundColors() {
    $(".description").each(function() {
      // Remove existing class
      if($(this).hasClass("past")) { $(this).removeClass("past"); }
      else if($(this).hasClass("present")) { $(this).removeClass("present"); }
      else { $(this).removeClass("future"); }

      // Add a new class according to the hour stamp and current hour
      let hour = Number($(this).parent().attr("id").slice(5));
      if(hour < dayjs().hour()) {
        $(this).addClass("past");
      }
      else if(hour === dayjs().hour()) {
        $(this).addClass("present");
      }
      else {
        $(this).addClass("future");
      }
    });
    descriptionBackgroundColorTimeout();
  }

  setDescriptionBackgroundColors();

  function descriptionBackgroundColorTimeout() {
    let startTime = new Date();
    let endTime = new Date();
    endTime.setHours(endTime.getHours() + 1);
    endTime.setMinutes(0);
    endTime.setSeconds(0);
    console.log(startTime);
    console.log(endTime);
    console.log(endTime - startTime);
    setTimeout(setDescriptionBackgroundColors, endTime - startTime);
  }

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.

  function handleSaveButton() {
    // Get the index from the parent element's id (hour number minus 9) and save the value at said index
    let index = Number($(this).parent().attr("id").slice(5)) - 9;
    descriptions[index] = $(this).prev().val();

    localStorage.setItem("descriptions", JSON.stringify(descriptions));
  }

  $(".saveBtn").on("click", handleSaveButton);
});
