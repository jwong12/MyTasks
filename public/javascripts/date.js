
const datepicker = require('js-datepicker');

const date = datepicker('#date', { 
    id: 1,
    dateSelected: new Date(),
});

date.calendarContainer.style.setProperty('font-size', '1.6rem');
