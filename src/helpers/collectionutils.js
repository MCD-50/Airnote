
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

export function getCreatedOn(createdOn){
    let array = createdOn.split('-');
    let month = months[array[1]];
    return array[2] + ' ' + month + ', ' + array[0];
}
