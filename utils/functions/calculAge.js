module.exports = async (year, month, day) => {
	return Math.floor((Date.now() - new Date(`${year}-${month}-${day}`).getTime()) / 1000 / 60 / 60 / 24 / 365)
}
