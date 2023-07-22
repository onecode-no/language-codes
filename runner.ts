// import fs from "fs";
// import path from "path";
// import csv from "fast-csv";
// import https from "https";
//
// const remoteFileUrl = 'https://pkgstore.datahub.io/core/language-codes/ietf-language-tags_csv/data/0f1fc01d4d78c0b703c7b5980979720d/ietf-language-tags_csv.csv';
//
// const csvFilePath = 'local.csv';
//
// const downloadAndSaveFile = (fileLocation, saveTo) => {
//     const file = fs.createWriteStream(saveTo);
//
//     https.get(fileLocation, (response) => {
//         if (response.statusCode !== 200) {
//             console.error('Failed to download the file. HTTP status code:', response.statusCode);
//             return;
//         }
//
//         response.pipe(file);
//         file.on('finish', () => {
//             console.log('Finished downloading');
//             file.close()
//         });
//     }).on('error', (err) => {
//         file.close();
//         console.error('Error occurred while downloading the file:', err.message);
//     });
// };
//
//
// downloadAndSaveFile(remoteFileUrl, csvFilePath);
//
// const outFile = 'all.json';
//
// const outChunking = {
//     'all.json': (row) => [row.lang, {
//         ietf: row.lang,
//         ['iso639']: row.langType,
//         ['iso3166']: row.territory,
//     }],
//     'ietf.json': (row) => [row.lang, row.lang],
//     'iso-639.json': (row) => [row.lang, row.langType],
//     'iso-3166.json': (row) => [row.lang, row.territory],
// };
//
// const parseCSV = csvData => {
//     const lines = csvData.split('\n');
//     const headers = lines[0].trim().split(',');
//
//     const data = [];
//     for (let i = 1; i < lines.length; i++) {
//         const values = lines[i].trim().split(',');
//
//         if (values.length !== headers.length) {
//             console.error('CSV data is not consistent. Skipping line:', i + 1);
//             continue;
//         }
//
//         const record = {};
//         for (let j = 0; j < headers.length; j++) {
//             record[headers[j]] = values[j];
//         }
//
//         data.push(record);
//     }
//
//     return data;
// };
//
// const csvContents = String(fs.readFileSync(csvFilePath))
// const parsedCsv = parseCSV(csvContents);
//
// for (const outFile in outChunking) {
//     if (fs.existsSync(outFile)) {
//         fs.rmSync(outFile);
//     }
//
//     /** @type {Array<Array<String, String|Object|Array>>} **/
//     const transformed = parsedCsv.map(outChunking[outFile]);
//
//     fs.writeFileSync(
//         outFile,
//         JSON.stringify(
//             Object.fromEntries(transformed as Array<String, mi>),
//         ),
//     );
// }
//
//
//
