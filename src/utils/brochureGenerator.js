/**
 * Helper to generate a printable Sivakasi Crackers PDF & Brochure Price List.
 */
export const generateBrochureHTML = (products = [], categories = []) => {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Group products by category
  const categoryMap = {};
  products.forEach((product) => {
    const catName = product.categoryName || product.category_name || (categories.find(c => c.slug === product.category || String(c.id) === String(product.category_id))?.name) || product.category || 'General Crackers';
    if (!categoryMap[catName]) {
      categoryMap[catName] = [];
    }
    categoryMap[catName].push(product);
  });

  const categorySectionsHtml = Object.keys(categoryMap).map((catName, catIdx) => {
    const catProducts = categoryMap[catName];
    const rowsHtml = catProducts.map((p, idx) => {
      const code = p.product_code || p.code || `CRK-${p.id}`;
      const name = p.name || 'Cracker Item';
      const tamilName = p.tamil_name || p.tamilName || '';
      const unit = p.unit || '1 Pack';
      const originalPrice = p.original_price || p.originalPrice || p.selling_price || p.sellingPrice || 0;
      const sellingPrice = p.selling_price || p.sellingPrice || originalPrice;

      return `
        <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}">
          <td class="px-3 py-2 text-center text-xs font-mono font-bold text-slate-700 border-b border-slate-200">${code}</td>
          <td class="px-3 py-2 text-xs font-semibold text-slate-900 border-b border-slate-200">
            <div>${name}</div>
            ${tamilName ? `<div class="text-[11px] text-red-700 font-bold font-sans">${tamilName}</div>` : ''}
          </td>
          <td class="px-3 py-2 text-center text-xs text-slate-600 border-b border-slate-200">${unit}</td>
          <td class="px-3 py-2 text-right text-xs text-slate-400 line-through border-b border-slate-200">₹${originalPrice}</td>
          <td class="px-3 py-2 text-right text-xs font-bold text-red-600 border-b border-slate-200">₹${sellingPrice}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="mb-6 break-inside-avoid">
        <div class="bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-2 rounded-t-lg font-bold text-sm flex justify-between items-center">
          <span>${catIdx + 1}. ${catName}</span>
          <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">${catProducts.length} Items</span>
        </div>
        <table class="w-full text-left border-collapse border border-slate-200 rounded-b-lg overflow-hidden">
          <thead>
            <tr class="bg-slate-100 text-slate-700 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
              <th class="px-3 py-2 text-center w-24">Code</th>
              <th class="px-3 py-2">Product Name & Tamil Name</th>
              <th class="px-3 py-2 text-center w-28">Packing</th>
              <th class="px-3 py-2 text-right w-24">MRP (₹)</th>
              <th class="px-3 py-2 text-right w-28">Offer Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Legend Crackers Sivakasi - Official Price List & Brochure</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body class="bg-slate-100 font-sans text-slate-800 p-4 sm:p-8">
      <div class="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200">
        
        <!-- Action bar for online view -->
        <div class="no-print flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div class="text-xs text-slate-500 font-medium">
            💡 Tip: Click <strong>Print or Save as PDF</strong> below to download your offline brochure.
          </div>
          <button onclick="window.print()" class="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print or Save PDF Brochure
          </button>
        </div>

        <!-- Header -->
        <div class="text-center pb-6 border-b-2 border-red-600 mb-6 relative">
          <div class="inline-block bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
            Direct Factory Wholesale & Retail Price List
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Legend Crackers Sivakasi
          </h1>
          <p class="text-xs font-medium text-slate-600 mt-1">
            Premium Quality Crackers & Sparklers • Guaranteed Lowest Factory Prices • Sivakasi, Tamil Nadu
          </p>
          <div class="mt-3 flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-slate-700 bg-red-50 py-2 px-4 rounded-xl border border-red-100">
            <span>📞 Helpline / Order: +91 98765 43210</span>
            <span>|</span>
            <span>🌐 Web: legendcrackers.com</span>
            <span>|</span>
            <span>📅 Price List Valid: ${dateStr}</span>
          </div>
        </div>

        <!-- Category Product Tables -->
        ${categorySectionsHtml}

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <p class="font-bold text-slate-700">Thank you for choosing Legend Crackers Sivakasi!</p>
          <p>Prices are subject to seasonal updates. Extra coupon discounts apply at online checkout.</p>
          <p class="text-[10px] text-slate-400">Printed on ${dateStr} from Legend Crackers Catalog</p>
        </div>
      </div>

      <script>
        // Auto trigger print prompt on load if desired
        // window.onload = () => { setTimeout(() => window.print(), 500); };
      </script>
    </body>
    </html>
  `;
};
