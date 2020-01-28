let start = moment(new Date());
let savedData = [];

// This will set the time back to 9 from wherever we are in the current day. 
// This is helpful when using moment().isBefore later on
while (moment(start).format('H') !== '9') {
    start = moment(start).subtract(1, 'hour');
}

// This will update the time that displays on top
setInterval(() => {
    let time = moment(new Date).format("dddd, MMMM Do YYYY, h:mm:ss a");

    $('#current-time').text(time);
}, 1000)

// This will reload background colors for current time, in case the user leaves the page open
setInterval(() => {
    let begin = moment(new Date());
    while (moment(begin).format('H') !== '9') {
        begin = moment(begin).subtract(1, 'hour');
    }
    
    $('input').removeClass('bg-success bg-danger bg-light text-light');

    while (moment(begin).format('H') <= 21) {
        let currentHour = moment(new Date()).format('H');
        let inputHour = moment(begin).format('h a');
        let hour = moment(begin).format('H');
        let input = $(`input[data-input="${inputHour}"]`);

        if (moment(new Date, 'hour').isBefore(begin, 'hour')) {
            input.addClass('bg-success text-light');
        } else if (hour === currentHour) {
            input.addClass('bg-danger text-light');
        } else {
            input.addClass('bg-light');
        }

        begin = moment(begin).add(1, 'hour');
    }

}, 5000)

// This creates all the hour items in a loop
while (moment(start).format('H')  <= 21) {
    let currentHour = moment(new Date).format('H');
    let hour = moment(start).format('H');
    let timeText = moment(start).format('h a');

    // This div will hold everything
    let newItem = $('<div>');

    // Hour Div
    newItem.attr('class', 'input-group input-group-lg mb-3');
    let timeSpan = $('<span>').attr('class', 'input-group-text bg-white').text(timeText);
    let timeDiv = $('<div>').append(timeSpan);
    timeDiv.attr('class', 'input-group-prepend');

    // Input
    let input = $('<input>').attr('class', 'form-control');
    input.attr('data-input', moment(start).format('h a'));

    // Save Div
    let saveDiv = $('<div>').attr('class', 'input-group-append');
    let button = $('<button>');
    button.attr('type', 'button').attr('class', 'button bg-primary').attr('data-time', moment(start).format('h a'));

    // Icon
    let icon = $('<i>');
    icon.attr('class', 'glyphicon glyphicon-floppy-save');
    icon.attr('data-time', moment(start).format('h a'));
    button.append(icon);
    saveDiv.append(button);

    // Add all items to my new div
    newItem.append(timeDiv, input, saveDiv);

    // Add new div to the page
    $('#main-wrapper').append(newItem);

    if (moment(new Date, 'hour').isBefore(start, 'hour')) {
        // timeSpan.addClass('bg-success text-light');
        input.addClass('bg-success text-light');
    } else if (hour === currentHour) {
        // timeSpan.addClass('bg-danger text-light');
        input.addClass('bg-danger text-light');
    } else {
        // timeSpan.addClass('bg-light');
        input.addClass('bg-light');
    }

    // Add an hour so my loop will continue
    start = moment(start).add(1, 'hour');
}

// This is the listener event for the save button
$('.button').on('click', (e) => {
    let data = e.target.attributes['data-time'].value;
    let text = $(`input[data-input="${data}"]`)[0].value;
    let localStorageValue = moment(new Date()).format('LL');

    savedData = JSON.parse(localStorage.getItem(localStorageValue)) || [];

    let currentDay = {
        time: data,
        text: text,
    }
    
    savedData.push(currentDay);
    localStorage.setItem(localStorageValue, JSON.stringify(savedData));
})

// Load the saved data if any
$('document').ready(() => {
    let localStorageValue = moment(new Date()).format('LL');
    let currentStorage = JSON.parse(localStorage.getItem(localStorageValue));

    if (currentStorage) {
        currentStorage.map(hour => {
            let currentHour = hour.time;
            let currentText = hour.text;
            
            $(`input[data-input="${currentHour}"]`)[0].value = currentText;
        })
    }
})

