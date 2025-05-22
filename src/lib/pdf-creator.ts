import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

import { Train } from '@/types/railway';

export function downloadPdf(trains: Train[], rows: any[][]) {
    const content = trains.flatMap((train, index) => {
        const rowData = rows[index];
        if (!rowData || rowData.length === 0) {
            throw new Error(`Rows array for train ${train.trainId} is empty or undefined`);
        }

        const tableBody = [Object.keys(rowData[0]), ...rowData.map((row) => Object.values(row))];

        return [
            {
                text: `Потяг №${train.trainId}. ${train.departureStation} -> ${train.arrivalStation}`,
                style: 'subheader',
            },
            {
                table: {
                    headerRows: 1,
                    body: tableBody,
                },
                margin: [100, 0, 100, 10],
            },
        ];
    });

    const docDefinition: any = {
        content: [
            {
                text: `Звіт станом на ${new Date().toLocaleString()}`,
                style: 'header',
            },
            ...content,
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
                alignment: 'center',
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 10],
                alignment: 'center',
            },
        },
        defaultStyle: {
            font: 'Roboto',
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
    };

    pdfMake.createPdf(docDefinition).download('trains_report.pdf');
}
