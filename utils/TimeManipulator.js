export default getDateStrings = time => {
	if (!time) return;

	var dateObjNow = new Date();
	var dateObj = new Date(time);

	const today = dateObj.getDate() == dateObjNow.getDate() && dateObj.getMonth() == dateObjNow.getMonth() && dateObj.getFullYear() == dateObjNow.getFullYear();
	const tommorow = dateObj.getDate() == dateObjNow.getDate() + 1 && dateObj.getMonth() == dateObjNow.getMonth() && dateObj.getFullYear() == dateObjNow.getFullYear();
	
	const realMonth = dateObj.getMonth() + 1;
	const yearStr = dateObj.getFullYear().toString();

	var dateStr = null;
	if (today) {
		dateStr = 'Today';
	} else if (tommorow) {
		dateStr = 'Tomorrow';
	} else {
		dateStr = dateObj.getDate() + '/' + realMonth + '/' + yearStr.slice(2);
	}

	var minStr = dateObj.getMinutes().toString();
	if (minStr.length === 1) minStr = '0' + minStr;

	const timeStr = dateObj.getHours() + ':' + minStr;

	return {dateStr, timeStr};
}