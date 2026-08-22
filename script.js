const SHEET_NAME = "Products";

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("Deva Kirana Store");
}


// PRODUCTS WEBSITE KO DENE KE LIYE
function getProducts() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);

  const data = sheet.getDataRange().getValues();

  data.shift();

  return data
    .filter(row => row[0] !== "")
    .map(row => ({
      name: row[0],
      price: Number(row[1]),
      unit: row[2],
      available: String(row[3]).toUpperCase()
    }));
}
