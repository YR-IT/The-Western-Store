import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HomeSectionConfig, HomeSectionType } from '../../types';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Image,
  RotateCcw,
  Sparkles,
  Check,
  Edit2,
  X,
  Link,
  Sliders,
} from 'lucide-react';

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
];

export const HomepageSectionsManager: React.FC = () => {
  const {
    homeSections,
    updateHomeSection,
    addHomeSection,
    deleteHomeSection,
    reorderHomeSections,
    resetHomeSections,
  } = useStore();

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newSection, setNewSection] = useState<{
    title: string;
    tagline: string;
    subtitle: string;
    type: HomeSectionType;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
  }>({
    title: 'Festival Flash Sale',
    tagline: 'Limited Time Edit',
    subtitle: 'Flat 20% off on all heavy bridal lehengas and stitched sarees',
    type: 'custom-banner',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Shop Sale Now',
    buttonLink: 'plp',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sortedSections = [...homeSections].sort((a, b) => a.order - b.order);

  const handleAddPhoto = (sectionId: string, url: string) => {
    if (!url.trim()) return;
    const sec = homeSections.find((s) => s.id === sectionId);
    if (!sec) return;
    const updatedImages = [...(sec.images || []), url.trim()];
    updateHomeSection(sectionId, { images: updatedImages });
    setNewImageUrl('');
    showToast('New photo added to section!');
  };

  const handleRemovePhoto = (sectionId: string, photoIdx: number) => {
    const sec = homeSections.find((s) => s.id === sectionId);
    if (!sec) return;
    const updatedImages = sec.images.filter((_, idx) => idx !== photoIdx);
    updateHomeSection(sectionId, { images: updatedImages });
    showToast('Photo removed from section');
  };

  const handleCreateCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.title.trim()) return;
    addHomeSection({
      title: newSection.title.trim(),
      tagline: newSection.tagline.trim(),
      subtitle: newSection.subtitle.trim(),
      type: newSection.type,
      enabled: true,
      images: newSection.imageUrl ? [newSection.imageUrl.trim()] : [],
      buttonText: newSection.buttonText.trim(),
      buttonLink: newSection.buttonLink,
    });
    setIsAddModalOpen(false);
    showToast(`Added new section "${newSection.title}" to homepage!`);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto">
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
            <Sliders className="w-4 h-4" />
            <span>Storefront Homepage Manager</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#242120]">
            Homepage Sections & Photos
          </h1>
          <p className="text-xs text-[#736B63] mt-1">
            Add new banners, change section photos, update titles/subtitles, or reorder sections dynamically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Section</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset homepage layout and section photos to default settings?')) {
                resetHomeSections();
                showToast('Reset homepage sections to defaults');
              }
            }}
            className="px-3.5 py-2 bg-white border border-[#D9CEBF] hover:bg-[#FAF8F3] text-[#242120] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#736B63]" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sortedSections.map((sec, index) => {
          const isEditing = editingSectionId === sec.id;
          return (
            <div
              key={sec.id}
              className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                sec.enabled ? 'border-[#EAE4D9]' : 'border-gray-200 opacity-60 bg-gray-50'
              }`}
            >
              {/* Section Header Strip */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F3]/60 border-b border-[#EAE4D9]">
                <div className="flex items-center gap-3">
                  {/* Order Controls */}
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-[#EAE4D9]">
                    <span className="text-xs font-bold text-[#721B29] w-5 text-center">#{index + 1}</span>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => reorderHomeSections(sec.id, 'up')}
                        className="p-0.5 hover:text-[#721B29] disabled:opacity-30 cursor-pointer"
                        title="Move Section Up"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === sortedSections.length - 1}
                        onClick={() => reorderHomeSections(sec.id, 'down')}
                        className="p-0.5 hover:text-[#721B29] disabled:opacity-30 cursor-pointer"
                        title="Move Section Down"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-[#242120]">{sec.title}</h3>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#EAE4D9] text-[#4A453E] rounded-full">
                        {sec.type}
                      </span>
                    </div>
                    {sec.subtitle && <p className="text-xs text-[#736B63] mt-0.5 line-clamp-1">{sec.subtitle}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Toggle Enable/Disable */}
                  <button
                    type="button"
                    onClick={() => {
                      updateHomeSection(sec.id, { enabled: !sec.enabled });
                      showToast(
                        !sec.enabled
                          ? `Enabled "${sec.title}" on homepage`
                          : `Disabled "${sec.title}" on homepage`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      sec.enabled
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{sec.enabled ? 'Visible on Home' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSectionId(isEditing ? null : sec.id)}
                    className="px-3 py-1.5 bg-white border border-[#D9CEBF] hover:bg-[#FAF8F3] text-xs font-medium text-[#242120] rounded-lg flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#721B29]" />
                    <span>{isEditing ? 'Done' : 'Edit Section'}</span>
                  </button>

                  {sec.id.startsWith('sec_') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete custom section "${sec.title}"?`)) {
                          deleteHomeSection(sec.id);
                          showToast('Section deleted');
                        }
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Custom Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Editable Fields & Photos Area */}
              <div className="p-4 sm:p-5 space-y-4">
                {isEditing ? (
                  <div className="bg-[#FAF8F3] p-4 rounded-lg border border-[#EAE4D9] space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => updateHomeSection(sec.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md text-xs font-semibold focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">
                          Tagline / Eyebrow
                        </label>
                        <input
                          type="text"
                          value={sec.tagline || ''}
                          onChange={(e) => updateHomeSection(sec.id, { tagline: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">
                        Subtitle / Description
                      </label>
                      <input
                        type="text"
                        value={sec.subtitle || ''}
                        onChange={(e) => updateHomeSection(sec.id, { subtitle: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                      />
                    </div>

                    {(sec.type === 'custom-banner' || sec.buttonText) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={sec.buttonText || ''}
                            onChange={(e) => updateHomeSection(sec.id, { buttonText: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#4A453E] uppercase mb-1">
                            CTA Button Link Destination
                          </label>
                          <select
                            value={sec.buttonLink || 'plp'}
                            onChange={(e) => updateHomeSection(sec.id, { buttonLink: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md text-xs font-medium focus:outline-none focus:border-[#721B29]"
                          >
                            <option value="plp">Collections Page (PLP)</option>
                            <option value="whatsapp">Direct WhatsApp Chat</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Section Photos / Banner Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#242120] uppercase tracking-wider flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-[#721B29]" />
                      <span>Section Photos ({sec.images?.length || 0})</span>
                    </span>
                  </div>

                  {/* Photo Thumbnails */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
                    {(sec.images || []).map((imgUrl, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="group relative rounded-lg overflow-hidden border border-[#D9CEBF] bg-[#1A1415] aspect-video sm:aspect-square"
                      >
                        <img
                          src={imgUrl}
                          alt={`${sec.title} photo ${imgIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(sec.id, imgIdx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-rose-700"
                          title="Remove Photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {(!sec.images || sec.images.length === 0) && (
                      <div className="col-span-2 text-xs text-gray-500 italic py-2">
                        No custom photo uploaded. (Uses standard section layout)
                      </div>
                    )}
                  </div>

                  {/* Add New Photo Input */}
                  <div className="flex items-center gap-2 max-w-xl">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={editingSectionId === sec.id ? newImageUrl : ''}
                      onChange={(e) => {
                        setEditingSectionId(sec.id);
                        setNewImageUrl(e.target.value);
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md text-xs focus:outline-none focus:border-[#721B29]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddPhoto(sec.id, newImageUrl)}
                      className="px-3.5 py-1.5 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo</span>
                    </button>
                  </div>

                  {/* Quick Preset Photo Picker */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[#8C8276] font-medium">Quick Preset Photo:</span>
                    {PRESET_PHOTOS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleAddPhoto(sec.id, preset)}
                        className="text-[10px] bg-[#FAF8F3] hover:bg-[#EAE4D9] text-[#721B29] font-medium px-2 py-0.5 rounded border border-[#D9CEBF] transition-colors"
                      >
                        Preset #{pIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EAE4D9] max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#242120]">Add New Homepage Section</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomSection} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Section Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Festive Offer"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Tagline / Eyebrow
                </label>
                <input
                  type="text"
                  placeholder="e.g. Limited Time Offer"
                  value={newSection.tagline}
                  onChange={(e) => setNewSection({ ...newSection, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Get flat discounts on selected Kurukshetra store drapes"
                  value={newSection.subtitle}
                  onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Banner Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newSection.imageUrl}
                  onChange={(e) => setNewSection({ ...newSection, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={newSection.buttonText}
                    onChange={(e) => setNewSection({ ...newSection, buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                    Button Action
                  </label>
                  <select
                    value={newSection.buttonLink}
                    onChange={(e) => setNewSection({ ...newSection, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                  >
                    <option value="plp">Collections Page</option>
                    <option value="whatsapp">WhatsApp Order Chat</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAE4D9]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721B29] hover:bg-[#57141F] text-white font-bold rounded-lg shadow-sm"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
