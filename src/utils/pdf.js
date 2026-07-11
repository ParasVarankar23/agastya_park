import PDFDocument from "pdfkit";

export const generatePDF = () => {
    return new PDFDocument({
        size: "A4",
        margin: 50,
    });
};

export const generateReceiptPDF = (
    doc,
    data
) => {
    doc.fontSize(20).text(
        "AGASTYA PARK",
        {
            align: "center",
        }
    );

    doc.moveDown();

    doc.fontSize(16).text(
        "Maintenance Receipt"
    );

    doc.moveDown();

    doc.text(
        `Receipt No : ${data.receiptNumber}`
    );

    doc.text(
        `Owner Name : ${data.ownerName}`
    );

    doc.text(
        `Room No : ${data.roomNumber}`
    );

    doc.text(
        `Month : ${data.month}`
    );

    doc.text(
        `Amount : ₹${data.amount}`
    );

    doc.text(
        `Payment Mode : ${data.paymentMode}`
    );

    doc.text(
        `Payment Date : ${data.paymentDate}`
    );

    doc.moveDown(2);

    doc.text(
        "Authorized Signature",
        {
            align: "right",
        }
    );

    return doc;
};