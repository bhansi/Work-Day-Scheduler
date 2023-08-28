$(function () {
  let descriptions = ["", "", "", "", "", "", "", "", ""];

  function retreiveDescriptions() {
    // Getting the descriptions from local storage
    let storedDescriptions = localStorage.getItem("descriptions");
    if(!storedDescriptions) { return; }
    descriptions = JSON.parse(storedDescriptions).slice();

    // Displaying the descriptions to the user
    $(".description").each(function() {
      let index = Number($(this).parent().attr("id").slice(5)) - 9;
      $(this).val(descriptions[index]);
    });
  }

  // Retrieve descriptions from local storage each time the page is refreshed
  retreiveDescriptions();

  // Updates the date at the top of the page
  function updateDate() {
    let dateString = dayjs().format("dddd, MMMM DD");

    // Logic to add st, nd, rd, or th at the end of a day number (e.g. 28th)
    switch(dayjs().date()) {
      case 1:
        dateString += "st";
        break;
      case 2:
        dateString += "nd";
        break;
      case 3:
        dateString += "rd";
        break;
      default:
        dateString += "th";
    }

    $("#currentDay").text(dateString);
  }

  function updateDescriptionBackgroundColors() {
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
  }
  
  // Function to calculate how much time to the next hour so the page can update
  function pageTimeout() {
    let startTime = new Date();

    let endTime = new Date();
    // Set the end time to the start of the next hour
    endTime.setHours(endTime.getHours() + 1);
    endTime.setMinutes(0);
    endTime.setSeconds(0);

    setTimeout(updatePage, endTime - startTime);
  }

  // Calls all the functions needed to update the page
  function updatePage() {
    updateDate();
    updateDescriptionBackgroundColors();
    pageTimeout();
  }
  
  updatePage();

  function handleSaveButton() {
    // Get the index from the parent element's id (hour number minus 9) and save the value at said index
    let index = Number($(this).parent().attr("id").slice(5)) - 9;
    // Get value from description that's associated with this save button
    descriptions[index] = $(this).prev().val();

    localStorage.setItem("descriptions", JSON.stringify(descriptions));
    
    // Show 'saved' for 3 seconds in the save button before hiding it again
    $(this).children().eq(0).hide();
    $(this).children().eq(1).fadeIn();
    setTimeout(function() {
      $(".saved:visible").hide()
      $(".fa-save:hidden").fadeIn();
    }, 3000);
  }
  
  // Clears all of the description elements and local storage
  function handleClearButton() {
    $(".description").val("");
    descriptions = ["", "", "", "", "", "", "", "", ""];
    localStorage.setItem("descriptions", JSON.stringify(descriptions));
  }

  $(".saveBtn").on("click", handleSaveButton);
  $("#clearBtn").on("click", handleClearButton);
});
