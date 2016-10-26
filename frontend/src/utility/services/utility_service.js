class UtilityService {
    isEnterKeyEvent(e) {
        return e.charCode === 13;
    }
}

export default new UtilityService();