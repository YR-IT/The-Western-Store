import React, { useState, useEffect } from 'react';
import { ImageKitUploader } from './ImageKitUploader';
import { Category } from '../../types';
import { X, Sparkles, Image as ImageIcon, Check } from 'lucide-react';

interface CategoryEditorModalProps {
  category: Category | null; // null means adding a new category
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<Category>) => void;
}

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
      setImage('');
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
      image: image.trim(),
      slug: finalSlug,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-xl bg-[#FDFBF7] rounded-lg shadow-2xl border border-[#EAE4D9] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EAE4D9] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#721B29] uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boutique Department Manager</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#242120]">
              {isEditing ? `Edit Category — ${category?.name}` : 'Add New Boutique Category'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#736B63] hover:text-[#721B29] hover:bg-[#FAF7F0] rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <form id="category-editor-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A453E] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Silk Sarees, Cord Sets, Anarkali Suits"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs font-semibold text-[#242120] focus:outline-none focus:border-[#721B29]"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A453E] mb-1">
                URL Slug / Key
              </label>
              <input
                type="text"
                required
                placeholder="e.g. silk-sarees"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setCustomSlugEdited(true);
                }}
                className="w-full px-3.5 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs font-mono text-[#242120] focus:outline-none focus:border-[#721B29]"
              />
              <p className="text-[10px] text-[#8C8276] mt-0.5">
                Unique identifier used for routing and database lookups.
              </p>
            </div>

            {/* Subtitle / Tagline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A453E] mb-1">
                Category Tagline / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Banarasi sarees, lehengas & festive edits"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
              />
            </div>

            {/* Category Image Section (Upload or Link Only) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A453E]">
                Category Banner Image *
              </label>

              {/* Preview Box & Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="w-20 h-24 rounded-md overflow-hidden bg-[#ECE6DB] border border-[#D9CEBF] flex-shrink-0 flex items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt={name || 'Category preview'}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8C8276] p-1 text-center">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[9px]">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5">
                  <ImageKitUploader
                    folder="/categories"
                    buttonText="Upload Category Photo to ImageKit"
                    onUploadSuccess={(url) => setImage(url)}
                  />
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-sm text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
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
