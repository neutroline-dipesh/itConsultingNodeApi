// const path = require("path");
// const unoconv = require("awesome-unoconv");
// const fs = require("fs");
// //Place your word file in source
// const sourceFilePath = path.resolve("./example/Resume.docx");
// const outputFilePath = path.resolve("./example/Resume.pdf");

// unoconv
//   .convert(sourceFilePath, outputFilePath)
//   .then((result) => {
//     // fs.unlinkSync("./example/name.docx");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//for awesome-unoconv

// const path = require('path');
// const unoconv = require('awesome-unoconv');
// //Place your word file in source
// const sourceFilePath = path.resolve('../public/assets/coverletter-1629447568720.docx"');
// const outputFilePath = path.resolve('../public/assets/myDoc.pdf');

// unoconv
//   .convert(sourceFilePath, outputFilePath)
//   .then(result => {
//     console.log(result); // return outputFilePath
//   })
//   .catch(err => {
//     console.log(err);
//   });

//for libreoffice-convert

// const libre = require("libreoffice-convert");

// const path = require("path");
// const fs = require("fs");

// const extend = ".pdf";
// const enterPath = path.join(
//   __dirname,
//   "../public/assets/coverletter-1629447568720.docx"
// );
// const outputPath = path.join(__dirname, `../public/assets/example${extend}`);

// // Read file
// const file = fs.readFileSync(enterPath);
// // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
// libre.convert(file, extend, undefined, (err, done) => {
//   if (err) {
//     console.log(`Error converting file: ${err}`);
//   }

//   // Here in done you have pdf file which you can save or transfer in another stream
//   fs.writeFileSync(outputPath, done);
// });
