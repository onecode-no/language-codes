# onecode-no/language-codes
>For internal use, feel free to use if it fits your needs.


This package is a base for multiple others which the json files are used in.
By using this package you can look up Language/Country/IETF.

You can do a 1:1 lookup if you already know the IETF tag, or you can search for 1:3 lookup for either ISO-639, ISO-3166 or IETF.


Here is the simple usage for usage with npm:

## Usage

```js
import {parseLanguageCode} from '~onecode-no/language-codes';

['en', 'EN-U', 'US', 'NO', 'NB-no', 'nb', 'es-es', 'lv', 'lv-l'].forEach(key => {
    parseLanguageCode(key)
        .then(itemOrItems => {
            if (itemOrItems instanceof Object) {
                console.log(key, Object.entries(itemOrItems).slice(0, 2))
            } else {
                console.log(key, itemOrItems);
            }
        }).catch(err => {
        if (String(err.message).startsWith('Out of')) {
            console.log(key, 'Not found.');
        }
    })
})
```


Results:
```text
en {
  'en-GB': { ietf: 'en-GB', iso639: 'en', iso3166: 'GB', priority: 1, score: 50 },
  'en-US': { ietf: 'en-US', iso639: 'en', iso3166: 'US', priority: 1, score: 50 }
}
EN-U {
  'en-US': { ietf: 'en-US', iso639: 'en', iso3166: 'US', priority: 1, score: 65 },
  'en-UG': { ietf: 'en-UG', iso639: 'en', iso3166: 'UG', score: 65 }
}
US {
  'en-US': { ietf: 'en-US', iso639: 'en', iso3166: 'US', priority: 1, score: 65 },
  'es-US': { ietf: 'es-US', iso639: 'es', iso3166: 'US', score: 65 }
}
NO {
  'nb-NO': { ietf: 'nb-NO', iso639: 'nb', iso3166: 'NO', priority: 1, score: 65 },
  'nn-NO': { ietf: 'nn-NO', iso639: 'nn', iso3166: 'NO', score: 65 }
}
NB-no { 'nb-NO': { ietf: 'nb-NO', iso639: 'nb', iso3166: 'NO', priority: 1, score: 100 } }
nb {
  'nb-NO': { ietf: 'nb-NO', iso639: 'nb', iso3166: 'NO', priority: 1, score: 50
  },
  'nb-SJ': { ietf: 'nb-SJ', iso639: 'nb', iso3166: 'SJ', score: 50 }
}
es-es { 'es-ES': { ietf: 'es-ES', iso639: 'es', iso3166: 'ES', score: 100 } }
lv { 'lv-LV': { ietf: 'lv-LV', iso639: 'lv', iso3166: 'LV', priority: 1, score: 65 } }
lv-l { 'lv-LV': { ietf: 'lv-LV', iso639: 'lv', iso3166: 'LV', priority: 1, score: 65 } }
```