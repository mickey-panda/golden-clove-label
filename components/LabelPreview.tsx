"use client";
import React from "react";
import { STATIC_TEXT, CATALOG_COLUMNS } from "../lib/layout";

export default function LabelPreview({
  ingredients,
  netWt,
  mrp,
  barcodeDataUrl,
}: {
  ingredients: string;
  netWt: string;
  mrp: string;
  barcodeDataUrl: string | null;
}) {
  return (
    <div className="sticky top-8 flex-1 flex justify-center items-start overflow-auto p-2 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <div 
        id="printable-area"
        className="bg-white text-black shadow-2xl relative select-none flex flex-col"
        style={{ 
          width: "4in", 
          height: "6in", 
          padding: "0.25in", 
          boxSizing: "border-box",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
        }}
      >
        {/* Header Block */}
        <div className="text-center shrink-0">
          <p className="text-[10pt] tracking-wide uppercase font-medium m-0 text-gray-800">{STATIC_TEXT.headerText}</p>
          <h2 className="text-[14pt] font-extrabold uppercase tracking-wider my-0.5 leading-none text-black">{STATIC_TEXT.brandName}</h2>
          <hr className="border-t-[1.5px] border-black my-1" />
        </div>

        {/* Company Details Address lines */}
        <div className="text-center px-1 shrink-0">
          <div className="text-[8.5pt] leading-tight font-normal text-gray-800 my-0.5">
            {STATIC_TEXT.companyInfo.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          
          {/* Left-Aligned Elements Stack layout */}
          <p className="text-[9.5pt] mt-2 mb-1.5 text-black leading-tight text-left break-words">
            <strong className="inline-block mr-1">Ingredients :</strong>
            <span className="font-normal text-gray-900">{ingredients || "None Specified"}</span>
          </p>
        </div>

        {/* Products Section Header */}
        <div className="mt-0.5 shrink-0 text-center">
          <span className="text-[10pt] font-bold tracking-wider uppercase border-b-2 border-double border-black pb-0.5 px-3 inline-block">
            {STATIC_TEXT.rangeHeading}
          </span>
        </div>

        {/* Dynamic Dual Catalog columns grid wrapper view */}
        <div className="mt-2 text-[7.2pt] leading-[1.2] font-medium text-black grid grid-cols-2 gap-x-4 flex-1 overflow-hidden mb-[1.6in]">
          <div className="space-y-2">
            {CATALOG_COLUMNS.groups.filter(g => g.col === 1).map((group, idx) => (
              <div key={idx}>
                <h4 className="font-bold underline tracking-wide uppercase mb-0.5">{group.title}</h4>
                <ul className="list-none p-0 m-0 pl-0.5 space-y-0.5">
                  {group.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {CATALOG_COLUMNS.groups.filter(g => g.col === 2).map((group, idx) => (
              <div key={idx}>
                <h4 className="font-bold underline tracking-wide uppercase mb-0.5">{group.title}</h4>
                <ul className="list-none p-0 m-0 pl-0.5 space-y-0.5">
                  {group.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Static Position Stationary Footers */}
        <div className="absolute left-[0.25in] right-[0.25in] text-[8.2pt]" style={{ top: "4.52in" }}>
          <div className="border-t border-gray-300 my-0.5"></div>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-gray-800 font-normal">For more products, Visit our website :</span>
            <strong className="text-[9pt] font-bold text-black">www.goldenclove.in</strong>
          </div>
          <div className="flex justify-between items-baseline mt-1.5">
            <span className="text-gray-800 font-normal">Contact us at :</span>
            <strong className="text-[8.5pt] font-bold text-black">+91-8658276477, +91-7381400960</strong>
          </div>
        </div>

        {/* FSSAI Regulatory Row Block */}
        <div className="absolute left-[0.25in] right-[0.25in] flex items-center justify-start pl-1 gap-2 text-black border-t border-b border-black py-0.5 h-[0.20in]" style={{ top: "4.94in" }}>
          <span className="italic text-[11pt] font-extrabold tracking-tight text-blue-800 leading-none">fssai</span>
          <span className="font-normal text-[7.5pt] leading-none">Licence Number :</span>
          <span className="font-bold text-[9.5pt] tracking-wide leading-none">12025011000100</span>
        </div>

        {/* Pricing Layout Matrix footer element view block */}
        <div className="absolute bottom-[0.25in] left-[0.25in] right-[0.25in] flex items-end justify-between h-[0.55in]">
          <div className="w-[1.6in] h-full flex items-center bg-white">
            {barcodeDataUrl ? (
              <img src={barcodeDataUrl} alt="Barcode Live Preview" className="w-full object-contain" />
            ) : (
              <div className="h-full w-full bg-gray-100 rounded border border-dashed flex items-center justify-center text-[8px] text-gray-400">No Barcode</div>
            )}
          </div>

          <div className="text-right space-y-1 font-bold text-[10.5pt] text-black pr-0.5 pb-0.5">
            <p className="m-0 leading-none">Net Wt : <span className="font-extrabold">{netWt || "—"}</span></p>
            <p className="m-0 leading-none mt-1">MRP : <span className="font-extrabold">{mrp || "—"}</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}
