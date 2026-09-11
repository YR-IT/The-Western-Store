import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Ruler, HelpCircle } from 'lucide-react';

export const SizeChartModal: React.FC = () => {
  const { isSizeChartOpen, setIsSizeChartOpen } = useStore();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [activeTab, setActiveTab] = useState<'ethnic' | 'western'>('ethnic');

  if (!isSizeChartOpen) return null;

  const ethnicSizes = [
    { size: 'XS', bust: unit === 'inches' ? '34' : '86', waist: unit === 'inches' ? '28' : '71', hip: unit === 'inches' ? '36' : '91', length: unit === 'inches' ? '44' : '112' },
    { size: 'S', bust: unit === 'inches' ? '36' : '91', waist: unit === 'inches' ? '30' : '76', hip: unit === 'inches' ? '38' : '96', length: unit === 'inches' ? '44' : '112' },
    { size: 'M', bust: unit === 'inches' ? '38' : '96', waist: unit === 'inches' ? '32' : '81', hip: unit === 'inches' ? '40' : '101', length: unit === 'inches' ? '45' : '114' },
    { size: 'L', bust: unit === 'inches' ? '40' : '101', waist: unit === 'inches' ? '34' : '86', hip: unit === 'inches' ? '42' : '106', length: unit === 'inches' ? '45' : '114' },
    { size: 'XL', bust: unit === 'inches' ? '42' : '106', waist: unit === 'inches' ? '36' : '91', hip: unit === 'inches' ? '44' : '112', length: unit === 'inches' ? '46' : '117' },
    { size: 'XXL', bust: unit === 'inches' ? '44' : '112', waist: unit === 'inches' ? '38' : '96', hip: unit === 'inches' ? '46' : '117', length: unit === 'inches' ? '46' : '117' },
  ];

  const westernDenimSizes = [
    { waistSize: '26', waist: unit === 'inches' ? '26' : '66', hip: unit === 'inches' ? '35' : '89', inseam: unit === 'inches' ? '30' : '76' },
    { waistSize: '28', waist: unit === 'inches' ? '28' : '71', hip: unit === 'inches' ? '37' : '94', inseam: unit === 'inches' ? '30.5' : '77' },
    { waistSize: '30', waist: unit === 'inches' ? '30' : '76', hip: unit === 'inches' ? '39' : '99', inseam: unit === 'inches' ? '31' : '79' },
    { waistSize: '32', waist: unit === 'inches' ? '32' : '81', hip: unit === 'inches' ? '41' : '104', inseam: unit === 'inches' ? '31.5' : '80' },
    { waistSize: '34', waist: unit === 'inches' ? '34' : '86', hip: unit === 'inches' ? '43' : '109', inseam: unit === 'inches' ? '32' : '81' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={() => setIsSizeChartOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-xl shadow-2xl border border-[#E0D7C8] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#EAE4D9] flex items-center justify-between bg-[#F8F5EE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#721B29]/10 flex items-center justify-center text-[#721B29]">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#242120]">
                Standard Size & Fit Guide
              </h3>
              <p className="text-[11px] text-[#736B63]">The Western Store Kurukshetra sizing specs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSizeChartOpen(false)}
            className="p-1.5 text-[#4A453E] hover:text-[#721B29] rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs & Unit Switcher */}
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex rounded-md p-1 bg-[#EAE4D9]/70 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('ethnic')}
                className={`px-3 py-1.5 rounded-sm font-medium transition-colors ${
                  activeTab === 'ethnic' ? 'bg-[#721B29] text-white shadow-xs' : 'text-[#4A453E]'
                }`}
              >
                Kurtis, Suits & Dresses
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('western')}
                className={`px-3 py-1.5 rounded-sm font-medium transition-colors ${
                  activeTab === 'western' ? 'bg-[#721B29] text-white shadow-xs' : 'text-[#4A453E]'
                }`}
              >
                Jeans & Bottoms
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#8C8276] mr-1">Unit:</span>
              <button
                type="button"
                onClick={() => setUnit('inches')}
                className={`px-2.5 py-1 rounded-sm border ${
                  unit === 'inches' ? 'bg-[#242120] text-white border-[#242120]' : 'border-[#D9CEBF] text-[#4A453E]'
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-sm border ${
                  unit === 'cm' ? 'bg-[#242120] text-white border-[#242120]' : 'border-[#D9CEBF] text-[#4A453E]'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-[#EAE4D9] rounded-lg bg-white">
            {activeTab === 'ethnic' ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] border-b border-[#EAE4D9] text-[#736B63] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Standard Size</th>
                    <th className="p-3">Bust ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Hip ({unit})</th>
                    <th className="p-3">Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE6] text-[#242120]">
                  {ethnicSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-[#FDFBF7]">
                      <td className="p-3 font-bold text-[#721B29]">{row.size}</td>
                      <td className="p-3">{row.bust}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.hip}</td>
                      <td className="p-3">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] border-b border-[#EAE4D9] text-[#736B63] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Waist Size</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Hip ({unit})</th>
                    <th className="p-3">Inseam ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE6] text-[#242120]">
                  {westernDenimSizes.map((row) => (
                    <tr key={row.waistSize} className="hover:bg-[#FDFBF7]">
                      <td className="p-3 font-bold text-[#721B29]">{row.waistSize}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.hip}</td>
                      <td className="p-3">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Saree Note */}
          <div className="mt-4 p-3 bg-[#FAF7F0] rounded-lg border border-[#EAE4D9] flex items-start gap-2.5 text-xs text-[#736B63]">
            <HelpCircle className="w-4 h-4 text-[#B8860B] flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#242120]">Note for Pre-Stitched Ethnic Wear:</strong> Our ready-to-wear sarees and pre-stitched ethnic sets feature a flexible elastic waistband with hook extenders that easily fit waist sizes 26 to 36 inches (Plus size available up to 44 inches).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE4D9] bg-[#F8F5EE] flex justify-end">
          <button
            type="button"
            onClick={() => setIsSizeChartOpen(false)}
            className="px-5 py-2 bg-[#721B29] text-white text-xs font-semibold rounded-sm hover:bg-[#852031] transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
