import { promises as fs } from 'fs';
import ExcelJS from 'exceljs';

const read_file = async (filePath) => {
  const workbook = new ExcelJS.Workbook();

  try {
    // Read the file as a buffer
    const buffer = await fs.readFile(filePath);
    await workbook.xlsx.load(buffer);

    const jsonData = [];
    workbook.eachSheet((worksheet) => {
      let headers = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          // Assuming the first row contains the headers
          headers = row.values;
          return; // Skip the header row
        }

        const rowObject = {};
        row.eachCell((cell, colNumber) => {
          const columnName = headers[colNumber];
          rowObject[columnName] = cell.value; // Assign value using bracket notation
        });
        jsonData.push(rowObject);
      });
    });

    return jsonData;
  } catch (err) {
    console.error('Error reading file:', err); // Use console.error for errors
    throw err; // Re-throw the error to be handled by the caller
  }
};

export { read_file };