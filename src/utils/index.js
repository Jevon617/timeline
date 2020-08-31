/**
 * @param {Date} time
 * @return {String}
 */
export function toStandardDatetime(t) {
    let time = new Date(t);
    let year = time.getFullYear();
    let month = String(time.getMonth() + 1).padStart(2, 0);
    let day = String(time.getDate()).padStart(2, 0);
    let hour = String(time.getHours()).padStart(2, 0);
    let min = String(time.getMinutes()).padStart(2, 0);
    let second = String(time.getSeconds()).padStart(2, 0);
    return `${year}-${month}-${day} ${hour}:${min}:${second}`;
}

export function toStandardDate(t) {
    let time = new Date(t);
    let year = time.getFullYear();
    let month = String(time.getMonth() + 1).padStart(2, 0);
    let day = String(time.getDate()).padStart(2, 0);
    return `${year}-${month}-${day}`;
}

/**
 * @param {Date} time
 * @return {String}
 */
export function toStandardTime(t) {
    let time = new Date(t);
    let hour = String(time.getHours()).padStart(2, 0);
    let min = String(time.getMinutes()).padStart(2, 0);
    let second = String(time.getSeconds()).padStart(2, 0);
    return `${hour}:${min}:${second}`;
}

/**
 * @param {Any}
 * @return {String}
 */
export function getType(arg) {
    return Object.prototype.toString.call(arg).replace(/\[object ([a-zA-z]+)]/, (match, $1) => {
        return $1.toLowerCase();
    });
}

/**
 * @param {String}
 * @return {Number}
 * toTimeStamp(2020-01-01 10:20)
 * @example
 * // return 1577845200000
 */
export function toTimeStamp(datetime) {
    datetime = datetime.replace(/-/g, '/');
    return new Date(datetime).getTime();
}
