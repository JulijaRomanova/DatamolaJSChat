const _beforeStartMonth = (firstDateDay, containerId) => {
    const cal = document.getElementById(containerId);
    const fr = new DocumentFragment();
    let el;
    firstDateDay = firstDateDay !== 0 ? firstDateDay : 7;
    for (let i = 1; i < firstDateDay; i++) {
        el = document.createElement('td');
        fr.appendChild(el);
    }
    cal.appendChild(fr);
};

const _dayOfMonth = (year, month, lastDate, containerId) => {
    const cal = document.getElementById(containerId);
    const fr = new DocumentFragment();
    let el;
    for (let i = 1; i <= lastDate; i++) {
        el = document.createElement('td');
        el.textContent = i;
        fr.appendChild(el);
        if (new Date(year, month - 1, i).getDay() === 0) {
            el = document.createElement('tr');
            fr.appendChild(el);
        }
    }
    cal.appendChild(fr);
};

const _afterEndMonth = (lastDateDay, containerId) => {
    const cal = document.getElementById(containerId);
    const fr = new DocumentFragment();
    if (lastDateDay !== 0) {
        for (let i = lastDateDay; i < 7; i++) {
            const el = document.createElement('td');
            fr.appendChild(el);
        }
    }
    cal.appendChild(fr);
};
const createCalendar = (cal, year, month) => {
    const firstDateDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const lastDateDay = new Date(year, month - 1, lastDate).getDay();

    _beforeStartMonth(firstDateDay, cal);
    _dayOfMonth(year, month, lastDate, cal);
    _afterEndMonth(lastDateDay, cal)
};
createCalendar('calendar', 2012, 9);
