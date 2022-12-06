$(function () {
    // Default start and end times (9am, 6pm)
    let start = 9;
    let end = 18;

    //Select menus for changing work times
    const startTime = $('#select1');
    const endTime = $('#select2');

    //Setting start and end variables if there are saved times
    const savedTimes = getTimesFromLocalStorage();
    if (savedTimes){
      startTime.val(savedTimes.start);
      endTime.val(savedTimes.end);
      start = savedTimes.start;
      end = savedTimes.end;
    }

    // Change start and end times then updating the time blocks
    const onTimeChange = () => {
      const start = parseInt(startTime.val());
      const end = parseInt(endTime.val());
      if (start > end) return;
      // Saving times to be the same on page load
      saveTimesToLocalStorage(start, end)
      init(start, end);
    }
    startTime.change(onTimeChange);
    endTime.change(onTimeChange)
    // Showing current date 
    $("#currentDay").text(`${dayjs().format("dddd, MMMM Do")}`);

    // Initialising time blocks and functionality
    init(start, end);
});

const showSuccessMessage = async () => {

  $('#success').text('Saved to localstorage!')
  await new Promise(r=>setTimeout(r, 2000));
  $('#success').text('');
}


function init(startTime, endTime) {
    initTimeDivs(startTime, endTime);
    initTimeClases();
    initSaveButtons();
    initSavedEvents();
}


function initTimeDivs(start, end) {
    // Created time blocks based on start and end times
    const container = $("#container");
    container.html("");
    for (let i = start; i <= end; i++) {
        // i represents the time, loops over creating time blocks
      container.append(`
      <div id="hour-${i}" class="row time-block">
      <div class="col-2 col-md-1 hour text-center py-3">${dayjs()
        .hour(i)
        .format("h A")}</div>
      <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
      <button class="btn saveBtn col-2 col-md-1" aria-label="save">
        <i class="fas fa-save" aria-hidden="true"></i>
      </button>
    </div>`);
    }
  }


const initTimeClases = () => {
    const timeBlocks = $("#container").children();

    const timeNow = dayjs().hour(); // Current hour in 24 hour time
    timeBlocks.addClass(index=>{
        // Getting current time from each time block id.
        const id = parseInt(timeBlocks[index].id.substring(5)); // Substring removes 'hour-' from id
        if (id < timeNow) {
            return "past";
          }
          if (id > timeNow) {
            return "future";
          }
          if (id === timeNow) {
            return "present";
          }
    })
}


const initSaveButtons = () => {
    // Creating event listeners for each button in the time blocks that save to local storage
    const timeBlocks = $("#container").children();
    timeBlocks.children("button").click(async (e) => {
        const parent = $(e.target).parent();
        const id = parent.prop("id");
        const textValue = parent.children("textarea").val();
        await showSuccessMessage();
        saveEventToLocalStorage(textValue, id);
      });
}

const initSavedEvents = () => {
    // Adds saved events to each text area
    const timeBlocks = $("#container").children();

    timeBlocks.children("textarea").val((index) => {
        const id = timeBlocks[index].id;
        return getEventFromLocalStorage(id);
      });
    
}

const saveEventToLocalStorage = (data, id) => {
    // Saving events
    let newData;
    const ls = JSON.parse(localStorage.getItem("data"));
    if (ls) {
      const entryExits = ls.find((entry) => {
        return entry.id === id;
      }); // Checks if entry already exists for the timeblock and updates it
      if (entryExits) {
        newData = ls.map((entry) => {
          if (entry.id === id) {
            return { data, id };
          }
          return entry;
        });
      } else {
        newData = [...ls, { data, id }];
      }
    } else {
      newData = [{ data, id }];
    }
    localStorage.setItem("data", JSON.stringify(newData));
  };

  const getEventFromLocalStorage = (id) => {
    // Find event based on id, if not found returns empty string
    const ls = JSON.parse(localStorage.getItem("data"));
    let data = "";
    if (ls) {
      const find = ls.filter((item) => {
        return item.id === id;
      });
      if (find.length) {
        data = find[0].data;
      }
    }
    return data;
  };

  const saveTimesToLocalStorage = (start, end) => {
    // Saves default times to local storage
    localStorage.setItem('times', JSON.stringify({start, end}))
  }
  const getTimesFromLocalStorage = () => {
    // Gets default times from local storage
    const times = JSON.parse(localStorage.getItem('times'))
    if (times){
      return times;
    }
    return null;
  }