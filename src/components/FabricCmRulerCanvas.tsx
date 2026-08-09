import React from 'react';
import { Product, SizeOptionType } from '../types';

interface FabricCmRulerCanvasProps {
  designUrl: string;
  product: Product;
  selectedSizeType: SizeOptionType;
  meters: number;
  layoutType: 'single' | 'repeat_grid' | 'half_drop' | 'mirror_repeat' | 'straight' | 'centered' | 'grid';
  scalePercentage?: number;
  rotation?: number;
  inkBlendMode?: boolean;
  showRulers?: boolean;
}

export const FabricCmRulerCanvas: React.FC<FabricCmRulerCanvasProps> = ({
  designUrl,
  product,
  selectedSizeType,
  meters,
  layoutType,
  scalePercentage = 100,
  rotation = 0,
  inkBlendMode = true,
  showRulers = true
}) => {
  // Extract width in CM from product width string (e.g. "44 inches (112 cm)" -> 112)
  const extractWidthCm = (widthStr: string): number => {
    const match = widthStr.match(/(\d+)\s*cm/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 112; // default fallback 112 cm
  };

  const fabricWidthCm = extractWidthCm(product.width);

  // Calculate CM bounds based on size type
  let widthCm = 20;
  let heightCm = 20;

  if (selectedSizeType === 'swatch_test') {
    widthCm = 20;
    heightCm = 20;
  } else if (selectedSizeType === 'swatch_big') {
    widthCm = 75;
    heightCm = 100;
  } else {
    // Linear Meter
    widthCm = fabricWidthCm;
    heightCm = 100; // 1 Meter view window
  }

  // Generate Ticks for Horizontal Top Ruler
  const getTopTicks = () => {
    if (widthCm <= 30) {
      // 0, 5, 10, 15, 20
      return [0, 5, 10, 15, 20].filter(val => val <= widthCm).map(val => ({
        label: `${val}`,
        percent: (val / widthCm) * 100,
        isMajor: true
      }));
    } else if (widthCm <= 80) {
      // 0, 25, 50, 75
      return [0, 25, 50, 75].filter(val => val <= widthCm).map(val => ({
        label: `${val}`,
        percent: (val / widthCm) * 100,
        isMajor: true
      }));
    } else {
      // 0, 25, 50, 75, 100, max
      const vals = [0, 25, 50, 75, 100];
      if (!vals.includes(widthCm)) vals.push(widthCm);
      return vals.map(val => ({
        label: `${val}`,
        percent: (val / widthCm) * 100,
        isMajor: true
      }));
    }
  };

  // Generate Ticks for Vertical Left Ruler
  const getLeftTicks = () => {
    if (heightCm <= 30) {
      return [0, 5, 10, 15, 20].filter(val => val <= heightCm).map(val => ({
        label: `${val}`,
        percent: (val / heightCm) * 100,
        isMajor: true
      }));
    } else {
      return [0, 25, 50, 75, 100].filter(val => val <= heightCm).map(val => ({
        label: `${val}`,
        percent: (val / heightCm) * 100,
        isMajor: true
      }));
    }
  };

  const topTicks = getTopTicks();
  const leftTicks = getLeftTicks();

  // Normalize layout type
  const normalizedLayout =
    layoutType === 'grid' || layoutType === 'straight'
      ? 'repeat_grid'
      : layoutType === 'centered'
      ? 'single'
      : layoutType === 'drop'
      ? 'half_drop'
      : layoutType;

  // Frame aspect ratio class
  const getFrameAspectClass = () => {
    if (selectedSizeType === 'swatch_test') return 'aspect-square max-w-[340px] mx-auto';
    if (selectedSizeType === 'swatch_big') return 'aspect-[3/4] max-w-[380px] mx-auto';
    return 'aspect-[16/10] sm:aspect-[16/9] w-full min-h-[360px]';
  };

  return (
    <div className={`relative bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl flex flex-col ${getFrameAspectClass()}`}>
      {/* TOP CM RULER */}
      {showRulers && (
        <div className="h-7 bg-slate-800 text-slate-300 border-b border-slate-700 flex items-stretch select-none shrink-0 z-20">
          <div className="w-8 shrink-0 bg-slate-900 border-r border-slate-700 flex items-center justify-center font-mono font-bold text-[10px] text-amber-400">
            CM
          </div>
          <div className="relative flex-1 bg-slate-800 flex items-end">
            {topTicks.map((t, idx) => (
              <div
                key={idx}
                className="absolute bottom-0 flex flex-col items-center transform -translate-x-1/2"
                style={{ left: `${Math.min(98, Math.max(2, t.percent))}%` }}
              >
                <span className="text-[9px] font-mono font-bold text-slate-300 mb-0.5">{t.label}</span>
                <div className={`w-[1px] bg-slate-400 ${t.isMajor ? 'h-2.5 bg-amber-400' : 'h-1.5'}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 relative overflow-hidden h-full w-full">
        {/* LEFT CM RULER */}
        {showRulers && (
          <div className="w-8 shrink-0 bg-slate-800 text-slate-300 border-r border-slate-700 relative select-none shrink-0 z-20 h-full">
            {leftTicks.map((t, idx) => (
              <div
                key={idx}
                className="absolute right-0 flex items-center transform -translate-y-1/2"
                style={{ top: `${Math.min(98, Math.max(2, t.percent))}%` }}
              >
                <span className="text-[9px] font-mono font-bold text-slate-300 mr-1">{t.label}</span>
                <div className={`h-[1px] bg-slate-400 ${t.isMajor ? 'w-2.5 bg-amber-400' : 'w-1.5'}`} />
              </div>
            ))}
          </div>
        )}

        {/* CANVAS PREVIEW AREA - CRITICAL BUG FIX: NO MOCKUP PHOTO BACKGROUND! ONLY RAW CANVAS & UPLOADED IMAGE */}
        <div
          className="relative flex-1 w-full h-full overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: product.colorCode || '#fdfbf7'
          }}
        >
          {/* Subtle fabric weave texture pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

          {/* RENDER UPLOADED IMAGE ONLY */}
          {designUrl ? (
            <div className="w-full h-full relative">
              {/* SINGLE CENTER LAYOUT */}
              {normalizedLayout === 'single' && (
                <div className="w-full h-full flex items-center justify-center p-6">
                  <div
                    className="transition-all duration-300 shadow-lg"
                    style={{
                      transform: `scale(${scalePercentage / 100}) rotate(${rotation}deg)`,
                      mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                      opacity: inkBlendMode ? 0.92 : 1
                    }}
                  >
                    <img
                      src={designUrl}
                      alt="Design Artwork Motif"
                      className="max-w-[280px] max-h-[280px] object-contain rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* REPEAT GRID LAYOUT */}
              {normalizedLayout === 'repeat_grid' && (
                <div
                  className="w-full h-full transition-all duration-300"
                  style={{
                    backgroundImage: `url("${designUrl}")`,
                    backgroundSize: `${scalePercentage * 1.5}px ${scalePercentage * 1.5}px`,
                    backgroundRepeat: 'repeat',
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                    opacity: inkBlendMode ? 0.92 : 1
                  }}
                />
              )}

              {/* HALF DROP LAYOUT */}
              {normalizedLayout === 'half_drop' && (
                <div
                  className="w-full h-full transition-all duration-300"
                  style={{
                    backgroundImage: `url("${designUrl}")`,
                    backgroundSize: `${scalePercentage * 1.6}px ${scalePercentage * 1.6}px`,
                    backgroundRepeat: 'repeat',
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                    opacity: inkBlendMode ? 0.92 : 1
                  }}
                />
              )}

              {/* MIRROR REPEAT LAYOUT */}
              {normalizedLayout === 'mirror_repeat' && (
                <div
                  className="w-full h-full transition-all duration-300 grid grid-cols-4 grid-rows-4"
                  style={{
                    mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                    opacity: inkBlendMode ? 0.92 : 1
                  }}
                >
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const flipX = idx % 2 === 1;
                    const flipY = Math.floor(idx / 4) % 2 === 1;
                    return (
                      <div key={idx} className="w-full h-full overflow-hidden">
                        <img
                          src={designUrl}
                          alt="Mirror tile"
                          className="w-full h-full object-cover"
                          style={{
                            transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1}) rotate(${rotation}deg)`
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* EMPTY STATE IF NO DESIGN UPLOADED */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 backdrop-blur-xs space-y-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                Raw Unprinted Base Fabric
              </span>
              <p className="text-[11px] text-slate-300 max-w-xs">
                Upload your custom design artwork to preview reactive digital print simulation with CM scale.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY CM BADGE */}
      <div className="bg-slate-950/90 text-slate-200 px-3 py-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono z-20">
        <span className="text-amber-400 font-bold">
          Canvas Scale: {widthCm}cm × {heightCm}cm
        </span>
        <span className="text-slate-400">
          {selectedSizeType === 'swatch_test'
            ? 'Test Swatch (20×20 cm)'
            : selectedSizeType === 'swatch_big'
            ? 'Big Swatch (75×100 cm)'
            : `${meters} Meter Roll (${product.width})`}
        </span>
      </div>
    </div>
  );
};
