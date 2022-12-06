$(function () {
    let start = 9;
    let end = 18;
  
    const startTime = $('#select1');
    const endTime = $('#select2');
  
    const savedTimes = getTimesFromLocalStorage();
    if (savedTimes){
      startTime.val(savedTimes.start);
      endTime.val(savedTimes.end);
      start = savedTimes.start;
      end = savedTimes.end;
    }
  
    const onTimeChange = () => {
      const start = parseInt(startTime.val());
      const end = parseInt(endTime.val());
      if (start > end) return;
      saveTimesToLocalStorage(start, end)
      init(start, end);
    }
    startTime.change(onTimeChange);
    endTime.change(onTimeChange)


    init(start, end);
});




function init(startTime, endTime) {
    initTimeDivs(startTime, endTime);
    initTimeClases();
    initSaveButtons();
    initSavedEvents();
}


function initTimeDivs(start, end) {
    const container = $("#container");
    container.html("");
    for (let i = start; i <= end; i++) {
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

    const timeNow = dayjs().hour();
    timeBlocks.addClass(index=>{
        const id = parseInt(timeBlocks[index].id.substring(5));
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
    const timeBlocks = $("#container").children();

    timeBlocks.children("button").click((e) => {
        const parent = $(e.target).parent();
        const id = parent.prop("id");
        const textValue = parent.children("textarea").val();
        saveEventToLocalStorage(textValue, id);
      });
}

const initSavedEvents = () => {
    const timeBlocks = $("#container").children();

    timeBlocks.children("textarea").val((index) => {
        const id = timeBlocks[index].id;
        return getEventFromLocalStorage(id);
      });
    
}

const saveEventToLocalStorage = (data, id) => {
    let newData;
    const ls = JSON.parse(localStorage.getItem("data"));
    if (ls) {
      const entryExits = ls.find((entry) => {
        return entry.id === id;
      });
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
    localStorage.setItem('times', JSON.stringify({start, end}))
  }
  const getTimesFromLocalStorage = () => {
    const times = JSON.parse(localStorage.getItem('times'))
    if (times){
      return times;
    }
    return null;
  }