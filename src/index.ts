interface ILanguageCodeItem {
    // [key: string]: string;
    ietf: string;
    iso639: string;
    iso3166: string;
    priority?: number;
}

interface ILanguageCodeResultItem extends ILanguageCodeItem {
    score: number;
}

interface ILanguageMap {
    [key: string]: ILanguageCodeItem;
}

interface ILanguageResultMap {
    [key: string]: ILanguageCodeResultItem;
}

interface IParsingOptions{
    minScore?: number|25;
}

const rateLanguageCodeItem = (
    normalizedInput: string,
    item: ILanguageCodeItem,
): number => {
    let baseScore = 0;

    if (item.ietf.length > 5) {
        baseScore -= (item.ietf.length - 5) * 5;
    }

    //If there is a 100% match on ietf we give it 100 score.
    if (item.ietf === normalizedInput
        || item.ietf.toLowerCase() === normalizedInput) {
        return baseScore + 100;
    }

    //if we have a partial match on ietf AND iso3166 we give it a 85 score.
    if (item.ietf.toLowerCase().includes(normalizedInput)
        && item.iso3166.toLowerCase() === normalizedInput) {
        return baseScore + 65;
    }

    if (normalizedInput.length > 2 && item.ietf.toLowerCase().startsWith(normalizedInput)) {
        return baseScore + 65;
    }

    if (item.iso639.toLowerCase() === normalizedInput) {
        return baseScore + 50;
    }

    if (item.ietf.toLowerCase().startsWith(normalizedInput)) {
        return baseScore + 20
    }


    return baseScore;
}

const getPriority = (
    normalizedInput: string,
    item: ILanguageCodeResultItem,
) => {
    if (item.score >= 80 || normalizedInput === item.ietf) {
        return -2
    }

    if (item.hasOwnProperty('priority') && item.priority > 0) {
        return -item.priority;
    }

    if (item.ietf.startsWith(normalizedInput)) {
        return 0;
    }

    if (item.ietf.endsWith(normalizedInput)) {
        return 1;
    }

    if (item.iso3166 === normalizedInput) {
        return -1;
    }

    return 2;
}
/**
 *
 * @param input
 * @returns {ILanguageResultMap}
 */
export const parseLanguageCode = async (
    input: string,
    // options: IParsingOptions
): Promise<ILanguageResultMap> => {
    /**@type {Object<String, Object>} **/
    const allCodes: ILanguageMap = await import('./all.json');

    const normalizedInput = String(input)
        .split('_')
        .join('-')
        .toLowerCase();

    if (allCodes[normalizedInput]) {
        const item = allCodes[normalizedInput];
        return {
            [normalizedInput]: {
                ...item,
                score: rateLanguageCodeItem(normalizedInput, item)
            } as ILanguageCodeResultItem,
        } as ILanguageResultMap;
    }

    const matches: [string, ILanguageCodeResultItem][] = Object
        .entries(allCodes)
        .filter(([ietfCode, combinedCodes]) => {
            //Create points?
            const score = rateLanguageCodeItem(normalizedInput, combinedCodes)

            return score >= 25;

            // return String(combinedCodes.ietf).toLowerCase() === normalizedInput
            //     || String(combinedCodes.ietf).toLowerCase().startsWith(normalizedInput)
            // || String(combinedCodes.iso639).toLowerCase() === normalizedInput
            // || String(combinedCodes.iso3166).toLowerCase() === normalizedInput
        })
        .map(([ietfCode, combinedCodes]): [string, ILanguageCodeResultItem] =>
            [ietfCode,
                {
                    ...combinedCodes,
                    score: rateLanguageCodeItem(normalizedInput, combinedCodes),
                } as ILanguageCodeResultItem,
            ])
        .sort((a, b) => {
            // if(a[1].score > b[1].score){
            //     return a[1].score - b[1].score
            // }

            const priorityA = getPriority(normalizedInput, a[1]);
            const priorityB = getPriority(normalizedInput, b[1]);

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            if (a[1].score !== b[1].score) {
                return b[1].score - a[1].score; // Sort by score in descending order
            }

            return a[1].ietf.localeCompare(b[1].ietf);
        });

    if (matches.length === 0) {
        throw new Error(`Out of bound. (zero matches found for: '${input}' / '${normalizedInput}')`)
    }

    return Object.fromEntries(matches) as ILanguageResultMap;
}