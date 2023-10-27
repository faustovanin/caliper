function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  date.setMinutes(10);
  return date;
}

function randomDate2000() {
  return randomDate(new Date(2000, 1, 1), new Date(), 0, 23);
}

module.exports.randomDate = randomDate
module.exports.randomDate2000 = randomDate2000