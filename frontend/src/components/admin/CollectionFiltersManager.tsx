import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Filter, RotateCcw, Plus, Trash2, Check, Edit2, Eye, EyeOff, Sliders } from 'lucide-react';

export const CollectionFiltersManager: React.FC = () => {
  const { collectionFilters, updateCollectionFilters, resetCollectionFilters } = useStore();
  const [activeTab, setActiveTab] = useState<'budget' | 'fabric' | 'occasion' | 'size' | 'color' | 'sort'>('budget');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item inputs
  const [newBudgetLabel, setNewBudgetLabel] = useState('');
  const [newBudgetMin, setNewBudgetMin] = useState(0);
  const [newBudgetMax, setNewBudgetMax] = useState(999);

  const [newFabricLabel, setNewFabricLabel] = useState('');
  const [newOccasionLabel, setNewOccasionLabel] = useState('');
  const [newSizeLabel, setNewSizeLabel] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#721B29');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleBudgetTier = (id: string) => {
    const updated = (collectionFilters.budgetTiers || []).map((t) =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    );
    updateCollectionFilters({ budgetTiers: updated });
    showToast('Updated price tier filter visibility');
  };

  const handleAddBudgetTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetLabel.trim()) return;
    const minVal = Number(newBudgetMin) || 0;
    const maxVal = Number(newBudgetMax) || 999;
    const newTier = {
      id: `budget_${Date.now()}`,
      label: newBudgetLabel.trim(),
      minPrice: minVal,
      maxPrice: maxVal,
      enabled: true,
    };
    updateCollectionFilters({ budgetTiers: [...(collectionFilters.budgetTiers || []), newTier] });
    setNewBudgetLabel('');
    showToast(`Added budget tier "${newTier.label}"`);
  };

  const handleDeleteBudgetTier = (id: string) => {
    const updated = (collectionFilters.budgetTiers || []).filter((t) => t.id !== id);
    updateCollectionFilters({ budgetTiers: updated });
    showToast('Removed price tier filter');
  };

  const handleToggleFabric = (id: string) => {
    const updated = collectionFilters.fabrics.map((f) =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    );
    updateCollectionFilters({ fabrics: updated });
    showToast('Updated fabric filter visibility');
  };

  const handleAddFabric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFabricLabel.trim()) return;
    const val = newFabricLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newFab = {
      id: `fab_${Date.now()}`,
      label: newFabricLabel.trim(),
      value: val,
      enabled: true,
    };
    updateCollectionFilters({ fabrics: [...collectionFilters.fabrics, newFab] });
    setNewFabricLabel('');
    showToast(`Added fabric filter "${newFab.label}"`);
  };

  const handleDeleteFabric = (id: string) => {
    const updated = collectionFilters.fabrics.filter((f) => f.id !== id);
    updateCollectionFilters({ fabrics: updated });
    showToast('Removed fabric filter');
  };

  const handleToggleOccasion = (id: string) => {
    const updated = collectionFilters.occasions.map((o) =>
      o.id === id ? { ...o, enabled: !o.enabled } : o
    );
    updateCollectionFilters({ occasions: updated });
    showToast('Updated occasion filter visibility');
  };

  const handleAddOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOccasionLabel.trim()) return;
    const val = newOccasionLabel.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newOcc = {
      id: `occ_${Date.now()}`,
      label: newOccasionLabel.trim(),
      value: val,
      enabled: true,
    };
    updateCollectionFilters({ occasions: [...collectionFilters.occasions, newOcc] });
    setNewOccasionLabel('');
    showToast(`Added occasion filter "${newOcc.label}"`);
  };

  const handleDeleteOccasion = (id: string) => {
    const updated = collectionFilters.occasions.filter((o) => o.id !== id);
    updateCollectionFilters({ occasions: updated });
    showToast('Removed occasion filter');
  };

  const handleToggleSize = (id: string) => {
    const updated = collectionFilters.sizes.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    updateCollectionFilters({ sizes: updated });
    showToast('Updated size filter visibility');
  };

  const handleAddSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeLabel.trim()) return;
    const newSz = {
      id: `sz_${Date.now()}`,
      label: newSizeLabel.trim(),
      enabled: true,
    };
    updateCollectionFilters({ sizes: [...collectionFilters.sizes, newSz] });
    setNewSizeLabel('');
    showToast(`Added size filter "${newSz.label}"`);
  };

  const handleDeleteSize = (id: string) => {
    const updated = collectionFilters.sizes.filter((s) => s.id !== id);
    updateCollectionFilters({ sizes: updated });
    showToast('Removed size filter');
  };

  const handleToggleColor = (id: string) => {
    const updated = collectionFilters.colors.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    updateCollectionFilters({ colors: updated });
    showToast('Updated color filter visibility');
  };

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;
    const newCol = {
      id: `col_${Date.now()}`,
      name: newColorName.trim(),
      hex: newColorHex,
      enabled: true,
    };
    updateCollectionFilters({ colors: [...collectionFilters.colors, newCol] });
    setNewColorName('');
    showToast(`Added color filter swatch "${newCol.name}"`);
  };

  const handleDeleteColor = (id: string) => {
    const updated = collectionFilters.colors.filter((c) => c.id !== id);
    updateCollectionFilters({ colors: updated });
    showToast('Removed color filter');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1717] text-white px-4 py-3 rounded-lg shadow-xl border border-[#3E3435] flex items-center gap-2.5 text-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#EAE4D9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#721B29] font-bold uppercase tracking-wider mb-1">
            <Filter className="w-4 h-4" />
            <span>Storefront Settings</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#242120]">
            Collection Filters Manager
          </h1>
          <p className="text-xs text-[#736B63] mt-1">
            Configure price ranges, budget tiers, fabrics, occasions, sizes, and colors visible on collection pages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Reset collection filters to defaults?')) {
              resetCollectionFilters();
              showToast('Reset collection filters to defaults');
            }
          }}
          className="px-3.5 py-2 bg-white border border-[#D9CEBF] hover:bg-[#FAF8F3] text-[#242120] text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start md:self-auto transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#736B63]" />
          <span>Reset Filters Default</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE4D9] overflow-x-auto pb-1">
        {[
          { id: 'budget', label: 'Budget & Price Tiers' },
          { id: 'fabric', label: 'Fabric Types' },
          { id: 'occasion', label: 'Occasions' },
          { id: 'size', label: 'Size Chips' },
          { id: 'color', label: 'Color Swatches' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#721B29] text-[#721B29] bg-white shadow-xs'
                : 'border-transparent text-[#736B63] hover:text-[#242120]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Budget & Price Tiers */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#242120]">
              Active Budget & Price Ranges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(collectionFilters.budgetTiers || []).map((tier) => {
                const minVal = (tier as any).minPrice ?? (tier as any).min ?? 0;
                const maxVal = (tier as any).maxPrice ?? (tier as any).max ?? 99999;
                return (
                  <div
                    key={tier.id}
                    className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 ${
                      tier.enabled ? 'border-[#EAE4D9] bg-[#FAF8F3]' : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-[#242120] block">{tier.label}</span>
                      <span className="text-[11px] text-[#736B63]">
                        ₹{minVal.toLocaleString()} — {maxVal >= 99999 ? 'Above' : `₹${maxVal.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBudgetTier(tier.id)}
                        className={`p-1.5 rounded-md text-xs font-bold ${
                          tier.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                        }`}
                        title={tier.enabled ? 'Hide Tier' : 'Show Tier'}
                      >
                        {tier.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBudgetTier(tier.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"
                        title="Delete Tier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Budget Tier Form */}
          <form onSubmit={handleAddBudgetTier} className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#242120]">Add New Price Range / Budget Tier</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">Display Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Under ₹1,499"
                  value={newBudgetLabel}
                  onChange={(e) => setNewBudgetLabel(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">Min Price (₹)</label>
                <input
                  type="number"
                  value={newBudgetMin}
                  onChange={(e) => setNewBudgetMin(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  value={newBudgetMax}
                  onChange={(e) => setNewBudgetMax(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#721B29] text-white text-xs font-bold rounded-lg hover:bg-[#57141F] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Price Tier</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Fabric Types */}
      {activeTab === 'fabric' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#242120]">Fabric Filters</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(collectionFilters.fabrics || []).map((fab) => (
                <div
                  key={fab.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                    fab.enabled ? 'border-[#EAE4D9] bg-[#FAF8F3]' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <span className="font-bold text-xs text-[#242120]">{fab.label}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFabric(fab.id)}
                      className={`p-1 rounded-md text-xs ${
                        fab.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {fab.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFabric(fab.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddFabric} className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#242120]">Add New Fabric Filter</h4>
            <div className="flex items-center gap-3 max-w-md">
              <input
                type="text"
                required
                placeholder="e.g. Velvet & Brocade"
                value={newFabricLabel}
                onChange={(e) => setNewFabricLabel(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#721B29] text-white text-xs font-bold rounded-lg hover:bg-[#57141F] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Fabric</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Occasions */}
      {activeTab === 'occasion' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#242120]">Occasion Filters</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(collectionFilters.occasions || []).map((occ) => (
                <div
                  key={occ.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                    occ.enabled ? 'border-[#EAE4D9] bg-[#FAF8F3]' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <span className="font-bold text-xs text-[#242120]">{occ.label}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleOccasion(occ.id)}
                      className={`p-1 rounded-md text-xs ${
                        occ.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {occ.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOccasion(occ.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddOccasion} className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#242120]">Add New Occasion Filter</h4>
            <div className="flex items-center gap-3 max-w-md">
              <input
                type="text"
                required
                placeholder="e.g. Sangeet & Reception"
                value={newOccasionLabel}
                onChange={(e) => setNewOccasionLabel(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#721B29] text-white text-xs font-bold rounded-lg hover:bg-[#57141F] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Occasion</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Sizes */}
      {activeTab === 'size' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#242120]">Size Filters</h3>

            <div className="flex flex-wrap gap-2">
              {(collectionFilters.sizes || []).map((sz) => (
                <div
                  key={sz.id}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                    sz.enabled ? 'border-[#721B29] bg-[#721B29] text-white' : 'border-gray-300 bg-gray-100 text-gray-500 opacity-60'
                  }`}
                >
                  <span className="font-bold text-xs">{sz.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleSize(sz.id)}
                    className="p-0.5 hover:opacity-80"
                    title={sz.enabled ? 'Disable Size' : 'Enable Size'}
                  >
                    {sz.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-gray-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSize(sz.id)}
                    className="p-0.5 hover:text-rose-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddSize} className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#242120]">Add New Size Chip</h4>
            <div className="flex items-center gap-3 max-w-sm">
              <input
                type="text"
                required
                placeholder="e.g. 3XL or Plus Size"
                value={newSizeLabel}
                onChange={(e) => setNewSizeLabel(e.target.value)}
                className="flex-1 px-3 py-2 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#721B29] text-white text-xs font-bold rounded-lg hover:bg-[#57141F] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Size</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: Colors */}
      {activeTab === 'color' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#242120]">Color Swatches</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(collectionFilters.colors || []).map((col) => (
                <div
                  key={col.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-2.5 ${
                    col.enabled ? 'border-[#EAE4D9] bg-[#FAF8F3]' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="w-5 h-5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="font-bold text-xs text-[#242120] truncate">{col.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleColor(col.id)}
                      className={`p-1.5 rounded-md text-xs font-bold transition-colors flex items-center justify-center ${
                        col.enabled ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={col.enabled ? 'Hide Color' : 'Show Color'}
                    >
                      {col.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteColor(col.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors flex items-center justify-center"
                      title="Delete Color"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddColor} className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#242120]">Add New Color Swatch</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
              <div>
                <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">Color Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Maroon"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">Hex Code</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded-md border border-[#D9CEBF] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-20 px-2 py-1.5 border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#721B29] text-white text-xs font-bold rounded-lg hover:bg-[#57141F] flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Color</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
