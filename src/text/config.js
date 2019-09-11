import * as EN from './EN';
import * as RU from './RU';

let language = RU;
let languageIdentifier = "RU";
if(!localStorage.getItem("lang")){
    localStorage.setItem("lang", "RU");
}
else{
    languageIdentifier = localStorage.getItem("lang");
}
switch(languageIdentifier){
    case "EN":
        language = EN;
        break;
    case "RU":
        language = RU;
        break;
    default:
        language = EN;
}

export default language;