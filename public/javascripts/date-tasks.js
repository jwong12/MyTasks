
const datepicker = require('js-datepicker');

window.onload = () => {
    setTimeout(() => {
        const rowDoms = document.getElementsByClassName('row-task');

        for (let i = 0; i < rowDoms.length; i++) {
            const tag = '#date-tasks' + i; 

            datepicker(tag, { 
                id: i,
                dateSelected: new Date(),
                onShow: instance => {
                    const thDateDom = document.getElementById('th-date');
                    const rowHeight = rowDoms[instance.positionedEl.rowIndex - 1].getBoundingClientRect().height;
                    const height = thDateDom.getBoundingClientRect().height + instance.positionedEl.rowIndex * rowHeight;
                    rowDoms[instance.positionedEl.rowIndex - 1].childNodes[2].style.backgroundColor = '#fff5e7';
                    rowDoms[instance.positionedEl.rowIndex - 1].childNodes[2].style.fontWeight = 'bold';
                    instance.calendarContainer.style.setProperty('top', height + "px");
                    instance.calendarContainer.style.setProperty('font-size', '1.6rem');
                },
                onHide: instance => {
                    rowDoms[instance.positionedEl.rowIndex - 1].childNodes[2].style.backgroundColor = '#fcfeff';
                    rowDoms[instance.positionedEl.rowIndex - 1].childNodes[2].style.fontWeight = 'normal';
                },
                onSelect: (instance, date) => {
                    if (date) {
                        const day = date.toString().slice(8,10);
                        const fullDate = date.toString().slice(0,3) + ', ' + date.toString().slice(4,8) + (parseInt(day) < 10 ? day.slice(1,2) : day) + date.toString().slice(10,15);
                        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
                        this.dateSelected = utcDate;
                        rowDoms[instance.positionedEl.rowIndex - 1].childNodes[2].setAttribute('data-date', utcDate.toISOString());

                        const obj = {
                            _id: rowDoms[instance.positionedEl.rowIndex - 1].dataset.taskid,
                            date: utcDate.toISOString()
                        }
                        const jsonObj = JSON.stringify(obj);
                
                        $.ajax({
                            url: '/api/tasks/update/:' + obj._id,
                            type: 'PUT',
                            contentType: 'application/json',
                            dataType: 'json',
                            data: jsonObj,
                            success: () => rowDoms[instance.positionedEl.rowIndex - 1].childNodes[2].textContent = fullDate
                        });
                    }
                },
            }); 
        }
    }, 300);
}