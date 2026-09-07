"use client";
import { useState, useEffect } from "react";
import JsBarcode from "jsbarcode";
import LabelPreview from "@/components/LabelPreview";
import { generateLabelPdf } from "@/app/lib/pdf";
import { PRODUCT_PRESETS, ProductPreset } from "@/app/lib/productsData";

export default function Home() {
  // Master states
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [list, setList] = useState<string[]>(["100% Pure Turmeric"]);
  const [input, setInput] = useState("");
  const [netWt, setNetWt] = useState("250 g");
  const [mrp, setMrp] = useState("85/-");
  const [barcodeNumber, setBarcodeNumber] = useState("262051555309");
  const [fileName, setFileName] = useState("golden-clove-label");
  
  const [barcodePreview, setBarcodePreview] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<ReturnType<typeof generateLabelPdf> | null>(null);

  // Dropdown pre-fill intercept selector
  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    if (!id) return;

    const targetPreset = PRODUCT_PRESETS.find((p) => p.id === id);
    if (targetPreset) {
      setList(targetPreset.ingredients);
      setNetWt(targetPreset.netWt);
      setMrp(targetPreset.mrp);
      setBarcodeNumber(targetPreset.barcode);
      setFileName(targetPreset.fileName);
      updateBarcodePreview(targetPreset.barcode);
    }
  };

  const addItem = () => {
    if (!input.trim()) return;
    setList((p) => [...p, input.trim()]);
    setInput("");
  };

  // Safe barcode generator callback loop
  const updateBarcodePreview = (num: string) => {
    if (!num.trim()) {
      setBarcodePreview(null);
      return;
    }

    requestAnimationFrame(() => {
      const c = document.createElement("canvas");
      try {
        JsBarcode(c, num.trim(), { 
          format: "CODE128", 
          displayValue: true, 
          height: 55,
          fontSize: 18,
          margin: 0
        });
        setBarcodePreview(c.toDataURL("image/png"));
      } catch (e) {
        console.error("Invalid barcode syntax construction rules rule mismatch:", e);
      }
    });
  };

  // Initial load auto-population run hook
  useEffect(() => {
    updateBarcodePreview(barcodeNumber);
  }, []);

  const handleGenerate = () => {
    if (list.length === 0 || !netWt || !mrp || !barcodeNumber) {
      alert("Please ensure Ingredients, Net Wt, MRP, and Barcode are all populated.");
      return;
    }
    const doc = generateLabelPdf({
      ingredients: list.join(", "),
      netWt,
      mrp,
      barcodeNumber,
    });
    setPdfDoc(doc);
  };

  const handleSave = () => {
    if (!pdfDoc) return;
    pdfDoc.save(`${fileName || "label"}.pdf`);
  };

  const handlePrint = () => {
    if (!pdfDoc) return;
    const blobUrl = pdfDoc.output("bloburl");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl as unknown as string;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row gap-8 p-6 bg-gray-100 text-gray-800">
      
      {/* Control Configuration Input Column Menu */}
      <div className="w-full lg:w-[380px] bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4 self-start">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Golden Clove Engine</h1>
          <p className="text-xs text-gray-400 mt-0.5">Automated SKU label rendering deck</p>
        </div>

        {/* 1. Automated Preset Selection Dropdown */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Load Catalog Preset</label>
          <select
            value={selectedProductId}
            onChange={(e) => handleProductSelect(e.target.value)}
            className="w-full bg-white border border-emerald-300 text-gray-900 rounded-md px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">-- Choose Pre-filled Product --</option>
            {PRODUCT_PRESETS.map((product) => (
              <option key={product.id} value={product.id}>
                {product.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t pt-3">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ingredients List</label>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="Add ingredient..."
            />
            <button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md font-medium text-sm transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto p-1 bg-gray-50 rounded border">
            {list.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 rounded-md px-2 py-0.5 text-xs font-medium">
                {it}
                <button onClick={() => setList((p) => p.filter((_, j) => j !== i))} className="text-red-600 font-bold hover:text-red-800 ml-0.5">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Net Wt</label>
            <input className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={netWt} onChange={(e) => setNetWt(e.target.value)} placeholder="Net Weight" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">MRP Value</label>
            <input className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={mrp} onChange={(e) => setMrp(e.target.value)} placeholder="MRP" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Barcode Value</label>
          <input 
            className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
            value={barcodeNumber} 
            onChange={(e) => {
              setBarcodeNumber(e.target.value);
              updateBarcodePreview(e.target.value);
            }} 
            placeholder="Barcode serial digits" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Saved PDF Filename</label>
          <input className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        </div>

        <button onClick={handleGenerate} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm mt-2">
          Generate PDF Vector
        </button>

        {pdfDoc && (
          <div className="flex gap-3 pt-2 border-t animate-fade-in">
            <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm">Save Local</button>
            <button onClick={handlePrint} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm">Print Label</button>
          </div>
        )}
      </div>

      {/* Screen Canvas Render View Block Component Workspace */}
      <LabelPreview
        ingredients={list.join(", ")}
        netWt={netWt}
        mrp={mrp}
        barcodeDataUrl={barcodePreview}
      />
    </main>
  );
}
