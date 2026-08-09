import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { Product, SizeOptionType, PrintOptions } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { uploadDesignFile } from '../services/api';

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
  const [meters, setMeters] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(1);

  // Print Selection State
  const [printOption, setPrintOption] = useState<'plain' | 'custom_print'>('custom_print');
  const [uploadedDesignUrl, setUploadedDesignUrl] = useState<string>('');
  const [uploadedDesignName, setUploadedDesignName] = useState<string>('');
  const [uploadedDesignSizeMb, setUploadedDesignSizeMb] = useState<number>(0);
  const [repeatType, setRepeatType] = useState<'straight' | 'drop' | 'grid' | 'centered'>('grid');
  const [inkType, setInkType] = useState<'reactive_digital' | 'pigment'>('reactive_digital');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Sample default floral repeat pattern if user wants instant demo
  const sampleArtworkUrl = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600';

  // Dynamic Pricing Calculation
  const calculatePriceBreakdown = () => {
    let unitBase = 0;
    let unitPrint = 0;

    if (selectedSizeType === 'swatch_test') {
      unitBase = product.swatch_test_price;
      if (printOption === 'custom_print') unitPrint = 1.00;
    } else if (selectedSizeType === 'swatch_big') {
      unitBase = product.swatch_big_price;
      if (printOption === 'custom_print') unitPrint = 2.50;
    } else {
      // Linear Meter
      unitBase = product.price_per_meter * meters;
      if (printOption === 'custom_print') {
        unitPrint = product.print_surcharge_per_meter * meters;
      }
    }

    const pricePerUnit = Number((unitBase + unitPrint).toFixed(2));
    const totalPrice = Number((pricePerUnit * quantity).toFixed(2));

    return {
      unitBase,
      unitPrint,
      pricePerUnit,
      totalPrice
    };
  };

  const pricing = calculatePriceBreakdown();

  // File Upload Handler with Validation (JPG, PNG, TIFF max 15MB)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // Check extension
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.tiff')) {
      setUploadError('Invalid file type! Please upload JPG, PNG, or TIFF format.');
      return;
    }

    // Check file size (max 15MB)
    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 15) {
      setUploadError('File size exceeds maximum limit of 15MB. Please compress your design file.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadDesignFile(file);
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

    const printConfig: PrintOptions = {
      requiresPrint: printOption === 'custom_print',
      designName: printOption === 'custom_print' ? uploadedDesignName : undefined,
      designUrl: printOption === 'custom_print' ? uploadedDesignUrl : undefined,
      designFileSizeMb: printOption === 'custom_print' ? uploadedDesignSizeMb : undefined,
      repeatType: printOption === 'custom_print' ? repeatType : undefined,
      inkType: printOption === 'custom_print' ? inkType : undefined
    };

    addToCart(
      product,
      selectedSizeType,
      quantity,
      printConfig,
      selectedSizeType === 'meter' ? meters : undefined
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
          {/* LEFT: GALLERY & LIVE PRINT SIMULATOR (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Preview Frame */}
            <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm aspect-square group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* OVERLAY ARTWORK PRINT PREVIEW IF PRINT SELECTED */}
              {printOption === 'custom_print' && uploadedDesignUrl && (
                <div className="absolute inset-0 bg-slate-900/10 pointer-events-none flex items-center justify-center p-6">
                  <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-dashed border-white/80 shadow-2xl backdrop-blur-[1px]">
                    <div
                      className="w-full h-full opacity-85 transition-opacity"
                      style={{
                        backgroundImage: `url(${uploadedDesignUrl})`,
                        backgroundSize: repeatType === 'straight' ? '50%' : repeatType === 'centered' ? 'contain' : '33%',
                        backgroundRepeat: repeatType === 'centered' ? 'no-repeat' : 'repeat',
                        backgroundPosition: 'center',
                        mixBlendMode: 'multiply' // Simulates ink print over fabric texture
                      }}
                    />
                    <div className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2 py-1 rounded shadow-md backdrop-blur-md flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Live Print Simulation</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Image Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.gsm} GSM
                </span>
                <span className="bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  Width: {product.width}
                </span>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition shadow-md ${
                  isWishlisted ? 'bg-red-50 text-red-600' : 'bg-white/80 text-slate-700 hover:text-red-600'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Slider */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === idx ? 'border-blue-900 ring-2 ring-blue-900/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* TECHNICAL SPECIFICATIONS TABLE (Tex India Mart Replicating Logic) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-blue-900" />
                <span>Fabric Technical Specifications</span>
              </h4>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="text-slate-500 font-medium">Fabric Category:</div>
                <div className="font-bold text-slate-900 text-right">{product.category}</div>

                <div className="text-slate-500 font-medium">GSM Weight:</div>
                <div className="font-bold text-slate-900 text-right">{product.gsm} GSM</div>

                <div className="text-slate-500 font-medium">Usable Width:</div>
                <div className="font-bold text-slate-900 text-right">{product.width}</div>

                <div className="text-slate-500 font-medium">Yarn Count:</div>
                <div className="font-bold text-slate-900 text-right">{product.count}</div>

                <div className="text-slate-500 font-medium">Base Color:</div>
                <div className="font-bold text-slate-900 text-right flex items-center justify-end space-x-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: product.colorCode || '#ddd' }}
                  />
                  <span>{product.color}</span>
                </div>

                <div className="text-slate-500 font-medium">Weave Structure:</div>
                <div className="font-bold text-slate-900 text-right">{product.weave_type}</div>

                <div className="text-slate-500 font-medium">Fiber Composition:</div>
                <div className="font-bold text-slate-900 text-right">{product.composition}</div>
              </div>
            </div>
          </div>

          {/* RIGHT: OPTIONS & CUSTOMIZATION PANEL (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Header Title */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                <span>{product.category} Collection</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">Ready for Custom Digital Printing</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-serif leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* STEP 1: SELECT FABRIC VARIANT BASE */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Fabric Variant Base
              </label>
              <select
                value={selectedFabricVariant}
                onChange={(e) => setSelectedFabricVariant(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="Standard Base">Standard Base ({product.gsm} GSM, RFD Ready for Dye)</option>
                <option value="Organic Bio-Washed">Organic Bio-Washed Soft Finish (+$0.50/m)</option>
                <option value="Optic Bleached White">Optic Bleached Bright White (+$0.30/m)</option>
              </select>
            </div>

            {/* STEP 2: SELECT SIZE TYPE (TEX INDIA MART LOGIC) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedSizeType === 'swatch_test'
                      ? 'border-blue-900 bg-blue-50/60 ring-2 ring-blue-900/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Test Swatch</span>
                  <span className="text-[11px] text-slate-500">20 x 20 cm</span>
                  <span className="text-xs font-extrabold text-blue-900 mt-2">
                    ${product.swatch_test_price.toFixed(2)}
                  </span>
                </button>

                {/* Big Swatch */}
                <button
                  type="button"
                  onClick={() => setSelectedSizeType('swatch_big')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedSizeType === 'swatch_big'
                      ? 'border-blue-900 bg-blue-50/60 ring-2 ring-blue-900/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Big Swatch</span>
                  <span className="text-[11px] text-slate-500">75 x 100 cm</span>
                  <span className="text-xs font-extrabold text-blue-900 mt-2">
                    ${product.swatch_big_price.toFixed(2)}
                  </span>
                </button>

                {/* Linear Meter */}
                <button
                  type="button"
                  onClick={() => setSelectedSizeType('meter')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedSizeType === 'meter'
                      ? 'border-blue-900 bg-blue-50/60 ring-2 ring-blue-900/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Linear Meter</span>
                  <span className="text-[11px] text-slate-500">Full Width ({product.width})</span>
                  <span className="text-xs font-extrabold text-blue-900 mt-2">
                    ${product.price_per_meter.toFixed(2)}/m
                  </span>
                </button>
              </div>

              {/* Meter Input Counter if 'meter' is selected */}
              {selectedSizeType === 'meter' && (
                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Number of Meters:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setMeters(Math.max(1, meters - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={meters}
                      onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center font-extrabold text-slate-900 text-sm bg-white border border-slate-300 rounded-lg py-1"
                    />
                    <button
                      onClick={() => setMeters(meters + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                    <span className="text-xs text-slate-500 font-medium">Meters</span>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: PRINT OPTION (IMPORTANT TEX INDIA MART FEATURE) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Choose Printing Option
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Order Fabric Only */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
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
                    <span className="text-xs font-bold text-slate-900 block">Order Fabric Only (Plain / RFD)</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Receive raw fabric without custom printing
                    </span>
                  </div>
                </label>

                {/* Option 2: Order Fabric with Print */}
                <label
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
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
                      <span>Order Fabric with Print</span>
                      <span className="bg-red-100 text-red-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                        Custom Artwork
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      +${product.print_surcharge_per_meter.toFixed(2)}/m digital reactive print
                    </span>
                  </div>
                </label>
              </div>

              {/* DESIGN UPLOAD BOX IF PRINT SELECTED */}
              {printOption === 'custom_print' && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Printer className="w-4 h-4 text-blue-900" />
                      <span>Upload Your Artwork Design</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Formats: JPG, PNG, TIFF (Max 15MB)</span>
                  </div>

                  {/* Upload Dropzone */}
                  {!uploadedDesignUrl ? (
                    <div className="border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-xl p-6 text-center bg-white transition cursor-pointer relative">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.tiff,.tif"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        id="design-upload-input"
                      />
                      <Upload className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-800">
                        Drag & Drop or Click to Upload Artwork
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        High resolution (150-300 DPI) for best print results
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center space-x-2">
                        <span className="text-[11px] text-slate-500">Don't have a design?</span>
                        <button
                          type="button"
                          onClick={handleUseSampleDesign}
                          className="text-[11px] font-bold text-blue-900 hover:underline flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Use Sample Pattern</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Uploaded Design Confirmation Box */
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={uploadedDesignUrl}
                          alt="Design Artwork"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-xs"
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
                    <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-lg flex items-center space-x-2 border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Print Repeat Type Selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
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
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition text-center ${
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
              )}
            </div>

            {/* STEP 4: QUANTITY & DYNAMIC PRICE BREAKDOWN */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Calculated Total
                  </span>
                  <div className="text-3xl font-black text-amber-400 font-serif">
                    ${pricing.totalPrice.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-300 font-medium px-2">Qty:</span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded bg-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-600 text-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded bg-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-600 text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation Details */}
              <div className="text-[11px] text-slate-300 pt-3 border-t border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span>Base Fabric ({selectedSizeType === 'meter' ? `${meters}m` : '1 unit'}):</span>
                  <span>${pricing.unitBase.toFixed(2)}</span>
                </div>

                {printOption === 'custom_print' && (
                  <div className="flex justify-between text-amber-300">
                    <span>Digital Reactive Print Surcharge:</span>
                    <span>+${pricing.unitPrint.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                  <span>Unit Price:</span>
                  <span>${pricing.pricePerUnit.toFixed(2)} x {quantity} = ${pricing.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition border border-slate-700 text-xs flex items-center justify-center space-x-2"
                  id="add-to-cart-button"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-3 px-4 rounded-xl transition shadow-lg text-xs flex items-center justify-center space-x-2"
                  id="buy-now-button"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now (Instant Checkout)</span>
                </button>
              </div>
            </div>

            {/* BULK ORDER INQUIRY CTA */}
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-amber-900">Need Bulk Quantity (100+ Meters)?</h5>
                <p className="text-[11px] text-amber-800">Get discounted mill prices & custom color lab dips.</p>
              </div>
              <button
                onClick={onOpenBulkInquiry}
                className="bg-amber-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-amber-800 transition"
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
