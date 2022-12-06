$(function () {
    initTimeClases();
    initSaveButtons();
  
});


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