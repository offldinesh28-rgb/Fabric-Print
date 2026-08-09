import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Grid,
  RotateCw,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Sliders,
  Layers,
  Ruler,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { Product, SizeOptionType, LayoutType, PrintOptions, AdminCustomizerSettings } from '../types';
import { useCart } from '../context/CartContext';
import { uploadDesignFile, fetchCustomizerSettings } from '../services/api';
import { PreloadedDesignModal } from './PreloadedDesignModal';

interface FabricCustomizerModuleProps {
  initialProduct?: Product;
  allProducts: Product[];
  onGoToCheckout?: () => void;
  onOpenBulkInquiry?: () => void;
}

export const FabricCustomizerModule: React.FC<FabricCustomizerModuleProps> = ({
  initialProduct,
  allProducts,
  onGoToCheckout,
  onOpenBulkInquiry
}) => {
  const { addToCart } = useCart();

  // Active Fabric Selection
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || allProducts[0] || {
      id: 'p-1',
      name: 'Premium Cotton Mulmul (60s x 60s)',
      category: 'Cotton',
      gsm: 75,
      width: '44 inches (112 cm)',
      count: '60s x 60s',
      color: 'Natural Soft White',
      price_per_meter: 4.80,
      swatch_test_price: 2.00,
      swatch_big_price: 5.00,
      print_surcharge_per_meter: 2.50,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      description: 'Mulmul cotton',
      weave_type: 'Plain',
      composition: '100% Cotton',
      in_stock: true
    }
  );

  // Sync state if initialProduct prop changes
  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
  }, [initialProduct]);

  // Admin Customizer Settings (DPI thresholds, enabled layouts)
  const [adminSettings, setAdminSettings] = useState<AdminCustomizerSettings>({
    dpiWarningThreshold: 150,
    dpiHighThreshold: 300,
    enabledLayouts: {
      single: true,
      repeat_grid: true,
      half_drop: true,
      mirror_repeat: true
    },
    preloadedDesigns: []
  });

  useEffect(() => {
    fetchCustomizerSettings().then(setAdminSettings).catch(console.error);
  }, []);

  // Uploaded or Selected Artwork State
  const defaultSampleDesign = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800';
  const [designUrl, setDesignUrl] = useState<string>(defaultSampleDesign);
  const [designName, setDesignName] = useState<string>('Botanical_Floral_Motif.png');
  const [designWidthPx, setDesignWidthPx] = useState<number>(2400);
  const [designHeightPx, setDesignHeightPx] = useState<number>(2400);
  const [designFileSizeMb, setDesignFileSizeMb] = useState<number>(3.2);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Modal State
  const [preloadedModalOpen, setPreloadedModalOpen] = useState<boolean>(false);

  // Customization Controls
  const [scalePercentage, setScalePercentage] = useState<number>(100); // 10% to 200%
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [layoutType, setLayoutType] = useState<LayoutType>('repeat_grid');

  // Size & Order Specs
  const [selectedSizeType, setSelectedSizeType] = useState<SizeOptionType>('meter');
  const [meters, setMeters] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(1);

  // Interactive View States
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [inkBlendMode, setInkBlendMode] = useState<boolean>(true); // Multiply blend mode overlay
  const [addedSuccessAlert, setAddedSuccessAlert] = useState<boolean>(false);

  // Measure natural dimensions of design when URL changes
  useEffect(() => {
    if (!designUrl) return;
    const img = new Image();
    img.src = designUrl;
    img.onload = () => {
      setDesignWidthPx(img.naturalWidth || 2400);
      setDesignHeightPx(img.naturalHeight || 2400);
    };
  }, [designUrl]);

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.tiff')) {
      setUploadError('Invalid file format! Please upload JPG, PNG, or TIFF image.');
      return;
    }

    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 15) {
      setUploadError('File size exceeds 15MB limit. Please compress design artwork.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadDesignFile(file);
      setDesignUrl(res.url);
      setDesignName(res.fileName);
      setDesignFileSizeMb(Number(sizeInMb.toFixed(2)));
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload design artwork.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDesign = () => {
    setDesignUrl('');
    setDesignName('');
    setDesignWidthPx(0);
    setDesignHeightPx(0);
    setUploadError('');
  };

  const handleSelectPreloaded = (design: { name: string; url: string; widthPx?: number; heightPx?: number }) => {
    setDesignUrl(design.url);
    setDesignName(design.name);
    if (design.widthPx) setDesignWidthPx(design.widthPx);
    if (design.heightPx) setDesignHeightPx(design.heightPx);
    setDesignFileSizeMb(2.5);
    setUploadError('');
  };

  // Dynamic DPI Calculation
  // Base physical motif width at 100% scale is 8 inches (20.32 cm)
  const basePhysicalInches = 8;
  const scaledPhysicalInches = basePhysicalInches * (scalePercentage / 100);
  const calculatedDpi = designWidthPx > 0 ? Math.round(designWidthPx / scaledPhysicalInches) : 0;

  const getDpiQualityStatus = () => {
    if (calculatedDpi < adminSettings.dpiWarningThreshold) {
      return {
        quality: 'Low Quality',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: 'bg-amber-500 text-white',
        desc: 'Print file resolution is below 150 DPI at this scale. Print output may look blurry or pixelated.'
      };
    }
    if (calculatedDpi < adminSettings.dpiHighThreshold) {
      return {
        quality: 'Good Quality',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        badge: 'bg-blue-600 text-white',
        desc: 'Good resolution suitable for standard digital fabric printing.'
      };
    }
    return {
      quality: 'High Quality',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badge: 'bg-emerald-600 text-white',
      desc: 'Crisp 300+ DPI mill precision print quality guaranteed.'
    };
  };

  const dpiStatus = getDpiQualityStatus();

  // Price Calculation Logic
  const calculateTotal = () => {
    let basePriceUnit = 0;
    let printSurchargeUnit = 0;

    if (selectedSizeType === 'swatch_test') {
      basePriceUnit = selectedProduct.swatch_test_price || 2.00;
      printSurchargeUnit = designUrl ? 1.00 : 0;
    } else if (selectedSizeType === 'swatch_big') {
      basePriceUnit = selectedProduct.swatch_big_price || 5.00;
      printSurchargeUnit = designUrl ? 2.50 : 0;
    } else {
      // Linear Meter
      basePriceUnit = selectedProduct.price_per_meter * meters;
      printSurchargeUnit = designUrl ? (selectedProduct.print_surcharge_per_meter || 2.50) * meters : 0;
    }

    const pricePerUnit = Number((basePriceUnit + printSurchargeUnit).toFixed(2));
    const totalPrice = Number((pricePerUnit * quantity).toFixed(2));

    return {
      basePriceUnit,
      printSurchargeUnit,
      pricePerUnit,
      totalPrice
    };
  };

  const pricing = calculateTotal();

  // Add to Cart Action
  const handleAddToCart = (directCheckout = false) => {
    if (!designUrl) {
      setUploadError('Please upload or select a design motif to proceed.');
      return;
    }

    const printConfig: PrintOptions = {
      requiresPrint: true,
      designName,
      designUrl,
      designFileSizeMb,
      layoutType,
      rotation,
      scalePercentage,
      dpi: calculatedDpi,
      dpiQuality: dpiStatus.quality as any,
      repeatType: layoutType === 'repeat_grid' ? 'grid' : layoutType === 'half_drop' ? 'drop' : 'centered'
    };

    addToCart(
      selectedProduct,
      selectedSizeType,
      quantity,
      printConfig,
      selectedSizeType === 'meter' ? meters : undefined
    );

    setAddedSuccessAlert(true);
    setTimeout(() => setAddedSuccessAlert(false), 3500);

    if (directCheckout && onGoToCheckout) {
      onGoToCheckout();
    }
  };

  // Dimensions label
  const getSizeDimensionsLabel = () => {
    if (selectedSizeType === 'swatch_test') return '20 cm x 20 cm';
    if (selectedSizeType === 'swatch_big') return '75 cm x 100 cm';
    return `${meters} Meter(s) x ${selectedProduct.width}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Title Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-blue-900/80 border border-blue-700 px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tex India Mart Customizer Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-white">
              Fabric Customization & Print Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Upload your high-resolution vector or seamless artwork, choose repeat layouts, and simulate reactive digital printing on authentic Surat base fabrics.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setPreloadedModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md flex items-center space-x-1.5"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Select Preloaded Motif</span>
            </button>
          </div>
        </div>

        {/* Added to Cart Success Toast */}
        {addedSuccessAlert && (
          <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-3 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
              <span>Customized fabric order added to cart successfully!</span>
            </div>
            {onGoToCheckout && (
              <button
                onClick={onGoToCheckout}
                className="bg-white text-emerald-800 font-bold px-3.5 py-1.5 rounded-xl text-xs hover:bg-emerald-50 transition"
              >
                Proceed to Checkout →
              </button>
            )}
          </div>
        )}

        {/* MAIN MODULE DUAL PANEL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT PANEL: FABRIC PREVIEW CANVAS & MEASUREMENT SCALE */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-4">
              
              {/* Canvas Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-900 font-serif">Interactive Live Fabric Canvas</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500 font-medium">{getSizeDimensionsLabel()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowRuler(!showRuler)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center space-x-1 transition ${
                      showRuler ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Toggle Measurement Ruler Overlay"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Ruler Scale</span>
                  </button>

                  <button
                    onClick={() => setInkBlendMode(!inkBlendMode)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center space-x-1 transition ${
                      inkBlendMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Toggle Textile Ink Blend Simulation"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{inkBlendMode ? 'Fabric Ink Sim' : 'Flat Overlay'}</span>
                  </button>
                </div>
              </div>

              {/* REAL-TIME PREVIEW FRAME WITH RULER & FABRIC BASE */}
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 aspect-square shadow-inner select-none flex flex-col">
                
                {/* TOP RULER (HORIZONTAL) */}
                {showRuler && (
                  <div className="h-6 bg-slate-800 text-slate-300 border-b border-slate-700 flex items-center px-6 text-[10px] font-mono justify-between z-20 shrink-0">
                    <span>0 cm</span>
                    <span>10 cm</span>
                    <span>25 cm</span>
                    <span>50 cm</span>
                    <span>75 cm</span>
                    <span>100 cm</span>
                    <span>{selectedProduct.width.split('(')[1]?.replace(')', '') || '112 cm'}</span>
                  </div>
                )}

                <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
                  
                  {/* LEFT RULER (VERTICAL) */}
                  {showRuler && (
                    <div className="w-6 bg-slate-800 text-slate-300 border-r border-slate-700 flex flex-col items-center py-6 text-[10px] font-mono justify-between z-20 shrink-0 h-full">
                      <span className="-rotate-90">0cm</span>
                      <span className="-rotate-90">25cm</span>
                      <span className="-rotate-90">50cm</span>
                      <span className="-rotate-90">75cm</span>
                      <span className="-rotate-90">100cm</span>
                    </div>
                  )}

                  {/* CANVAS CONTENT AREA */}
                  <div
                    className="relative w-full h-full flex-1 overflow-hidden"
                    style={{
                      backgroundColor: selectedProduct.colorCode || '#fdfbf7',
                      backgroundImage: `url(${selectedProduct.images[0]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* DESIGN OVERLAY PATTERN RENDERER */}
                    {designUrl ? (
                      <div className="w-full h-full relative">
                        {/* SINGLE CENTER LAYOUT */}
                        {layoutType === 'single' && (
                          <div className="w-full h-full flex items-center justify-center p-8">
                            <div
                              className="transition-transform duration-200 shadow-xl"
                              style={{
                                transform: `scale(${scalePercentage / 100}) rotate(${rotation}deg)`,
                                mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                                opacity: inkBlendMode ? 0.88 : 1
                              }}
                            >
                              <img
                                src={designUrl}
                                alt="Design Motif"
                                className="max-w-[280px] max-h-[280px] object-contain rounded-md"
                              />
                            </div>
                          </div>
                        )}

                        {/* REPEAT GRID LAYOUT */}
                        {layoutType === 'repeat_grid' && (
                          <div
                            className="w-full h-full transition-all duration-200"
                            style={{
                              backgroundImage: `url(${designUrl})`,
                              backgroundSize: `${scalePercentage * 1.5}px ${scalePercentage * 1.5}px`,
                              backgroundRepeat: 'repeat',
                              transform: `rotate(${rotation}deg)`,
                              transformOrigin: 'center center',
                              mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                              opacity: inkBlendMode ? 0.88 : 1
                            }}
                          />
                        )}

                        {/* HALF DROP LAYOUT */}
                        {layoutType === 'half_drop' && (
                          <div
                            className="w-full h-full transition-all duration-200"
                            style={{
                              backgroundImage: `url(${designUrl})`,
                              backgroundSize: `${scalePercentage * 1.6}px ${scalePercentage * 1.6}px`,
                              backgroundRepeat: 'repeat',
                              transform: `rotate(${rotation}deg)`,
                              transformOrigin: 'center center',
                              mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                              opacity: inkBlendMode ? 0.88 : 1
                            }}
                          />
                        )}

                        {/* MIRROR REPEAT LAYOUT */}
                        {layoutType === 'mirror_repeat' && (
                          <div
                            className="w-full h-full transition-all duration-200 grid grid-cols-4 grid-rows-4"
                            style={{
                              mixBlendMode: inkBlendMode ? 'multiply' : 'normal',
                              opacity: inkBlendMode ? 0.88 : 1
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
                                    className="w-full h-full object-cover transition-transform"
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
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 backdrop-blur-xs space-y-3">
                        <Upload className="w-12 h-12 text-white/70 animate-bounce" />
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-white font-serif">No Design Uploaded Yet</h3>
                          <p className="text-xs text-slate-300 max-w-xs">
                            Upload your JPG, PNG, or TIFF artwork file from the control panel to see live fabric preview.
                          </p>
                        </div>
                        <button
                          onClick={() => setPreloadedModalOpen(true)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          Pick From Sample Gallery
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* OVERLAY BADGES & CANVAS STATS */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-[11px] z-30">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400 uppercase tracking-wider">{selectedProduct.name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{selectedProduct.gsm} GSM</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${dpiStatus.badge}`}>
                      {calculatedDpi} DPI ({dpiStatus.quality})
                    </span>
                    <span className="text-slate-300 font-mono">
                      Scale: {scalePercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Canvas Usage Quick Hints */}
              <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="block font-bold text-slate-900">300 DPI Reactive Dyes</span>
                  <span className="text-[10px] text-slate-500">Wash-fast vibrant colors</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="block font-bold text-slate-900">Seamless Repeat</span>
                  <span className="text-[10px] text-slate-500">Auto alignment technology</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="block font-bold text-slate-900">Lab Dip Calibrated</span>
                  <span className="text-[10px] text-slate-500">Pantone shade match</span>
                </div>
              </div>

            </div>
          </div>


          {/* ======================================================== */}
          {/* RIGHT PANEL: ADVANCED CONTROL PANEL & PRICING */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif">Print Customizer Controls</h2>
                  <p className="text-xs text-slate-500">Configure design motif layout, DPI & fabric options</p>
                </div>
                <Sliders className="w-5 h-5 text-blue-900" />
              </div>

              {/* 1. UPLOAD SECTION */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Artwork Upload & Selection
                </label>

                {uploadError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {designUrl ? (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl border border-slate-300 overflow-hidden shrink-0 bg-white">
                        <img src={designUrl} alt={designName} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{designName || 'Uploaded_Artwork.png'}</h4>
                        <p className="text-[10px] text-slate-500">
                          {designWidthPx} x {designHeightPx} px ({designFileSizeMb} MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => setPreloadedModalOpen(true)}
                        className="p-2 bg-white border border-slate-200 text-blue-900 hover:bg-blue-50 rounded-xl transition"
                        title="Change Design"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleRemoveDesign}
                        className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Remove Design"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="relative border-2 border-dashed border-blue-900/30 hover:border-blue-900 bg-blue-50/50 hover:bg-blue-50 rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2">
                      <Upload className="w-6 h-6 text-blue-900" />
                      <span className="text-xs font-bold text-blue-900">Upload Artwork</span>
                      <span className="text-[10px] text-slate-500">JPG, PNG, TIFF (Max 15MB)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/tiff"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => setPreloadedModalOpen(true)}
                      className="border-2 border-slate-200 hover:border-amber-500 bg-amber-50/30 hover:bg-amber-50 rounded-2xl p-4 text-center transition flex flex-col items-center justify-center space-y-2"
                    >
                      <Sparkles className="w-6 h-6 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">Preloaded Designs</span>
                      <span className="text-[10px] text-slate-500">Pick from curated catalog</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. DPI DISPLAY & QUALITY WARNING */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    2. Print File Resolution (DPI)
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${dpiStatus.badge}`}>
                    {calculatedDpi} DPI - {dpiStatus.quality}
                  </span>
                </div>

                <div className={`p-3 rounded-2xl border text-xs space-y-1.5 transition ${dpiStatus.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Estimated Output Quality:</span>
                    <span className="font-mono">{designWidthPx} x {designHeightPx} px @ {scalePercentage}% scale</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{dpiStatus.desc}</p>
                </div>
              </div>

              {/* 3. PRINT SIZE CONTROL (SCALE SLIDER) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <label htmlFor="scale-slider" className="uppercase tracking-wider">3. Print Size Scale (%)</label>
                  <span className="text-blue-900 font-mono bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {scalePercentage}%
                  </span>
                </div>
                <input
                  id="scale-slider"
                  aria-label="Print Size Scale (%)"
                  type="range"
                  min="10"
                  max="200"
                  value={scalePercentage}
                  onChange={(e) => setScalePercentage(Number(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>10% (Micro Motif)</span>
                  <span>100% (Standard 8")</span>
                  <span>200% (Large Scale)</span>
                </div>
              </div>

              {/* 4. ARRANGEMENT / PATTERN LAYOUT */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4. Pattern Arrangement Layout
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'single', label: 'Single Center', desc: 'Centered motif', enabled: adminSettings.enabledLayouts.single },
                    { id: 'repeat_grid', label: 'Repeat Grid', desc: 'Seamless tiled grid', enabled: adminSettings.enabledLayouts.repeat_grid },
                    { id: 'half_drop', label: 'Half Drop', desc: 'Staggered 50% shift', enabled: adminSettings.enabledLayouts.half_drop },
                    { id: 'mirror_repeat', label: 'Mirror Repeat', desc: 'Flipped alternating', enabled: adminSettings.enabledLayouts.mirror_repeat }
                  ].map((item) => (
                    <button
                      key={item.id}
                      disabled={!item.enabled}
                      onClick={() => setLayoutType(item.id as LayoutType)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        layoutType === item.id
                          ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                          : item.enabled
                          ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                          : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className={`text-[10px] ${layoutType === item.id ? 'text-blue-200' : 'text-slate-500'}`}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. ROTATION CONTROL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  5. Design Rotation
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([0, 90, 180, 270] as const).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setRotation(angle)}
                      className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                        rotation === angle
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{angle}°</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. FABRIC BASE SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  6. Select Base Fabric
                </label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const found = allProducts.find(p => p.id === e.target.value);
                    if (found) setSelectedProduct(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 outline-none"
                >
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.gsm} GSM - {p.width}) - ${p.price_per_meter.toFixed(2)}/m
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. SIZE SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  7. Size Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedSizeType('swatch_test')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      selectedSizeType === 'swatch_test'
                        ? 'bg-blue-900 text-white border-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Test Swatch</div>
                    <div className="text-[10px] opacity-80">20 x 20 cm</div>
                    <div className="text-[10px] font-bold mt-1">${(selectedProduct.swatch_test_price || 2.00).toFixed(2)}</div>
                  </button>

                  <button
                    onClick={() => setSelectedSizeType('swatch_big')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      selectedSizeType === 'swatch_big'
                        ? 'bg-blue-900 text-white border-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Big Swatch</div>
                    <div className="text-[10px] opacity-80">75 x 100 cm</div>
                    <div className="text-[10px] font-bold mt-1">${(selectedProduct.swatch_big_price || 5.00).toFixed(2)}</div>
                  </button>

                  <button
                    onClick={() => setSelectedSizeType('meter')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      selectedSizeType === 'meter'
                        ? 'bg-blue-900 text-white border-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Linear Meter</div>
                    <div className="text-[10px] opacity-80">{selectedProduct.width}</div>
                    <div className="text-[10px] font-bold mt-1">${selectedProduct.price_per_meter.toFixed(2)}/m</div>
                  </button>
                </div>
              </div>

              {/* 8. QUANTITY & METERS STEPPER */}
              <div className="grid grid-cols-2 gap-3">
                {selectedSizeType === 'meter' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Fabric Meters
                    </label>
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setMeters(Math.max(1, meters - 1))}
                        className="p-2.5 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={meters}
                        onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center bg-transparent font-bold text-xs outline-none"
                      />
                      <button
                        onClick={() => setMeters(meters + 1)}
                        className="p-2.5 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className={selectedSizeType !== 'meter' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Order Quantity ({selectedSizeType === 'meter' ? 'Rolls/Lots' : 'Swatches'})
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 hover:bg-slate-200 text-slate-700 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center bg-transparent font-bold text-xs outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 hover:bg-slate-200 text-slate-700 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 9. DYNAMIC PRICE SUMMARY & CTA */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-lg border border-slate-800">
                <div className="space-y-1 border-b border-slate-800 pb-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Fabric Base Cost:</span>
                    <span>${pricing.basePriceUnit.toFixed(2)}</span>
                  </div>
                  {designUrl && (
                    <div className="flex justify-between text-amber-400 font-medium">
                      <span>Reactive Digital Print Surcharge:</span>
                      <span>+${pricing.printSurchargeUnit.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold pt-1">
                    <span>Unit Price:</span>
                    <span>${pricing.pricePerUnit.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Price (GST Incl.)</span>
                    <span className="text-2xl font-black text-amber-400 font-serif">${pricing.totalPrice.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full">
                    ✓ Free Surat Mill Shipping over $100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingCart className="w-4 h-4 text-blue-900" />
                    <span>Add To Cart</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Preloaded Design Selector Modal */}
      <PreloadedDesignModal
        isOpen={preloadedModalOpen}
        onClose={() => setPreloadedModalOpen(false)}
        onSelectDesign={handleSelectPreloaded}
      />
    </div>
  );
};
