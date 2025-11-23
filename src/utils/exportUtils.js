import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Helper to format date for filenames
const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

export const exportToExcel = (data, fileName = 'Claims_Report') => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(claim => ({
        Date: claim.date,
        Employee: claim.userName || 'N/A',
        Email: claim.email || 'N/A',
        Description: claim.description,
        Amount: claim.amount,
        Status: claim.status
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Claims");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(dataBlob, `${fileName}_${getTimestamp()}.xlsx`);
};

export const exportToCSV = (data, fileName = 'Claims_Report') => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(claim => ({
        Date: claim.date,
        Employee: claim.userName || 'N/A',
        Email: claim.email || 'N/A',
        Description: claim.description,
        Amount: claim.amount,
        Status: claim.status
    })));

    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const dataBlob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8' });

    saveAs(dataBlob, `${fileName}_${getTimestamp()}.csv`);
};
