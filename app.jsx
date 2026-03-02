// --- Export Helpers ---

const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const exportFabricSVG = (dims) => {
    const { boardT, fabricMargin, fabricW, fabricH } = dims;
    const co = 2 * fabricMargin - boardT * Math.sqrt(2);
    const W = fabricW, H = fabricH;
    const svg =
`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W.toFixed(2)}mm" height="${H.toFixed(2)}mm" viewBox="0 0 ${W.toFixed(4)} ${H.toFixed(4)}">
  <path d="M ${co.toFixed(4)} 0 L ${(W-co).toFixed(4)} 0 L ${W.toFixed(4)} ${co.toFixed(4)} L ${W.toFixed(4)} ${(H-co).toFixed(4)} L ${(W-co).toFixed(4)} ${H.toFixed(4)} L ${co.toFixed(4)} ${H.toFixed(4)} L 0 ${(H-co).toFixed(4)} L 0 ${co.toFixed(4)} Z" fill="none" stroke="#000000" stroke-width="0.01"/>
</svg>`;
    downloadFile(svg, `fabric_${W.toFixed(1)}x${H.toFixed(1)}mm.svg`, 'image/svg+xml');
};

const exportCoverPanelsSVG = (dims, solid) => {
    const { boardW, boardH, spineW, gutter } = dims;
    const totalW = 2 * boardW + spineW + 2 * gutter;
    const H = boardH;
    const spineX = boardW + gutter;
    const rightX = boardW + gutter + spineW + gutter;
    const rectStyle = solid
        ? 'fill="#000000" stroke="none"'
        : 'fill="none" stroke="#000000" stroke-width="0.01"';
    const svg =
`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalW.toFixed(2)}mm" height="${H.toFixed(2)}mm" viewBox="0 0 ${totalW.toFixed(4)} ${H.toFixed(4)}">
  <rect x="0" y="0" width="${boardW.toFixed(4)}" height="${H.toFixed(4)}" ${rectStyle}/>
  <rect x="${spineX.toFixed(4)}" y="0" width="${spineW.toFixed(4)}" height="${H.toFixed(4)}" ${rectStyle}/>
  <rect x="${rightX.toFixed(4)}" y="0" width="${boardW.toFixed(4)}" height="${H.toFixed(4)}" ${rectStyle}/>
</svg>`;
    downloadFile(svg, `cover_panels_${totalW.toFixed(1)}x${H.toFixed(1)}mm.svg`, 'image/svg+xml');
};

const exportReferencePDF = (dims) => {
    const { jsPDF } = window.jspdf;
    const { pageW, pageH, blockT, boardW, boardH, boardT, spineW, gutter, fabricMargin, fabricW, fabricH, coverMargin } = dims;

    // Letter — pick orientation that fits best
    const landscape = fabricW > fabricH;
    const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: landscape ? 'landscape' : 'portrait' });
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();

    // Center offset
    const ox = (pw - fabricW) / 2;
    const oy = (ph - fabricH) / 2;

    const co = 2 * fabricMargin - boardT * Math.sqrt(2);
    const bY  = oy + fabricMargin;
    const lbX = ox + fabricMargin;
    const rbX = ox + fabricMargin + boardW + gutter + spineW + gutter;
    const spX = ox + fabricMargin + boardW + gutter;
    const plX = ox + fabricMargin + coverMargin;
    const prX = rbX;
    const ptY = oy + fabricMargin + coverMargin;

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);

    // Fabric octagon — draw as individual lines to avoid relative-offset confusion
    const W = fabricW, H = fabricH;
    const pts = [
        [ox+co, oy], [ox+W-co, oy], [ox+W, oy+co], [ox+W, oy+H-co],
        [ox+W-co, oy+H], [ox+co, oy+H], [ox, oy+H-co], [ox, oy+co]
    ];
    for (let i = 0; i < pts.length; i++) {
        const n = pts[(i + 1) % pts.length];
        doc.line(pts[i][0], pts[i][1], n[0], n[1]);
    }

    // Board outlines
    doc.rect(lbX, bY, boardW, boardH, 'S');
    doc.rect(rbX, bY, boardW, boardH, 'S');

    // Spine outline
    doc.rect(spX, bY, spineW, boardH, 'S');

    // Page blocks
    doc.rect(plX, ptY, pageW - blockT/2, pageH, 'S');
    doc.rect(prX, ptY, pageW - blockT/2, pageH, 'S');

    doc.save('book-cover-template.pdf');
};

// --- Helper Components ---
const InputField = ({ id, label, value, onChange, colorClass }) => (
    <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorClass}`}></span>
        <label htmlFor={id} className="flex-shrink-0 w-32 text-sm font-medium text-slate-600">{label}</label>
        <input
            type="number"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-slate-200 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
        />
    </div>
);

// --- SVG Preview Component ---
const FlatLayoutSVG = ({ dims }) => {
    if (dims.fabricW <= 0 || dims.fabricH <= 0) return null;
    const cutOffset = 2 * dims.fabricMargin - dims.boardT * Math.sqrt(2);

    // --- Key Coordinates ---
    const leftBoardX = dims.fabricMargin;
    const rightBoardX = dims.fabricMargin + dims.boardW + dims.gutter + dims.spineW + dims.gutter;
    const spineX = dims.fabricMargin + dims.boardW + dims.gutter;

    const pageLeftX = dims.fabricMargin + dims.coverMargin;
    const pageRightX = rightBoardX;
    const pageTopY = dims.fabricMargin + dims.coverMargin;

    return (
        <svg viewBox={`-60 -40 ${dims.fabricW + 120} ${dims.fabricH + 80}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>{`.label{font:500 12px 'Inter',sans-serif;text-anchor:middle;stroke:none}.label-sm{font:400 10px 'Inter',sans-serif;text-anchor:middle;stroke:none}`}</style>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker>
            </defs>

            {/* --- Fabric Outline (Red) --- */}
            {/* --- Fabric Outline with Corner Cuts --- */}
            <path d={`M ${cutOffset} 0 L ${dims.fabricW - cutOffset} 0 L ${dims.fabricW} ${cutOffset} L ${dims.fabricW} ${dims.fabricH - cutOffset} L ${dims.fabricW - cutOffset} ${dims.fabricH} L ${cutOffset} ${dims.fabricH} L 0 ${dims.fabricH - cutOffset} L 0 ${cutOffset} Z`} fill="#f4a9a8" className="stroke-page-block" strokeWidth="1.5"/>

            {/* --- Cover Boards --- */}
            <g className="stroke-board-item" strokeWidth="1.5" fill="none" stroke="#22c55e">
                {/* Left Board */}
                <rect x={leftBoardX} y={dims.fabricMargin} width={dims.boardW} height={dims.boardH} rx="2" ry="2"/>
                {/* Right Board */}
                <rect x={rightBoardX} y={dims.fabricMargin} width={dims.boardW} height={dims.boardH} rx="2" ry="2"/>
            </g>

            {/* --- Spine Board Fill (Light yellow) --- */}
            <rect x={spineX + dims.boardT} y={dims.fabricMargin + dims.coverMargin} width={dims.spineW - 2 * dims.boardT} height={dims.boardH - 2 * dims.coverMargin} className="fill-calculated-light"/>
            {/* --- Spine Board Outline (Yellow) --- */}
            <rect x={spineX} y={dims.fabricMargin} width={dims.spineW} height={dims.boardH} fill="none" stroke="#eab308" strokeWidth="1.5" />
            

            {/* --- Page Blocks (Light Gray) --- */}
            <rect x={pageLeftX} y={pageTopY} width={dims.pageW-dims.blockT/2} height={dims.pageH} className="fill-page-light"/>
            <rect x={pageRightX} y={pageTopY} width={dims.pageW-dims.blockT/2} height={dims.pageH} className="fill-page-light"/>

            {/* --- Page Dimensions --- */}
            <g className="stroke-page-block fill-page-block">
                {/* Page Height (h) */}
                <line x1={pageLeftX + dims.pageW/2} y1={pageTopY} x2={pageLeftX + dims.pageW/2} y2={pageTopY + dims.pageH} markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                <text x={pageLeftX + dims.pageW/2 + 10} y={pageTopY + dims.pageH/2} className="label text-page-block" transform={`rotate(-90, ${pageLeftX + dims.pageW/2}, ${pageTopY + dims.pageH/2})`}>h</text>

                {/* Page Width (w) */}
                <line x1={pageRightX} y1={pageTopY + dims.pageH/2} x2={pageRightX + dims.pageW} y2={pageTopY + dims.pageH/2} markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                <text x={pageRightX + dims.pageW/2} y={pageTopY + dims.pageH/2 - 8} className="label text-page-block">w</text>
            </g>

            {/* --- Margin Dimensions --- */}
            <g className="stroke-margin-item fill-margin-item">
                {/* Cover Margin */}
                <line x1={-5} y1={dims.fabricMargin + dims.boardH/2} x2={leftBoardX} y2={dims.fabricMargin + dims.boardH/2} marker-end="url(#arrow)"/>
                <text x="-20" y={dims.fabricMargin + dims.boardH/2 + 4} className="label-sm text-margin-item">
                    cover<tspan x="-20" dy="1.2em">margin</tspan>
                </text>

                {/* Fabric Margin */}
                <line x1={dims.fabricW - dims.fabricMargin - dims.boardW/2} y1={dims.fabricMargin + dims.boardH + 5} x2={dims.fabricW - dims.fabricMargin - dims.boardW/2} y2={dims.fabricH} marker-end="url(#arrow)"/>
                <text x={dims.fabricW - dims.fabricMargin - dims.boardW/2} y={dims.fabricH + 15} className="label-sm text-margin-item">fabric margin</text>
            </g>

            {/* --- Calculated Dimensions --- */}
            <g className="stroke-calculated-item fill-calculated-item">
                {/* Hinge Gutter (g) */}
                <line x1={dims.fabricMargin + dims.boardW} y1={dims.fabricMargin + dims.boardH + 5} x2={dims.fabricMargin + dims.boardW + dims.gutter} y2={dims.fabricMargin + dims.boardH + 5} markerStart="url(#arrow)" markerEnd="url(#arrow)"/><text x={dims.fabricMargin + dims.boardW + dims.gutter / 2} y={dims.fabricMargin + dims.boardH + 18} className="label text-calculated-item">g</text>

                {/* Spine Width (s) */}
                <line x1={spineX} y1={dims.fabricMargin + dims.boardH/2} x2={spineX + dims.spineW} y2={dims.fabricMargin + dims.boardH/2} markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                <text x={spineX + dims.spineW / 2} y={dims.fabricMargin + dims.boardH/2 - 8} className="label text-calculated-item">s</text>
            </g>

            {/* --- Board Thickness Label --- */}
            <g className="stroke-board-item fill-board-item">
                <line x1={dims.fabricW - dims.fabricMargin} y1={dims.fabricH - dims.fabricMargin} x2={dims.fabricW - dims.fabricMargin + dims.boardT} y2={dims.fabricH - dims.fabricMargin + dims.boardT}/><text x={dims.fabricW - dims.fabricMargin + dims.boardT + 8} y={dims.fabricH - dims.fabricMargin + dims.boardT + 20} className="label-sm text-board-item" textAnchor="start">board th</text>
            </g>
        </svg>
    );
};

// --- Main App Component ---
const App = () => {
    const [panelsSolid, setPanelsSolid] = React.useState(false);
    const [inputs, setInputs] = React.useState({
        pageWidth: 108,
        pageHeight: 140,
        blockThickness: 4,
        boardThickness: 2.5,
        coverMargin: 3,
        fabricMargin: 20,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const pageW = inputs.pageWidth;
    const pageH = inputs.pageHeight;
    const blockT = inputs.blockThickness;
    const boardT = inputs.boardThickness;
    const coverMargin = inputs.coverMargin;
    const fabricMargin = inputs.fabricMargin;

    const boardW = pageW - (0.5 * blockT) + coverMargin;
    const boardH = pageH + (2 * coverMargin);
    const spineW = blockT + (2 * boardT);
    const gutter = (blockT / 2) + boardT;
    const fabricW = (2 * boardW) + spineW + (2 * gutter) + (2 * fabricMargin);
    const fabricH = boardH + (2 * fabricMargin);

    const dims = { pageW, pageH, blockT, boardW, boardH, boardT, spineW, gutter, fabricMargin, fabricW, fabricH, coverMargin };

    return (
        <div className="min-h-screen bg-slate-50 p-2 sm:p-4">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-3">
                    <div className="flex-1" />
                    <div className="text-center flex-shrink-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">
                            Book Cover Calculator
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">Visual tool for crafting the perfect book cover</p>
                    </div>
                    <div className="flex-1 flex justify-end items-center gap-2">
                        <button onClick={() => exportFabricSVG(dims)} className="px-3 py-1.5 text-xs font-medium rounded-md border bg-red-50 text-red-700 hover:bg-red-100 border-red-200 cursor-pointer">Fabric SVG</button>
                        <div className="flex items-center rounded-md border border-green-200 overflow-hidden">
                            <button onClick={() => exportCoverPanelsSVG(dims, panelsSolid)} className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer">Panels SVG</button>
                            <button onClick={() => setPanelsSolid(s => !s)} className={`px-2 py-1.5 text-xs font-medium border-l border-green-200 cursor-pointer transition-colors ${panelsSolid ? 'bg-green-700 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>{panelsSolid ? '■ solid' : '□ stroke'}</button>
                        </div>
                        <button onClick={() => exportReferencePDF(dims)} className="px-3 py-1.5 text-xs font-medium rounded-md border bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 cursor-pointer">Reference PDF</button>
                    </div>
                </header>

                {/* Main Layout - Diagrams First, Then Controls */}
                <div className="grid grid-cols-1 gap-3 h-[calc(100vh-110px)]">
                    
                    {/* Top Row: Both Diagrams Side by Side - Most Prominent */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-3/5">
                        
                        {/* Folded Reference Diagram - First */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                            <h3 className="text-center font-semibold text-slate-700 mb-3 text-lg">Cross-Sectional Diagram</h3>
                            <div className="flex-grow flex items-center justify-center min-h-0">
                                <img src="Fold diagram.png" alt="Folded book cross-section diagram" className="max-w-full max-h-full object-contain"/>
                            </div>
                        </div>

                        {/* Live Flat Layout - Second */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
                            <h3 className="text-center font-semibold text-slate-700 mb-3 text-lg">Live Updating Flat Layout</h3>
                            <div className="flex-grow min-h-0">
                                <FlatLayoutSVG dims={dims} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Controls, Results, and Formulas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 h-2/5">
                        
                        {/* Page Block Controls */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-3">Page Block</h2>
                            <div className="space-y-3">
                                <InputField id="pageWidth" label="Width:" value={inputs.pageWidth} onChange={handleInputChange} colorClass="color-page-block" />
                                <InputField id="pageHeight" label="Height:" value={inputs.pageHeight} onChange={handleInputChange} colorClass="color-page-block" />
                                <InputField id="blockThickness" label="Thickness:" value={inputs.blockThickness} onChange={handleInputChange} colorClass="color-page-block" />
                            </div>
                        </div>
                        
                        {/* Materials Controls */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-3">Materials</h2>
                            <div className="space-y-3">
                                <InputField id="boardThickness" label="Board Thick:" value={inputs.boardThickness} onChange={handleInputChange} colorClass="color-board-item" />
                                <InputField id="coverMargin" label="Cover Margin:" value={inputs.coverMargin} onChange={handleInputChange} colorClass="color-margin-item" />
                                <InputField id="fabricMargin" label="Fabric Margin:" value={inputs.fabricMargin} onChange={handleInputChange} colorClass="color-margin-item" />
                            </div>
                        </div>

                        {/* Final Dimensions Results */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-3">Final Dimensions</h2>
                            <div className="space-y-2 text-sm text-slate-700">
                                <p><strong className="text-board-item">Cover Board:</strong> {boardW.toFixed(1)} × {boardH.toFixed(1)} mm</p>
                                <p><strong className="text-calculated-item">Spine (s):</strong> {spineW.toFixed(1)} mm</p>
                                <p><strong className="text-calculated-item">Gutter (g):</strong> {gutter.toFixed(1)} mm</p>
                                <hr className="my-2 border-slate-200" />
                                <p className="font-semibold"><strong>Total Fabric:</strong> {fabricW.toFixed(1)} × {fabricH.toFixed(1)} mm</p>
                            </div>
                        </div>

                        {/* Key Formulas - Compact */}
                        <div className="bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
                            <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2 mb-3">Key Formulas</h2>
                            <div className="space-y-2 text-xs">
                                <div className="bg-slate-50 p-2 rounded">
                                    <strong className="text-board-item">Board Width:</strong><br/>
                                    {pageW.toFixed(1)} - 0.5×{blockT.toFixed(1)} + {coverMargin.toFixed(1)} = <strong>{boardW.toFixed(1)}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                    <strong className="text-calculated-item">Spine:</strong><br/>
                                    {blockT.toFixed(1)} + 2×{boardT.toFixed(1)} = <strong>{spineW.toFixed(1)}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                    <strong className="text-calculated-item">Gutter:</strong><br/>
                                    {blockT.toFixed(1)}/2 + {boardT.toFixed(1)} = <strong>{gutter.toFixed(1)}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                    <strong>Fabric Width:</strong><br/>
                                    2×{boardW.toFixed(1)} + {spineW.toFixed(1)} + 2×{gutter.toFixed(1)} + 2×{fabricMargin.toFixed(1)} = <strong>{fabricW.toFixed(1)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
