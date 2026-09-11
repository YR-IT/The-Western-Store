import React, { useState, useEffect } from 'react';
import { ImageKitUploader } from './ImageKitUploader';
import { Category } from '../../types';
import { X, Sparkles, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';

interface CategoryEditorModalProps {
  category: Category | null; // null means adding a new category
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
}

const CATEGORY_IMAGE_PRESETS = [
  {
    label: 'Stitched Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Lehenga Choli',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Ethnic & Western Gowns',
    url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Jeans & Chic Tops',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Designer Kurti',
    url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Contemporary Dresses',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Salwar & Anarkali Suits',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '2-Piece Cord Sets',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Sharara & Gharara',
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Winter & Velvet Edit',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  },
];

export const CategoryEditorModal: React.FC<CategoryEditorModalProps> = ({
  category,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = !!category;

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [customSlugEdited, setCustomSlugEdited] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setSubtitle(category.subtitle || '');
      setImage(category.image || '');
      setSlug(category.slug || '');
      setCustomSlugEdited(true);
    } else {
      setName('');
      setSubtitle('');
      setImage(CATEGORY_IMAGE_PRESETS[0].url);
      setSlug('');
      setCustomSlugEdited(false);
    }
  }, [category, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!customSlugEdited || !category) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    onSave({
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      image: image.trim() || CATEGORY_IMAGE_PRESETS[0].url,
      slug: finalSlug,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#EAE4D9] z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE4D9] bg-[#FAF8F3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#721B29]/10 text-[#721B29] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#242120]">
                {isEditing ? `Edit Category: ${category.name}` : 'Add New Category'}
              </h3>
              <p className="text-xs text-[#736B63]">
                Configure department title, visual banner, and storefront navigation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#736B63] hover:text-[#242120] hover:bg-[#EAE4D9]/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#242120]">
          <form id="category-editor-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block font-semibold text-[#242120] mb-1">
                Category / Department Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sharara & Gharara Sets, Party Gowns"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
              />
              <p className="text-[11px] text-[#736B63] mt-1">
                This appears in Header navigation, Homepage circular circles, and Filter menus.
              </p>
            </div>

            {/* Subtitle / Tagline */}
            <div>
              <label className="block font-semibold text-[#242120] mb-1">
                Subtitle / Marketing Tagline (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Royal festive edits for wedding season"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
              />
            </div>

            {/* URL Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#242120]">URL Identifier (Slug)</label>
                <button
                  type="button"
                  onClick={() => {
                    const autoSlug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setSlug(autoSlug);
                  }}
                  className="text-[11px] text-[#721B29] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate from Name</span>
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-2.5 py-2 bg-[#FAF8F3] border border-r-0 border-[#D9CEBF] text-[#736B63] text-xs rounded-l-sm select-none">
                  /category/
                </span>
                <input
                  type="text"
                  required
                  placeholder="stitched-sarees"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setCustomSlugEdited(true);
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-r-sm text-xs text-[#242120] font-mono focus:outline-none focus:border-[#721B29]"
                />
              </div>
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="block font-semibold text-[#242120]">
                Category Cover Image <span className="text-rose-600">*</span>
              </label>

              {/* Preview and Upload Input */}
              <div className="flex items-start gap-4 p-3 bg-[#FAF8F3] rounded-lg border border-[#EAE4D9]">
                <div className="relative w-20 h-20 rounded-full border-2 border-[#721B29] overflow-hidden flex-shrink-0 bg-white shadow-sm">
                  {image ? (
                    <img
                      src={image}
                      alt={name || 'Category preview'}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = CATEGORY_IMAGE_PRESETS[0].url;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8C8276]">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5">
                  <ImageKitUploader
                    folder="/categories"
                    buttonText="Upload Category Banner to ImageKit"
                    onUploadSuccess={(url) => setImage(url)}
                  />
                  <input
                    type="url"
                    required
                    placeholder="Or paste image URL (https://...)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>

              {/* Quick Image Presets */}
              <div>
                <p className="text-[11px] font-semibold text-[#736B63] mb-1.5">
                  Curated Presets for Indian Boutique:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CATEGORY_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`p-1 rounded border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                        image === preset.url
                          ? 'border-[#721B29] bg-[#721B29]/10 font-bold text-[#721B29]'
                          : 'border-[#EAE4D9] bg-white hover:border-[#721B29] text-[#4A453E]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-[10px] truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EAE4D9] bg-[#FAF8F3] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#D9CEBF] bg-white hover:bg-[#FAF7F0] text-[#242120] rounded-sm text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="category-editor-form"
            className="px-5 py-2 bg-[#721B29] hover:bg-[#852031] text-white rounded-sm text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? 'Save Category Updates' : 'Add Category'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
