import React, { useState, useEffect } from 'react';
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
  FolderOpen,
  FileText,
  Check
} from 'lucide-react';
import { Product, SizeOptionType, LayoutType, PrintOptions, AdminCustomizerSettings } from '../types';
import { useCart } from '../context/CartContext';
import { uploadDesignFile, fetchCustomizerSettings } from '../services/api';
import { PreloadedDesignModal } from './PreloadedDesignModal';
import { FabricCmRulerCanvas } from './FabricCmRulerCanvas';
import { FabricTechnicalSpecsBox } from './FabricTechnicalSpecsBox';

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
      count: '60s x 60s Combed Yarn',
      color: 'Natural Soft White',
      colorCode: '#fdfbf7',
      price_per_meter: 480,
      swatch_test_price: 200,
      swatch_big_price: 500,
      print_surcharge_per_meter: 0,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      description: 'Mulmul cotton',
      weave_type: 'Plain Weave',
      composition: '100% Combed Cotton',
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

  // Uploaded or Selected Artwork State (Starts empty or default sample)
  const [designUrl, setDesignUrl] = useState<string>('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800');
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
  const [inkBlendMode, setInkBlendMode] = useState<boolean>(true);
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

  // Handle File Upload - REMOVES existing preview completely & resets controls
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
      // Remove existing design completely & set new one
      setDesignUrl(res.url);
      setDesignName(res.fileName);
      setDesignFileSizeMb(Number(sizeInMb.toFixed(2)));

      // RESET scale, rotation, layout
      setScalePercentage(100);
      setRotation(0);
      setLayoutType('repeat_grid');
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
    setScalePercentage(100);
    setRotation(0);
    setLayoutType('repeat_grid');
  };

  const handleSelectPreloaded = (design: { name: string; url: string; widthPx?: number; heightPx?: number }) => {
    // Remove existing preview completely & set new one
    setDesignUrl(design.url);
    setDesignName(design.name);
    if (design.widthPx) setDesignWidthPx(design.widthPx);
    if (design.heightPx) setDesignHeightPx(design.heightPx);
    setDesignFileSizeMb(2.5);
    setUploadError('');

    // RESET scale, rotation, layout
    setScalePercentage(100);
    setRotation(0);
    setLayoutType('repeat_grid');
  };

  // Dynamic DPI Calculation
  const basePhysicalInches = 8;
  const scaledPhysicalInches = basePhysicalInches * (scalePercentage / 100);
  const calculatedDpi = designWidthPx > 0 ? Math.round(designWidthPx / scaledPhysicalInches) : 0;

  const getDpiQualityStatus = () => {
    if (calculatedDpi < adminSettings.dpiWarningThreshold) {
      return {
        quality: 'Low Quality',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: 'bg-amber-500 text-white',
        desc: 'Print file resolution is below 150 DPI at this scale. Print output may look blurry.'
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

  // Price Calculation Logic (Clean transparent INR pricing, NO surcharge text)
  const calculateTotal = () => {
    let unitPrice = 0;

    if (selectedSizeType === 'swatch_test') {
      unitPrice = selectedProduct.swatch_test_price || 200;
    } else if (selectedSizeType === 'swatch_big') {
      unitPrice = selectedProduct.swatch_big_price || 500;
    } else {
      // Linear Meter
      unitPrice = (selectedProduct.price_per_meter || 480) * meters;
    }

    const pricePerUnit = Number(unitPrice.toFixed(2));
    const totalPrice = Number((pricePerUnit * quantity).toFixed(2));

    return {
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

  // Dimensions label for active size option
  const getSizeDimensionsLabel = () => {
    if (selectedSizeType === 'swatch_test') return '20 cm × 20 cm (Test Swatch)';
    if (selectedSizeType === 'swatch_big') return '75 cm × 100 cm (Big Swatch)';
    return `${meters} Meter(s) × ${selectedProduct.width} (Fabric Roll)`;
  };

  // Dynamic preview frame aspect ratio and dimensions class based on selected size format
  const getPreviewFrameStyle = () => {
    if (selectedSizeType === 'swatch_test') {
      return {
        containerClass: 'max-w-[340px] aspect-square mx-auto rounded-3xl border-2 border-dashed border-amber-500/80 shadow-lg',
        badgeText: 'Test Swatch View (20 × 20 cm)'
      };
    }
    if (selectedSizeType === 'swatch_big') {
      return {
        containerClass: 'max-w-[400px] aspect-[3/4] mx-auto rounded-3xl border-2 border-blue-700/80 shadow-xl',
        badgeText: 'Big Swatch View (75 × 100 cm)'
      };
    }
    return {
      containerClass: 'w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] rounded-3xl border-2 border-slate-700 shadow-2xl',
      badgeText: `Linear Meter Roll View (${meters}m × ${selectedProduct.width})`
    };
  };

  const previewFrame = getPreviewFrameStyle();

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Title Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-blue-900/80 border border-blue-700 px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fabric Print Customizer Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-white">
              Fabric Customization & Print Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Upload your high-resolution artwork, customize pattern layout, scale, and simulate reactive digital printing on authentic Surat base fabrics.
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
          {/* LEFT PANEL: FABRIC PREVIEW CANVAS & TECHNICAL SPECS */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. REAL-TIME FABRIC CANVAS CONTAINER */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              
              {/* Canvas Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-900 font-serif">Live Fabric Print Simulator</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {previewFrame.badgeText}
                  </span>
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
                    <span>Ruler</span>
                  </button>

                  <button
                    onClick={() => setInkBlendMode(!inkBlendMode)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center space-x-1 transition ${
                      inkBlendMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Toggle Textile Ink Blend Simulation"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{inkBlendMode ? 'Ink Sim On' : 'Flat'}</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC SIZED PREVIEW FRAME WITH CM RULER & FABRIC BASE (REQUIREMENT #1 & #2: REMOVE MOCKUP PHOTO BACKGROUND, ADD CM SCALE) */}
              <FabricCmRulerCanvas
                designUrl={designUrl}
                product={selectedProduct}
                selectedSizeType={selectedSizeType}
                meters={meters}
                layoutType={layoutType}
                scalePercentage={scalePercentage}
                rotation={rotation}
                inkBlendMode={inkBlendMode}
                showRulers={showRuler}
              />

              {/* Canvas Feature Badges */}
              <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                  <span className="block font-bold text-slate-900">300 DPI Reactive Dyes</span>
                  <span className="text-[10px] text-slate-500">Wash-fast vibrant colors</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                  <span className="block font-bold text-slate-900">Seamless Repeat</span>
                  <span className="text-[10px] text-slate-500">Auto alignment technology</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                  <span className="block font-bold text-slate-900">Lab Dip Calibrated</span>
                  <span className="text-[10px] text-slate-500">Pantone shade match</span>
                </div>
              </div>

            </div>

            {/* 2. FABRIC TECHNICAL SPECIFICATIONS DYNAMIC CARD (REQUIREMENT #3: SYNCS WITH ALL RIGHT CONTROLS) */}
            <FabricTechnicalSpecsBox
              product={selectedProduct}
              selectedSizeType={selectedSizeType}
              meters={meters}
              layoutType={layoutType}
              quantity={quantity}
              calculatedDpi={calculatedDpi}
              scalePercentage={scalePercentage}
            />

          </div>


          {/* ======================================================== */}
          {/* RIGHT PANEL: ADVANCED CONTROL PANEL & PRICING */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif">Print Customizer Controls</h2>
                  <p className="text-xs text-slate-500">Configure artwork, select fabric base & order size</p>
                </div>
                <Sliders className="w-5 h-5 text-blue-900" />
              </div>

              {/* SECTION 1: ARTWORK UPLOAD & SELECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    1. Artwork Upload & Motif
                  </label>
                  <span className="text-[10px] text-slate-500">JPG, PNG, TIFF (Max 15MB)</span>
                </div>

                {uploadError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-2xl border border-red-200 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {designUrl ? (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl border border-slate-300 overflow-hidden shrink-0 bg-white">
                        <img src={designUrl} alt={designName} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{designName || 'Uploaded_Artwork.png'}</h4>
                        <p className="text-[10px] text-slate-500">
                          {designWidthPx} × {designHeightPx} px ({designFileSizeMb} MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => setPreloadedModalOpen(true)}
                        className="p-2 bg-white border border-slate-200 text-blue-900 hover:bg-blue-50 rounded-xl transition"
                        title="Change Design Motif"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleRemoveDesign}
                        className="p-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Remove Design Artwork"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="relative border-2 border-dashed border-blue-900/30 hover:border-blue-900 bg-blue-50/50 hover:bg-blue-50 rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2">
                      <Upload className="w-6 h-6 text-blue-900" />
                      <span className="text-xs font-bold text-blue-900">Upload Artwork File</span>
                      <span className="text-[10px] text-slate-500">Replaces active artwork</span>
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
                      <span className="text-[10px] text-slate-500">Pick from curated motifs</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 2: BASE FABRIC SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Select Base Fabric
                </label>
                <select
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const found = allProducts.find(p => p.id === e.target.value);
                    if (found) setSelectedProduct(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 outline-none transition"
                >
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.gsm} GSM) - ₹ {(p.price_per_meter || 480).toFixed(2)}/m
                    </option>
                  ))}
                </select>
              </div>

              {/* SECTION 3: SIZE FORMAT SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Select Size Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedSizeType('swatch_test')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
                      selectedSizeType === 'swatch_test'
                        ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Test Swatch</div>
                    <div className="text-[10px] opacity-80">20 × 20 cm</div>
                    <div className="text-xs font-extrabold mt-1">₹ {(selectedProduct.swatch_test_price || 200).toFixed(2)}</div>
                  </button>

                  <button
                    onClick={() => setSelectedSizeType('swatch_big')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
                      selectedSizeType === 'swatch_big'
                        ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Big Swatch</div>
                    <div className="text-[10px] opacity-80">75 × 100 cm</div>
                    <div className="text-xs font-extrabold mt-1">₹ {(selectedProduct.swatch_big_price || 500).toFixed(2)}</div>
                  </button>

                  <button
                    onClick={() => setSelectedSizeType('meter')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
                      selectedSizeType === 'meter'
                        ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Linear Meter</div>
                    <div className="text-[10px] opacity-80">{selectedProduct.width}</div>
                    <div className="text-xs font-extrabold mt-1">₹ {(selectedProduct.price_per_meter || 480).toFixed(2)}/m</div>
                  </button>
                </div>
              </div>

              {/* SECTION 4: LINEAR METER INPUT (ONLY VISIBLE WHEN 'meter' IS SELECTED - REQUIREMENT #3) */}
              {selectedSizeType === 'meter' && (
                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Number of Meters
                    </label>
                    <span className="text-[10px] text-blue-900 font-semibold">Width: {selectedProduct.width}</span>
                  </div>
                  <div className="flex items-center border border-blue-300 rounded-xl overflow-hidden bg-white shadow-xs">
                    <button
                      onClick={() => setMeters(Math.max(1, meters - 1))}
                      className="p-2.5 hover:bg-slate-100 text-slate-800 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={meters}
                      onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center bg-transparent font-extrabold text-sm text-slate-900 outline-none"
                    />
                    <button
                      onClick={() => setMeters(meters + 1)}
                      className="p-2.5 hover:bg-slate-100 text-slate-800 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 5: QUANTITY STEPPER */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Quantity ({selectedSizeType === 'meter' ? 'Rolls/Lots' : 'Swatches'})
                </label>
                <div className="flex items-center border border-slate-300 rounded-2xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-200 text-slate-800 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center bg-transparent font-extrabold text-sm text-slate-900 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-slate-200 text-slate-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SECTION 6: PATTERN LAYOUT & PRINT CONTROLS */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                {/* DPI DISPLAY */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="uppercase tracking-wider">Print File Resolution (DPI)</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${dpiStatus.badge}`}>
                      {calculatedDpi} DPI - {dpiStatus.quality}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl border text-[11px] ${dpiStatus.color}`}>
                    {dpiStatus.desc}
                  </div>
                </div>

                {/* SCALE SLIDER */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <label htmlFor="scale-slider" className="uppercase tracking-wider">Print Scale (%)</label>
                    <span className="text-blue-900 font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {scalePercentage}%
                    </span>
                  </div>
                  <input
                    id="scale-slider"
                    type="range"
                    min="10"
                    max="200"
                    value={scalePercentage}
                    onChange={(e) => setScalePercentage(Number(e.target.value))}
                    className="w-full accent-blue-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* PATTERN LAYOUT */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Pattern Arrangement
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'single', label: 'Single Center', desc: 'Centered motif', enabled: adminSettings.enabledLayouts.single },
                      { id: 'repeat_grid', label: 'Repeat Grid', desc: 'Seamless grid', enabled: adminSettings.enabledLayouts.repeat_grid },
                      { id: 'half_drop', label: 'Half Drop', desc: '50% offset', enabled: adminSettings.enabledLayouts.half_drop },
                      { id: 'mirror_repeat', label: 'Mirror Repeat', desc: 'Alternating flip', enabled: adminSettings.enabledLayouts.mirror_repeat }
                    ].map((item) => (
                      <button
                        key={item.id}
                        disabled={!item.enabled}
                        onClick={() => setLayoutType(item.id as LayoutType)}
                        className={`p-2.5 rounded-2xl border text-left transition ${
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

                {/* ROTATION BUTTONS */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Rotation
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
              </div>

              {/* SECTION 7: CLEAN DYNAMIC PRICE DISPLAY & CTA (REQUIREMENT #5: NO SURCHARGE TEXT) */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl border border-slate-800">
                <div className="space-y-1.5 border-b border-slate-800 pb-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Unit Price:</span>
                    <span className="font-bold text-white">₹ {pricing.pricePerUnit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Quantity:</span>
                    <span>{quantity} {selectedSizeType === 'meter' ? 'lot(s)' : 'swatch(es)'}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Order Price</span>
                    <span className="text-3xl font-black text-amber-400 font-serif">₹ {pricing.totalPrice.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full">
                    ✓ Inclusive of all taxes
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-2xl text-xs transition shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingCart className="w-4 h-4 text-blue-900" />
                    <span>Add To Cart</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl text-xs transition shadow-md flex items-center justify-center space-x-1.5"
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
