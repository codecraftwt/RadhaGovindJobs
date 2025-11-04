import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, hi, mr } from "../locales/Languages";

const resources ={ 
    en:{
        translation :en
    },hi:{
        translation :hi
    },mr:{
        translation :mr
    }
}


i18next.use(initReactI18next).init({ 
    debug: true,
    lng:'en',
    fallbackLng: 'en',
    resources:resources,
})

export default i18next;