
const datepicker = require('js-datepicker');

const start = datepicker('#datefrom', { 
    id: 1,
    onSelect: instance => {
        // Show which date was selected.
        console.log(instance.dateSelected)
        console.log(typeof instance.dateSelected)
        console.log(new Date());
        console.log(typeof new Date());
    },
});
const end = datepicker('#dateto', { 
    id: 1,
    onSelect: instance => {
        // Show which date was selected.
        console.log(instance.dateSelected)
        console.log(typeof instance.dateSelected)
    },
});
start.getRange(); // { start: <JS date object>, end: <JS date object> }
end.getRange(); // Gives you the same as above!

// const picker = datepicker('#date-from', {
//     // Event callbacks.
//     onSelect: instance => {
//       // Show which date was selected.
//       console.log(instance.dateSelected)
//     },
//     onShow: instance => {
//       console.log('Calendar showing.')
//     },
//     onHide: instance => {
//       console.log('Calendar hidden.')
//     },
//     onMonthChange: instance => {
//       // Show the month of the selected date.
//       console.log(instance.currentMonthName)
//     },
   
//     // Customizations.
//     formatter: (input, date, instance) => {
//       // This will display the date as `1/1/2019`.
//       input.value = date.toDateString()
//     },
//     position: 'tr', // Top right.
//     startDay: 1, // Calendar week starts on a Monday.
//     customDays: ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
//     customMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     customOverlayMonths: ['😀', '😂', '😎', '😍', '🤩', '😜', '😬', '😳', '🤪', '🤓 ', '😝', '😮'],
//     overlayButton: 'Go!',
//     overlayPlaceholder: 'Enter a 4-digit year',
   
//     // Settings.
//     alwaysShow: true, // Never hide the calendar.
//     dateSelected: new Date(), // Today is selected.
//     maxDate: new Date(2099, 0, 1), // Jan 1st, 2099.
//     minDate: new Date(2016, 5, 1), // June 1st, 2016.
//     startDate: new Date(), // This month.
//     showAllDates: true, // Numbers for leading & trailing days outside the current month will show.
   
//     // Disabling things.
//     noWeekends: true, // Saturday's and Sunday's will be unselectable.
//     disabler: date => (date.getDay() === 2 && date.getMonth() === 9), // Disabled every Tuesday in October
//     disabledDates: [new Date(2050, 0, 1), new Date(2050, 0, 3)], // Specific disabled dates.
//     disableMobile: true, // Conditionally disabled on mobile devices.
//     disableYearOverlay: true, // Clicking the year or month will *not* bring up the year overlay.
   
//     // ID - be sure to provide a 2nd picker with the same id to create a daterange pair.
//     id: 1
//   })