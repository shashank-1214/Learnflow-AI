const fs = require("fs");
const pdfParse = require("pdf-parse");

(async () => {
  const buffer = fs.readFileSync("./uploads/2e9f8986-d8b9-46a3-bde1-c040b289e246.pdf");
  const data = await pdfParse(buffer);
  console.log(data.text);
})();