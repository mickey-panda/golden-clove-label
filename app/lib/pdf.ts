import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { PAGE, STATIC_TEXT, SECTIONS, CATALOG_COLUMNS } from "@/app/lib/layout";

export function generateLabelPdf({
  ingredients,
  netWt,
  mrp,
  barcodeNumber,
}: {
  ingredients: string;
  netWt: string;
  mrp: string;
  barcodeNumber: string;
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "in", format: [PAGE.w, PAGE.h] });
  const centerX = PAGE.w / 2;
  const leftMargin = 0.25;

  // 1. Header Segment
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(STATIC_TEXT.headerText, centerX, SECTIONS.header, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14); // Cleanly scaled brand title text
  doc.text(STATIC_TEXT.brandName, centerX, SECTIONS.brand, { align: "center", charSpace: 0.01 });

  doc.setLineWidth(0.012);
  doc.line(leftMargin, SECTIONS.ruleY, PAGE.w - leftMargin, SECTIONS.ruleY);

  // 2. Company Profile Information (Unified Multi-Line rendering)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(STATIC_TEXT.companyInfo, centerX, SECTIONS.companyInfo, { align: "center" });

  // 3. TWO-STAGE TEXT WRAP MATRIX (FIXES THE HORIZONTAL OVERLAPPING)
  doc.setFontSize(9.5);
  const prefix = "Ingredients : ";
  const fullContentString = ingredients || "None Specified";
  const maxAvailableWidth = PAGE.w - leftMargin * 2;

  // Print Bold Prefix Label
  doc.setFont("helvetica", "bold");
  const boldPrefixWidth = doc.getTextWidth(prefix);
  doc.text(prefix, leftMargin, SECTIONS.ingredients);

  // Measure how much text can fit on line 1 next to the prefix
  doc.setFont("helvetica", "normal");
  const firstLineAvailableWidth = maxAvailableWidth - boldPrefixWidth - 0.04;
  
  // Custom word allocation strategy to separate line 1 from subsequent lines
  const words = fullContentString.split(" ");
  let line1Text = "";
  let wordIndex = 0;

  while (wordIndex < words.length) {
    const testLine = line1Text + (line1Text ? " " : "") + words[wordIndex];
    if (doc.getTextWidth(testLine) > firstLineAvailableWidth) {
      break;
    }
    line1Text = testLine;
    wordIndex++;
  }

  // Print out Line 1 right next to the bold prefix
  doc.text(line1Text, leftMargin + boldPrefixWidth + 0.04, SECTIONS.ingredients);

  // Wrap all remaining ingredients using the full available label width
  let curY = SECTIONS.ingredients;
  if (wordIndex < words.length) {
    const remainingText = words.slice(wordIndex).join(" ");
    const remainingWrappedLines = doc.splitTextToSize(remainingText, maxAvailableWidth);
    
    remainingWrappedLines.forEach((line: string) => {
      curY += SECTIONS.ingredientsLineHeight;
      doc.text(line, leftMargin, curY);
    });
  }

  // Dynamic starting baseline calculation for the Catalog Section
  const catalogTopY = Math.max(2.05, curY + SECTIONS.ingredientsToCatalogGap);

  // 4. Our Range Of Products Section Title
  const rangeHeadingY = catalogTopY - 0.28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(STATIC_TEXT.rangeHeading, centerX, rangeHeadingY, { align: "center" });

  doc.setLineWidth(0.008);
  const ruleY = rangeHeadingY + 0.04;
  doc.line(centerX - 0.9, ruleY, centerX + 0.9, ruleY);
  doc.line(centerX - 0.9, ruleY + 0.03, centerX + 0.9, ruleY + 0.03);

  // 5. Product Catalog Column Dynamic Scaling
  const c = CATALOG_COLUMNS;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colTotals = { 1: { groups: 0, items: 0 }, 2: { groups: 0, items: 0 } } as any;
  c.groups.forEach((g) => {
    colTotals[g.col].groups += 1;
    colTotals[g.col].items += g.items.length;
  });

  const naiveHeight = (col: 1 | 2) =>
    colTotals[col].groups * (c.titleLineHeight + c.groupGap) + colTotals[col].items * c.itemLineHeight;

  const availableHeight = SECTIONS.footerRuleY - 0.06 - catalogTopY;
  const tallest = Math.max(naiveHeight(1), naiveHeight(2));
  const scale = Math.min(1, availableHeight / tallest);

  const itemFontSize = c.itemFontSize * scale;
  const titleLH = c.titleLineHeight * scale;
  const itemLH = c.itemLineHeight * scale;
  const groupGap = c.groupGap * scale;

  doc.setFontSize(itemFontSize);
  let leftY = catalogTopY;
  let rightY = catalogTopY;

  c.groups.forEach((group) => {
    const isCol1 = group.col === 1;
    let y = isCol1 ? leftY : rightY;
    const x = isCol1 ? c.col1X : c.col2X;

    doc.setFont("helvetica", "bold");
    doc.text(group.title, x, y);
    const w = doc.getTextWidth(group.title);
    doc.setLineWidth(0.005);
    doc.line(x, y + 0.02, x + w, y + 0.02);

    y += titleLH;
    doc.setFont("helvetica", "normal");
    group.items.forEach((item) => {
      doc.text(item, x + 0.02, y);
      y += itemLH;
    });
    y += groupGap;

    if (isCol1) leftY = y; else rightY = y;
  });

  // 6. Footer Content Block
  doc.setLineWidth(0.005);
  doc.setDrawColor(180, 180, 180);
  doc.line(leftMargin, SECTIONS.footerRuleY, PAGE.w - leftMargin, SECTIONS.footerRuleY);
  doc.setDrawColor(0, 0, 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text("For more products, Visit our website :", leftMargin, SECTIONS.footerLine1);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.0);
  doc.text("www.goldenclove.in", PAGE.w - leftMargin, SECTIONS.footerLine1, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text("Contact us at :", leftMargin, SECTIONS.footerLine2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("+91-8658276477, +91-7381400960", PAGE.w - leftMargin, SECTIONS.footerLine2, { align: "right" });

  // 7. FSSAI Compliance Section
  doc.setLineWidth(0.01);
  doc.line(leftMargin, SECTIONS.fssaiTop, PAGE.w - leftMargin, SECTIONS.fssaiTop);
  doc.line(leftMargin, SECTIONS.fssaiTop + SECTIONS.fssaiHeight, PAGE.w - leftMargin, SECTIONS.fssaiTop + SECTIONS.fssaiHeight);

  doc.setTextColor(30, 64, 175);
  doc.setFont("times", "bolditalic");
  doc.setFontSize(11);
  doc.text("fssai", 0.32, SECTIONS.fssaiTop + 0.14);
  doc.setTextColor(0, 0, 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Licence Number :", 0.82, SECTIONS.fssaiTop + 0.13);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("12025011000100", 1.68, SECTIONS.fssaiTop + 0.14);

  // 8. Barcode Graphics Rendering
  const barcodeCanvas = document.createElement("canvas");
  JsBarcode(barcodeCanvas, barcodeNumber || "000000000000", {
    format: "CODE128",
    displayValue: true,
    fontSize: 20,
    margin: 0,
    height: 70,
    width: 2.0
  });

  const nativeW = barcodeCanvas.width;
  const nativeH = barcodeCanvas.height;
  const boxW = SECTIONS.barcodeW;
  const boxH = SECTIONS.barcodeH;
  const fitScale = Math.min(boxW / nativeW, boxH / nativeH);
  const drawW = nativeW * fitScale;
  const drawH = nativeH * fitScale;
  const drawX = leftMargin;
  const drawY = SECTIONS.barcodeTop + (boxH - drawH) / 2;

  doc.addImage(barcodeCanvas.toDataURL("image/png"), "PNG", drawX, drawY, drawW, drawH);

  // Target Metrology pricing labels
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(`Net Wt : ${netWt}`, PAGE.w - leftMargin, SECTIONS.netWtY, { align: "right" });
  doc.text(`MRP : ${mrp}`, PAGE.w - leftMargin, SECTIONS.mrpY, { align: "right" });

  return doc;
}
