import React, { useState, useEffect } from 'react';
import {
  Printer,
  Upload,
  Check,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Sparkles,
  Info,
  AlertCircle,
  Maximize2,
  FileText,
  Zap,
  RotateCcw,
  X,
  Plus,
  Minus,
  Ruler,
  Grid,
  RotateCw,
  Sliders
} from 'lucide-react';
import { Product, SizeOptionType, PrintOptions } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { uploadDesignFile } from '../services/api';
import { FabricCmRulerCanvas } from './FabricCmRulerCanvas';
import { FabricTechnicalSpecsBox } from './FabricTechnicalSpecsBox';

interface ProductDetailViewProps {
  product: Product;
  onGoToCheckout: () => void;
  onOpenBulkInquiry: () => void;
  onBackToFabrics: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onGoToCheckout,
  onOpenBulkInquiry,
  onBackToFabrics
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  // Gallery Image State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Size & Customization State
  const [selectedFabricVariant, setSelectedFabricVariant] = useState('Standard Base');
  const [selectedSizeType, setSelectedSizeType] = useState<SizeOptionType>('meter');
  const [quantity, setQuantity] = useState<number>(1);

  // Print Selection State
  const [printOption, setPrintOption] = useState<'plain' | 'custom_print'>('custom_print');
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string>('');
  const [uploadedDesignName, setUploadedDesignName] = useState<string>('');
  const [uploadedDesignSizeMb, setUploadedDesignSizeMb] = useState<number>(0);
  const [repeatType, setRepeatType] = useState<'straight' | 'drop' | 'grid' | 'centered'>('grid');
  const [scalePercentage, setScalePercentage] = useState<number>(100);
  const [imagePixelWidth, setImagePixelWidth] = useState<number>(3000); // Default high-res pixel width
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // Sample artwork URL if user requests a demo motif
  const sampleArtworkUrl = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600';

  // Extract natural image resolution on upload/sample selection
  useEffect(() => {
    if (uploadedDesignUrl) {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 0) {
          setImagePixelWidth(img.naturalWidth);
        }
      };
      img.src = uploadedDesignUrl;
    }
  }, [uploadedDesignUrl]);

  // Real-time Dynamic DPI Calculation: DPI = Image Pixels / Print Size in Inches
  const getCalculatedDpi = () => {
    let baseWidthInches = 44; // Default linear meter (44 inches / 112 cm)
    if (selectedSizeType === 'swatch_test') {
      baseWidthInches = 7.87; // 20 cm = 7.87 inches
    } else if (selectedSizeType === 'swatch_big') {
      baseWidthInches = 29.53; // 75 cm = 29.53 inches
    } else {
      const inchMatch = product.width.match(/(\d+)\s*inch/i);
      if (inchMatch && inchMatch[1]) {
        baseWidthInches = parseInt(inchMatch[1], 10);
      } else {
        const cmMatch = product.width.match(/(\d+)\s*cm/i);
        if (cmMatch && cmMatch[1]) {
          baseWidthInches = parseInt(cmMatch[1], 10) / 2.54;
        }
      }
    }

    const effectiveInches = Math.max(0.5, baseWidthInches * (scalePercentage / 100));
    const dpi = Math.round(imagePixelWidth / effectiveInches);
    return Math.max(10, dpi);
  };

  const calculatedDpi = getCalculatedDpi();

  // DPI Quality Status Color Coding
  const getDpiStatus = (dpi: number) => {
    if (dpi < 150) {
      return {
        label: 'Low Quality',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-600',
        badgeBg: 'bg-red-600 text-white'
      };
    }
    if (dpi <= 300) {
      return {
        label: 'Medium Quality',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-500',
        badgeBg: 'bg-amber-500 text-white'
      };
    }
    return {
      label: 'High Quality',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-600',
      badgeBg: 'bg-emerald-600 text-white'
    };
  };

  const dpiStatus = getDpiStatus(calculatedDpi);

  // Dynamic Pricing Calculation (Clean INR Pricing)
  const calculatePriceBreakdown = () => {
    let pricePerUnit = 0;

    if (selectedSizeType === 'swatch_test') {
      pricePerUnit = product.swatch_test_price || 200;
    } else if (selectedSizeType === 'swatch_big') {
      pricePerUnit = product.swatch_big_price || 500;
    } else {
      // Linear Meter (1 Meter base unit)
      pricePerUnit = product.price_per_meter || 480;
    }

    // Add variant base surcharge (per meter or unit)
    if (selectedFabricVariant === 'Organic Bio-Washed') {
      pricePerUnit += 40;
    } else if (selectedFabricVariant === 'Optic Bleached White') {
      pricePerUnit += 25;
    }

    const totalPrice = Number((pricePerUnit * quantity).toFixed(2));

    return {
      pricePerUnit,
      totalPrice
    };
  };

  const pricing = calculatePriceBreakdown();

  // File Upload Handler with Validation (JPG, PNG, TIFF max 15MB)
  // Replaces existing preview completely
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    const ext = file.name.toLowerCase().split('.').pop() || '';
    const validExtensions = ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'webp'];
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      setUploadError('Invalid file format! Please upload JPG, PNG, WEBP or TIFF image.');
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
      // Completely replace design preview
      setUploadedDesignUrl(res.url);
      setUploadedDesignName(res.fileName);
      setUploadedDesignSizeMb(Number(sizeInMb.toFixed(2)));
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload design artwork.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUseSampleDesign = () => {
    setUploadedDesignUrl(sampleArtworkUrl);
    setUploadedDesignName('Botanical_Floral_Seamless_Pattern.png');
    setUploadedDesignSizeMb(3.4);
    setUploadError('');
  };

  const handleAddToCart = (directCheckout = false) => {
    if (printOption === 'custom_print' && !uploadedDesignUrl) {
      setUploadError('Please upload your custom design artwork (JPG, PNG, TIFF) before proceeding!');
      return;
    }

    if (!termsAccepted) {
      setUploadError('Please accept the Terms & Conditions before adding to cart.');
      return;
    }

    const printConfig: PrintOptions = {
      requiresPrint: printOption === 'custom_print',
      designName: printOption === 'custom_print' ? uploadedDesignName : undefined,
      designUrl: printOption === 'custom_print' ? uploadedDesignUrl : undefined,
      designFileSizeMb: printOption === 'custom_print' ? uploadedDesignSizeMb : undefined,
      repeatType: printOption === 'custom_print' ? repeatType : undefined
    };

    addToCart(
      product,
      selectedSizeType,
      quantity,
      printConfig,
      selectedSizeType === 'meter' ? 1 : undefined,
      selectedFabricVariant
    );

    if (directCheckout) {
      onGoToCheckout();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6 font-medium">
          <button onClick={onBackToFabrics} className="hover:text-blue-900 transition">
            Fabrics
          </button>
          <span>/</span>
          <span className="text-slate-700">{product.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold line-clamp-1">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: GALLERY, PREVIEW & DYNAMIC SPECS (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dynamic Main Preview Frame - CRITICAL BUG FIX: REMOVE PRODUCT PHOTO WHEN UPLOADED IMAGE PRESENT */}
            {printOption === 'custom_print' && uploadedDesignUrl ? (
              <div className="relative">
                <FabricCmRulerCanvas
                  designUrl={uploadedDesignUrl}
                  product={product}
                  selectedSizeType={selectedSizeType}
                  meters={1}
                  layoutType={repeatType}
                  scalePercentage={scalePercentage}
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition shadow-md z-30 ${
                    isWishlisted ? 'bg-red-50 text-red-600' : 'bg-white/80 text-slate-700 hover:text-red-600'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            ) : (
              <div className="relative bg-white overflow-hidden rounded-3xl border-2 border-slate-300 shadow-xl group aspect-square">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Fabric Texture Pattern Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

                {/* Top Image Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                    {product.gsm} GSM
                  </span>
                  <span className="bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    Width: {product.width}
                  </span>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition shadow-md z-10 ${
                    isWishlisted ? 'bg-red-50 text-red-600' : 'bg-white/80 text-slate-700 hover:text-red-600'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}

            {/* Thumbnail Gallery */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === idx ? 'border-blue-900 ring-2 ring-blue-900/20 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* DYNAMIC TECHNICAL SPECIFICATIONS TABLE (REQUIREMENT #3: SYNCS WITH ALL RIGHT CONTROLS) */}
            <FabricTechnicalSpecsBox
              product={product}
              selectedFabricVariant={selectedFabricVariant}
              selectedSizeType={selectedSizeType}
              meters={1}
              layoutType={repeatType}
              quantity={quantity}
              calculatedDpi={calculatedDpi}
              scalePercentage={scalePercentage}
            />

          </div>

          {/* RIGHT: OPTIONS & CUSTOMIZATION PANEL (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header Title */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                <span>{product.category} Collection</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Ready for Custom Digital Printing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* STEP 1: SELECT FABRIC VARIANT BASE */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Select Fabric Variant Base
              </label>
              <select
                value={selectedFabricVariant}
                onChange={(e) => setSelectedFabricVariant(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-3 px-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              >
                <option value="Standard Base">Standard Base ({product.gsm} GSM, RFD Ready for Dye)</option>
                <option value="Organic Bio-Washed">Organic Bio-Washed Soft Finish (+₹ 40/m)</option>
                <option value="Optic Bleached White">Optic Bleached Bright White (+₹ 25/m)</option>
              </select>
            </div>

            {/* STEP 2: SELECT SIZE FORMAT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Select Size Format
                </label>
                <span className="text-[11px] text-blue-900 font-semibold">
                  Test sample or bulk roll meters
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Test Swatch */}
                <button
                  type="button"
                  onClick={() => setSelectedSizeType('swatch_test')}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    selectedSizeType === 'swatch_test'
                      ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Test Swatch</span>
                  <span className="text-[11px] text-slate-500">20 × 20 cm</span>
                  <span className="text-xs font-extrabold text-blue-900 mt-2">
                    ₹ {(product.swatch_test_price || 200).toFixed(2)}
                  </span>
                </button>

                {/* Big Swatch */}
                <button
                  type="button"
                  onClick={() => setSelectedSizeType('swatch_big')}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    selectedSizeType === 'swatch_big'
                      ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Big Swatch</span>
                  <span className="text-[11px] text-slate-500">75 × 100 cm</span>
                  <span className="text-xs font-extrabold text-blue-900 mt-2">
                    ₹ {(product.swatch_big_price || 500).toFixed(2)}
                  </span>
                </button>

                {/* Linear Meter */}
                <button
                  type="button"
                  onClick={() => setSelectedSizeType('meter')}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    selectedSizeType === 'meter'
                      ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Linear Meter</span>
                  <span className="text-[11px] text-slate-500">{product.width}</span>
                  <span className="text-xs font-extrabold text-blue-900 mt-2">
                    ₹ {(product.price_per_meter || 480).toFixed(2)}/m
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 3: PRINT OPTION */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Choose Printing Option
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                    printOption === 'plain'
                      ? 'border-blue-900 bg-blue-50/40 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="printOption"
                    value="plain"
                    checked={printOption === 'plain'}
                    onChange={() => setPrintOption('plain')}
                    className="mt-1 text-blue-900 focus:ring-blue-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Order Fabric Only (RFD Base)</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Receive raw unprinted base fabric
                    </span>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                    printOption === 'custom_print'
                      ? 'border-blue-900 bg-blue-50/40 ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="printOption"
                    value="custom_print"
                    checked={printOption === 'custom_print'}
                    onChange={() => setPrintOption('custom_print')}
                    className="mt-1 text-blue-900 focus:ring-blue-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block flex items-center space-x-1">
                      <span>Order Custom Printed Fabric</span>
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Reactive digital print with custom design artwork
                    </span>
                  </div>
                </label>
              </div>

              {/* DESIGN UPLOAD & DPI CALCULATION BOX IF PRINT SELECTED */}
              {printOption === 'custom_print' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Printer className="w-4 h-4 text-blue-900" />
                      <span>Upload Your Artwork Design</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Formats: JPG, PNG, TIFF (Max 15MB)</span>
                  </div>

                  {!uploadedDesignUrl ? (
                    <div className="border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl p-6 text-center bg-white transition cursor-pointer relative">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.tiff,.tif"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        id="design-upload-input"
                      />
                      <Upload className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-800">
                        Drag & Drop or Click to Upload Artwork File
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        High resolution (150-300 DPI) for optimal reactive print quality
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center space-x-2">
                        <span className="text-[11px] text-slate-500">Need a sample motif?</span>
                        <button
                          type="button"
                          onClick={handleUseSampleDesign}
                          className="text-[11px] font-bold text-blue-900 hover:underline flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Use Sample Botanical Motif</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Uploaded Design Confirmation Box */
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={uploadedDesignUrl}
                          alt="Design Artwork"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[280px]">
                            {uploadedDesignName}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Artwork Validated ({uploadedDesignSizeMb} MB)</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setUploadedDesignUrl('')}
                        className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-xl flex items-center space-x-2 border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* PRINT FILE RESOLUTION DYNAMIC DISPLAY BOX (REQUIREMENT #2) */}
                  <div className={`p-4 rounded-2xl border-2 ${dpiStatus.borderColor} ${dpiStatus.bgColor} transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xs`}>
                    <div className="flex items-center space-x-2">
                      <span className={`text-3xl font-black font-serif ${dpiStatus.textColor}`}>
                        {calculatedDpi} DPI
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${dpiStatus.badgeBg}`}>
                        {dpiStatus.label}
                      </span>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${dpiStatus.textColor}`}>
                      Print File Resolution
                    </span>
                  </div>

                  {/* IMAGE SCALE SLIDER (REQUIREMENT #2) */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <span className="flex items-center space-x-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-900" />
                        <span>Image Scale</span>
                      </span>
                      <span className="bg-blue-900 text-white px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold">
                        {scalePercentage}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={scalePercentage}
                      onChange={(e) => setScalePercentage(Number(e.target.value))}
                      className="w-full accent-blue-900 cursor-pointer h-2 bg-slate-200 rounded-lg transition"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>10%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Print Repeat Type Selection */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Pattern Repeat Style</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'grid', label: 'Seamless Grid' },
                        { id: 'straight', label: 'Straight Repeat' },
                        { id: 'drop', label: 'Half-Drop Repeat' },
                        { id: 'centered', label: 'Centered Motif' }
                      ].map((rep) => (
                        <button
                          key={rep.id}
                          type="button"
                          onClick={() => setRepeatType(rep.id as any)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition text-center ${
                            repeatType === rep.id
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4: QUANTITY & DYNAMIC PRICE BREAKDOWN */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Calculated Total Order Price
                  </span>
                  <div className="text-3xl font-black text-amber-400 font-serif">
                    ₹ {pricing.totalPrice.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
                  <span className="text-xs text-slate-300 font-medium px-2">Qty:</span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-600 text-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-600 text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 pt-3 border-t border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span>Unit Price ({selectedSizeType === 'swatch_test' ? 'Test Swatch' : selectedSizeType === 'swatch_big' ? 'Big Swatch' : '1 Linear Meter'}):</span>
                  <span className="font-bold text-white">₹ {pricing.pricePerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-400 pt-1 border-t border-slate-800">
                  <span>Total Order ({quantity} lot):</span>
                  <span>₹ {pricing.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-2xl transition border border-slate-700 text-xs flex items-center justify-center space-x-2"
                  id="add-to-cart-button"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl transition shadow-lg text-xs flex items-center justify-center space-x-2"
                  id="buy-now-button"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now (Instant Checkout)</span>
                </button>
              </div>
            </div>

            {/* BULK ORDER INQUIRY CTA */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-amber-900">Need Bulk Quantity (100+ Meters)?</h5>
                <p className="text-[11px] text-amber-800">Get discounted mill prices & custom color lab dips.</p>
              </div>
              <button
                onClick={onOpenBulkInquiry}
                className="bg-amber-900 text-white text-xs font-bold py-2 px-3.5 rounded-xl hover:bg-amber-800 transition shrink-0"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
