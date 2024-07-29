module.exports = {
    xpToLevelUp(xp, level){
        return 5 * (level ** 2) + (50 * level) + 100 - xp
    },
    canLevelUp(xp, level){
        return 5 * (level ** 2) + (50 * level) + 100 - xp <= 0
    },
    xpForLevel(level) {
        return 5 * (level ** 2) + (50 * level) + 100
    },
}