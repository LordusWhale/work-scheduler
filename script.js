$(function () {

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
});