import { DEBUG } from "admt_utilities";
import { encrypt_data_private_key } from "config-custom";
import * as encryptData from "./PrivateEncryptData.js";

//func remove so 0 sau phan thap phan
function removeTrailingZeros(number) {
    // Chuyển số thành chuỗi để xử lý
    const numberString = number.toString();

    // Tìm vị trí của dấu chấm thập phân trong chuỗi
    const decimalIndex = numberString.indexOf('.');

    // Nếu không có dấu chấm thập phân, hoặc chỉ có số 0 sau dấu chấm, trả về số ban đầu
    if (decimalIndex === -1 || numberString.slice(decimalIndex + 1) === '0') {
        return number;
    }

    // Ngược lại, loại bỏ số 0 sau dấu chấm thập phân và chuyển về dạng số
    return parseFloat(numberString);
}

//  thuat toan chia mang theo size 
// [1,2,3,4,5,6,7,8] => size : 3 = [1,2,3] [4,5,6] [7,8]
export function divisionArray(myArray, chunk_size) {
    var results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    return results;
}

export function TypeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}
export function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function isIntNumber(sText) {
    if (sText == '') return false;
    var ValidChars = "0123456789";
    var IsNumber = true;
    var Char;
    for (var i = 0; i < sText.length; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1 || sText.charAt(0) == "0") {
            IsNumber = false;
            break;
        }
    }
    return IsNumber;
}

export function isValidDate(dateString) {
    // First check for the pattern
    var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if (!regex_date.test(dateString)) {
        return false;
    }

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
        return false;
    }

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}


export function reverse(str) {
    return str.split("").reverse().join("");
}

export function arrayReverseObj(obj) {
    let new_obj = {};
    const reversedKeys = Object.keys(obj).reverse();
    reversedKeys.forEach(key => {
        new_obj[key] = obj[key];
    });
    return new_obj;
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export function formatDate2(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}

export function formatDate3(public_date) {
    const date = new Date(public_date);
    let hours = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours();
    let minutes = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
    let publish_time = hours + ":" + minutes;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let publish_date = [day, month, year].join('-');
    return publish_time + " | " + publish_date;
}

export function getDates(start, end) {
    let startDate = new Date(start.replace("-", ","));
    let endDate = new Date(end.replace("-", ","));

    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }
    return dates
}

export function addCommas(nStr) {
    nStr = removeTrailingZeros(nStr);
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

// check variable is object or not
export function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}

// check object or array is empty or not
export function isEmpty(val) {
    if (isObject(val)) {
        return Object.keys(val).length === 0;
    } else if (Array.isArray(val)) {
        return val.length === 0;
    }
    return false;
}

export function get_num_day_from_two_date(date_from, date_to) {
    try {
        let date_1 = new Date(date_from);
        let date_2 = new Date(date_to);
        let difference = date_2.getTime() - date_1.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    } catch (err) {
        return 0;
    }

}

export function get_array_year_from_two_date(fromdate, todate, isLimitByYear = true) {
    let result_date = {};
    const start = new Date(fromdate);
    const start_date = formatDate(start);
    const start_year = start.getFullYear();

    const end = new Date(todate);
    const end_date = formatDate(end);
    const end_year = end.getFullYear()


    if (end.getTime() >= start.getTime()) {
        if (end.getTime() == start.getTime()) {

            result_date[start_year] = {
                "fromdate": formatDate(start),
                "todate": formatDate(end)
            }
        } else {


            let arr_date = [];
            while (start <= end) {
                arr_date = [...arr_date, formatDate(new Date(start))]
                start.setDate(start.getDate() + 1)
            }

            let arr_date2 = {};
            arr_date.forEach((date, key) => {

                let y = new Date(date).getFullYear();
                if (!arr_date2[y]) {
                    arr_date2[y] = []
                }

                arr_date2[y].push(date)

            });

            if (!isEmpty(arr_date2)) {

                for (const [year, date] of Object.entries(arr_date2)) {
                    const fromdate = date[0];
                    const todate = date[date.length - 1];

                    //Year Client = Year Config DB
                    if (isLimitByYear) {
                        if (global.lstYearOfDbReport !== undefined) {
                            if (year in global.lstYearOfDbReport) {
                                result_date[year] = {
                                    "fromdate": fromdate,
                                    "todate": todate
                                }
                            }
                        } else {
                            result_date[year] = {
                                "fromdate": fromdate,
                                "todate": todate
                            }
                        }
                    } else {
                        result_date[year] = {
                            "fromdate": fromdate,
                            "todate": todate
                        }
                    }
                }
            }
        }
    }

    return result_date;
}

export function getDomainFromUrl(strUrl) {
    if (strUrl == '') return '';
    try {
        var temp = strUrl.split('?', 1);
        var domain = temp[0];
        domain = domain.match(/:\/\/(.[^/]+)/)[1];
        domain = domain.replace(/www./i, '');
        return domain;
    } catch (err) {
        return '';
    }
}

export function getDivision(a, b, decimal = true) { // tinh a/b

    let rel = 0;
    if (parseInt(a) <= 0 || parseInt(b) <= 0) {
        return 'N/A';
    } else {
        rel = a / b;
    }
    return rel % 1 === 0 ? rel : (decimal ? rel.toFixed(3) : rel.toFixed());
}

export function length_object(myObj) {
    let size = Object.keys(myObj).length;
    return size;
}

export function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function isUrlValid(str) {
    try {
        const newUrl = new URL(str);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

export function sort_array_by_option(array_object, key_sort) {
    array_object.sort(function (a, b) {
        return b[`${key_sort}`] - a[`${key_sort}`];
    });
    return array_object;
}

export function str_decode(str_encode) {
    let data = '';
    if (str_encode != '') {
        try {
            data = encryptData.Decode(str_encode, encrypt_data_private_key);
        } catch (error) {
            // DEBUG(error);
            data = '';
        }
    }
    return data;
}

export function str_encode(str_decode) {
    let data = '';
    if (str_decode != '') {
        try {
            data = encryptData.Encode(str_decode, encrypt_data_private_key);
        } catch (error) {
            DEBUG(error);
            data = '';
        }

    }
    return data;
}

// fromat date yyyy-mm-dd
export function validateDate(date) {
    var matches = /^(\d{4})[-](\d{2})[-](\d{2})$/.exec(date);
    if (matches == null) return false;
    var d = matches[3];
    var m = matches[2] - 1;
    var y = matches[1] ;
    var composedDate = new Date(y, m, d);
    return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;
}

// fromat date hh:mm:ss
export function validateTime(time) {
    const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (time.match(timeReg)) {
        return true;
    }
    return false;
}

// func validate date time 
// valid string dateStr = yyyy-mm-dd hh:mm:ss
export function validate_date_time(dateStr) {
    let ArrayDateStr = dateStr.split(' ');
    /// check length
    if (ArrayDateStr.length == 2) {
        if (validateDate(ArrayDateStr[0]) && validateTime(ArrayDateStr[1])) {
            return true;
        }
    }
    return false;
}