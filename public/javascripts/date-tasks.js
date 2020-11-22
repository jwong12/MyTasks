
const datepicker = require('js-datepicker');

window.onload = () => {
    const tdDateDoms = document.getElementsByClassName('td-date');
    const thDateDom = document.getElementById('th-date');
    const thDateHeight = thDateDom.getBoundingClientRect().height;

    for (let i = 0; i < tdDateDoms.length; i++) {
        const tag = '#date-tasks' + i; 
        const tdDateHeight = tdDateDoms[i].getBoundingClientRect().height;
        const height = thDateHeight + ((i + 1) * tdDateHeight);

        const date = datepicker(tag, { 
            id: i,
            dateSelected: new Date(),
            onShow: instance => {
                instance.calendarContainer.style.setProperty('top', height + "px");
                instance.calendarContainer.style.setProperty('font-size', '1.6rem');
            },
            onSelect: (instance, date) => {
                const day = date.toString().slice(8,10);
                const fullDate = date.toString().slice(0,8) + (parseInt(day) < 10 ? day.slice(1,2) : day) + date.toString().slice(10,15);
                
                const obj = {
                    _id: tdDateDoms[i].getAttribute('title'),
                    date: fullDate
                }

                const jsonObj = JSON.stringify(obj);
        
                $.ajax({
                    url: '/api/tasks/update/:' + obj._id,
                    type: 'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: jsonObj,
                    success: () => {
                        tdDateDoms[i].textContent = obj.date;
                        date 
                    }
                });
            },
        }); 
    }
}