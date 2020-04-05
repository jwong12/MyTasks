
const datepicker = require('js-datepicker');

const start = datepicker('#datefrom', { 
    id: 1,
    onSelect: instance => {
        // Show which date was selected.
        console.log(instance.dateSelected);
    },
});

const end = datepicker('#dateto', { 
    id: 1,
    onSelect: instance => {
        // Show which date was selected.
        console.log(instance.dateSelected);
    },
});

start.calendarContainer.style.setProperty('font-size', '1.6rem');
end.calendarContainer.style.setProperty('font-size', '1.6rem');

start.getRange(); // { start: <JS date object>, end: <JS date object> }
end.getRange(); 