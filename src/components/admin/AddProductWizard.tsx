import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Package,
  Layers,
  Shirt,
  Weight,
  Ruler,
  SlidersHorizontal,
  DollarSign,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye
} from 'lucide-react';
import {
  Product,
  Category,
  MasterFabric,
  MasterGsmWeight,
  MasterFabricSizeFormat,
  MasterFabricVariantBase,
  CategoryType
} from '../../types';
import { MediaLibraryModal } from './MediaLibraryModal';

interface AddProductWizardProps {
  categories: Category[];
  fabrics: MasterFabric[];
  gsmWeights: MasterGsmWeight[];
  sizeFormats: MasterFabricSizeFormat[];
  variantBases: MasterFabricVariantBase[];
  editingProduct?: Product | null;
  onSaveProduct: (productPayload: Partial<Product>) => Promise<Product | void>;
  onViewProductInFrontend?: (prodId: string) => void;
  onCancel: () => void;
}

export const AddProductWizard: React.FC<AddProductWizardProps> = ({
  categories,
  fabrics,
  gsmWeights,
  sizeFormats,
  variantBases,
  editingProduct,
  onSaveProduct,
  onViewProductInFrontend,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState<boolean>(false);
  const [publishedProductData, setPublishedProductData] = useState<Product | null>(null);

  // STEP 1: Basic Info
  const [name, setName] = useState(editingProduct?.name || '');
  const [description, setDescription] = useState(
    editingProduct?.description || 'High quality fabric engineered for fine garments and custom reactive digital printing.'
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<CategoryType>(
    editingProduct?.category || (categories[0]?.name as CategoryType) || 'Cotton'
  );

  // STEP 2: Fabric
  const [selectedFabricId, setSelectedFabricId] = useState<string>(
    editingProduct?.fabric_id || fabrics[0]?.id || ''
  );

  // STEP 3: GSM
  const [selectedGsmId, setSelectedGsmId] = useState<string>(
    editingProduct?.gsm_id || gsmWeights[2]?.id || gsmWeights[0]?.id || ''
  );

  // STEP 4: Size Formats (Multi-select)
  const [selectedSizeFormatIds, setSelectedSizeFormatIds] = useState<string[]>(
    editingProduct?.size_format_ids || sizeFormats.map(s => s.id)
  );

  // STEP 5: Variant Bases (Multi-select)
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>(
    editingProduct?.variant_ids || [variantBases[0]?.id || '']
  );

  // STEP 6: Pricing
  const [pricePerMeter, setPricePerMeter] = useState<number>(editingProduct?.price_per_meter || 6.50);
  const [swatchTestPrice, setSwatchTestPrice] = useState<number>(editingProduct?.swatch_test_price || 2.50);
  const [swatchBigPrice, setSwatchBigPrice] = useState<number>(editingProduct?.swatch_big_price || 6.00);
  const [printSurcharge, setPrintSurcharge] = useState<number>(editingProduct?.print_surcharge_per_meter || 2.80);

  // STEP 7: Media & Gallery Handling (WordPress Style)
  const [productImages, setProductImages] = useState<string[]>(
    editingProduct?.images && editingProduct.images.length > 0
      ? editingProduct.images
      : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000']
  );
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const [width, setWidth] = useState<string>(editingProduct?.width || '44 inches (112 cm)');
  const [count, setCount] = useState<string>(editingProduct?.count || '60s x 60s Yarn');
  const [weaveType, setWeaveType] = useState<string>(editingProduct?.weave_type || 'Plain Weave');
  const [composition, setComposition] = useState<string>(editingProduct?.composition || '100% Fine Combed Cotton');

  // Auto update default image and name when Fabric changes
  useEffect(() => {
    if (!editingProduct && selectedFabricId) {
      const fab = fabrics.find(f => f.id === selectedFabricId);
      if (fab) {
        if (!name || name === 'New Fabric Product') {
          setName(`${fab.name} Natural`);
        }
        if (fab.defaultImage && productImages.length === 1 && productImages[0].includes('unsplash')) {
          setProductImages([fab.defaultImage]);
        }
      }
    }
  }, [selectedFabricId]);

  const toggleSizeFormat = (id: string) => {
    if (selectedSizeFormatIds.includes(id)) {
      if (selectedSizeFormatIds.length === 1) return; // keep at least 1
      setSelectedSizeFormatIds(selectedSizeFormatIds.filter(x => x !== id));
    } else {
      setSelectedSizeFormatIds([...selectedSizeFormatIds, id]);
    }
  };

  const toggleVariant = (id: string) => {
    if (selectedVariantIds.includes(id)) {
      if (selectedVariantIds.length === 1) return; // keep at least 1
      setSelectedVariantIds(selectedVariantIds.filter(x => x !== id));
    } else {
      setSelectedVariantIds([...selectedVariantIds, id]);
    }
  };

  // Image Gallery Manipulation Functions
  const setAsMainThumbnail = (index: number) => {
    if (index === 0) return;
    const updated = [...productImages];
    const [moved] = updated.splice(index, 1);
    updated.unshift(moved);
    setProductImages(updated);
  };

  const moveImageLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...productImages];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setProductImages(updated);
  };

  const moveImageRight = (index: number) => {
    if (index >= productImages.length - 1) return;
    const updated = [...productImages];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setProductImages(updated);
  };

  const removeImage = (index: number) => {
    if (productImages.length === 1) return; // Keep at least 1 image
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleFinishSave = async () => {
    const selectedFabric = fabrics.find(f => f.id === selectedFabricId);
    const selectedGsm = gsmWeights.find(g => g.id === selectedGsmId);

    const productPayload: Partial<Product> = {
      name: name || (selectedFabric ? selectedFabric.name : 'Custom Fabric'),
      category: selectedCategoryName,
      category_id: categories.find(c => c.name.toLowerCase() === selectedCategoryName.toLowerCase())?.id || `cat-${selectedCategoryName.toLowerCase()}`,
      fabric_id: selectedFabricId,
      gsm_id: selectedGsmId,
      size_format_ids: selectedSizeFormatIds,
      variant_ids: selectedVariantIds,
      gsm: selectedGsm ? selectedGsm.gsmValue : 100,
      width,
      count,
      color: 'Natural White',
      colorCode: '#ffffff',
      price_per_meter: pricePerMeter,
      swatch_test_price: swatchTestPrice,
      swatch_big_price: swatchBigPrice,
      print_surcharge_per_meter: printSurcharge,
      description,
      images: productImages.length > 0 ? productImages : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      weave_type: weaveType,
      composition,
      in_stock: true,
      featured: true
    };

    const result = await onSaveProduct(productPayload);
    const finalProduct = (result || {
      id: editingProduct?.id || `prod-${Date.now()}`,
      ...productPayload
    }) as Product;

    setPublishedProductData(finalProduct);
    setShowPublishSuccessModal(true);
  };

  const stepsList = [
    { num: 1, label: 'Basic Info', icon: Layers },
    { num: 2, label: 'Select Fabric', icon: Shirt },
    { num: 3, label: 'Select GSM', icon: Weight },
    { num: 4, label: 'Size Formats', icon: Ruler },
    { num: 5, label: 'Variant Base', icon: SlidersHorizontal },
    { num: 6, label: 'Pricing', icon: DollarSign },
    { num: 7, label: 'Media & Review', icon: ImageIcon }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-white shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">
            WooCommerce Style Product Creation
          </span>
          <h2 className="text-xl font-bold font-serif text-white">
            {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product (Modular Selection)'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {stepsList.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          return (
            <button
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg scale-102'
                  : isCompleted
                  ? 'bg-slate-800 text-emerald-400 border-emerald-900 font-bold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-1 text-[11px] font-mono mb-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>STEP {step.num}</span>
              </div>
              <span className="text-[11px] truncate w-full">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-slate-950/70 p-6 rounded-3xl border border-slate-800 min-h-[320px]">
        
        {/* STEP 1: BASIC INFO */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>Step 1: Product Basic Information</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold text-xs mb-1">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Bio-Cotton Mulmul Satin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold text-xs mb-1">Select Master Category *</label>
              <select
                value={selectedCategoryName}
                onChange={(e) => setSelectedCategoryName(e.target.value as CategoryType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm font-semibold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.description.slice(0, 40)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold text-xs mb-1">Product Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 2: SELECT FABRIC */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Shirt className="w-4 h-4" />
              <span>Step 2: Select Master Fabric Base</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold text-xs mb-1">
                Choose Fabric from Master Library *
              </label>
              <select
                value={selectedFabricId}
                onChange={(e) => setSelectedFabricId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm font-bold"
              >
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — [{f.categoryName}]
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Fabric Preview Card */}
            {selectedFabricId && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 flex items-center space-x-4">
                <img
                  src={fabrics.find(f => f.id === selectedFabricId)?.defaultImage}
                  alt="Selected Fabric"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-600"
                />
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    {fabrics.find(f => f.id === selectedFabricId)?.categoryName}
                  </span>
                  <h4 className="font-bold text-white text-sm">
                    {fabrics.find(f => f.id === selectedFabricId)?.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">✓ Reusable Master Fabric Selected</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SELECT GSM */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Weight className="w-4 h-4" />
              <span>Step 3: Select Master GSM Density Weight</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold text-xs mb-1">
                Choose GSM Weight *
              </label>
              <select
                value={selectedGsmId}
                onChange={(e) => setSelectedGsmId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm font-extrabold font-mono"
              >
                {gsmWeights.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.gsmValue} GSM ({g.label})
                  </option>
                ))}
              </select>
            </div>

            {/* GSM Badges Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {gsmWeights.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGsmId(g.id)}
                  className={`p-3 rounded-2xl border text-center transition ${
                    selectedGsmId === g.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-base font-extrabold block">{g.gsmValue} GSM</span>
                  <span className="text-[10px] uppercase font-bold">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: SELECT SIZE FORMATS (MULTI-SELECT) */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Ruler className="w-4 h-4" />
              <span>Step 4: Multi-Select Available Fabric Size Formats</span>
            </div>

            <p className="text-xs text-slate-400">
              Check all size cut options that will be available for customers to order this fabric in.
            </p>

            <div className="space-y-2">
              {sizeFormats.map((fmt) => {
                const isChecked = selectedSizeFormatIds.includes(fmt.id);
                return (
                  <label
                    key={fmt.id}
                    onClick={() => toggleSizeFormat(fmt.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      isChecked
                        ? 'bg-blue-950/80 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-white text-xs block">{fmt.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">{fmt.dimensions}</span>
                      </div>
                    </div>

                    <span className="bg-slate-800 text-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono">
                      {fmt.pricingType}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: SELECT VARIANT BASE (MULTI-SELECT) */}
        {currentStep === 5 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Step 5: Multi-Select Fabric Variant Base Options</span>
            </div>

            <p className="text-xs text-slate-400">
              Select available pre-treatments, bleached bases, and finish options for this product.
            </p>

            <div className="space-y-2">
              {variantBases.map((v) => {
                const isChecked = selectedVariantIds.includes(v.id);
                return (
                  <label
                    key={v.id}
                    onClick={() => toggleVariant(v.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      isChecked
                        ? 'bg-amber-950/60 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-white text-xs block">{v.name}</span>
                        <span className="text-[11px] text-slate-400">
                          Color: {v.baseColor} • Finish: {v.finishType}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {v.priceModifier > 0 ? `+₹${v.priceModifier}` : 'Included (+₹0)'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: PRICING */}
        {currentStep === 6 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Step 6: Pricing & Swatch Rates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Base Price / Meter ($ or ₹) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={pricePerMeter}
                  onChange={(e) => setPricePerMeter(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-extrabold text-base focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Print Surcharge / Meter ($ or ₹)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={printSurcharge}
                  onChange={(e) => setPrintSurcharge(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-amber-400 font-extrabold text-base focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Test Swatch Price (20x20 cm) ($ or ₹)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={swatchTestPrice}
                  onChange={(e) => setSwatchTestPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Big Swatch Price (75x100 cm) ($ or ₹)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={swatchBigPrice}
                  onChange={(e) => setSwatchBigPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: MEDIA & FINAL REVIEW */}
        {currentStep === 7 && (
          <div className="space-y-5 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <ImageIcon className="w-4 h-4" />
              <span>Step 7: Product Images & Final Review</span>
            </div>

            {/* WORDPRESS-STYLE MEDIA SELECTION UI */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-white font-bold text-xs">
                    Product Images ({productImages.length})
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    First image is Main Thumbnail. Next images form Product Gallery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Select from Media Library</span>
                </button>
              </div>

              {/* Selected Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 bg-slate-950 group ${
                      idx === 0 ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-800'
                    }`}
                  >
                    <img src={img} alt={`Product ${idx}`} className="w-full h-28 object-cover" />

                    {/* Badge */}
                    <div className="absolute top-1.5 left-1.5">
                      {idx === 0 ? (
                        <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          Main Thumbnail
                        </span>
                      ) : (
                        <span className="bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Gallery #{idx}
                        </span>
                      )}
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-1.5">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsMainThumbnail(idx)}
                          className="p-1 bg-amber-500 text-slate-950 rounded-lg font-bold text-[10px]"
                          title="Set as Main Thumbnail"
                        >
                          Main
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveImageLeft(idx)}
                        className={`p-1 rounded-lg ${idx === 0 ? 'bg-slate-800 text-slate-600' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === productImages.length - 1}
                        onClick={() => moveImageRight(idx)}
                        className={`p-1 rounded-lg ${idx === productImages.length - 1 ? 'bg-slate-800 text-slate-600' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      {productImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="p-1 bg-red-900/80 hover:bg-red-800 text-red-200 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Usable Width</label>
                <input
                  type="text"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Yarn Count</label>
                <input
                  type="text"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">{name || 'New Product'}</span>
                <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                  {selectedCategoryName}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-500 block">Master Fabric:</span>
                  <span className="font-bold text-white">
                    {fabrics.find(f => f.id === selectedFabricId)?.name || 'Custom'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">GSM Weight:</span>
                  <span className="font-bold text-white font-mono">
                    {gsmWeights.find(g => g.id === selectedGsmId)?.gsmValue || 100} GSM
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Base Price:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ${pricePerMeter.toFixed(2)}/m
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Size Formats:</span>
                  <span className="font-bold text-amber-400">
                    {selectedSizeFormatIds.length} Formats Selected
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Variants:</span>
                  <span className="font-bold text-blue-400">
                    {selectedVariantIds.length} Variants Selected
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Print Surcharge:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    +${printSurcharge.toFixed(2)}/m
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        initialSelectedUrls={productImages}
        onSelectImages={(newUrls) => {
          if (newUrls.length > 0) {
            setProductImages(newUrls);
          }
        }}
      />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition ${
            currentStep === 1
              ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            Cancel
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center space-x-1 shadow-md"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishSave}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center space-x-1.5 shadow-lg"
            >
              <span>Publish Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Publish Success Popup Modal */}
      {showPublishSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/50 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

            <div className="w-16 h-16 bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-xl text-white font-serif">Product Published!</h3>
              <p className="text-emerald-400 font-bold text-xs">
                Your product has been published successfully
              </p>
            </div>

            {/* Published Product Card Preview */}
            {publishedProductData && (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-left flex items-center space-x-3.5 shadow-inner">
                <img
                  src={publishedProductData.images?.[0] || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=400'}
                  alt={publishedProductData.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-800 uppercase tracking-wider inline-block mb-1">
                    Live in Store
                  </span>
                  <h4 className="font-bold text-white text-sm truncate">{publishedProductData.name}</h4>
                  <p className="text-amber-400 text-xs font-mono font-bold mt-0.5">
                    ${publishedProductData.price_per_meter?.toFixed(2) || '6.50'} / meter
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPublishSuccessModal(false);
                  onCancel(); // Back to admin list
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition"
              >
                Back to Products List
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPublishSuccessModal(false);
                  if (onViewProductInFrontend && publishedProductData?.id) {
                    onViewProductInFrontend(publishedProductData.id);
                  } else {
                    onCancel();
                  }
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs transition shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>View Product</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
