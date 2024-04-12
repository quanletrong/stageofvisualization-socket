import { str_decode } from "./String.js";
import { token_access_time_expire } from "config-custom";
export function validation_msg_key(key) {
    let KEY = false;
    if (typeof (key) != "undefined") {

        key = str_decode(key.trim());

        if (key != '') {
            // paser 
            KEY = JSON.parse(key);

            // get curren time 
            let currTime = Math.floor(Date.now() / 1000);

            // check domain
            // let domain = KEY.domain;

            // check time 
            let ctt = KEY.hasOwnProperty("ctt") ? KEY.ctt : 0;
            ctt = typeof (ctt) == "number" ? ctt : 0;

            if ((currTime - ctt) <= token_access_time_expire) {
                KEY = JSON.parse(key);
            } else {
                KEY = false;
            }

        } else {
            KEY = false;
        }

    }

    return KEY;
}
