import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { STORE_INFO } from '../data/mockData';
import { Ruler, MessageCircle } from 'lucide-react';

export const SizeGuidePage: React.FC = () => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [activeTab, setActiveTab] = useState<'ethnic' | 'western'>('ethnic');

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
    <div className="bg-[#FAF8F3] min-h-[70vh] py-10 sm:py-14">
      <SEOHead
        title="Size Guide"
        description="Standard size and fit guide for ethnic wear and western denim at The Western Store Kurukshetra."
        canonical="/size-guide"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-3">
            <Ruler className="w-3.5 h-3.5" />
            Fit &amp; Sizing
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#242120]">Size Guide</h1>
          <p className="text-sm text-[#736B63] mt-2">
            Measure over light clothing. When between sizes, we usually recommend sizing up for comfort.
          </p>
        </div>

        <div className="bg-white border border-[#EAE4D9] rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex rounded-md p-1 bg-[#EAE4D9]/70 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('ethnic')}
                className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'ethnic' ? 'bg-[#721B29] text-white shadow-xs' : 'text-[#4A453E]'
                }`}
              >
                Ethnic / Suits
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('western')}
                className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'western' ? 'bg-[#721B29] text-white shadow-xs' : 'text-[#4A453E]'
                }`}
              >
                Western / Denim
              </button>
            </div>
            <div className="flex rounded-md p-1 bg-[#EAE4D9]/70 text-xs">
              <button
                type="button"
                onClick={() => setUnit('inches')}
                className={`px-3 py-1.5 rounded-sm font-medium cursor-pointer ${
                  unit === 'inches' ? 'bg-white text-[#721B29] shadow-xs' : 'text-[#4A453E]'
                }`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1.5 rounded-sm font-medium cursor-pointer ${
                  unit === 'cm' ? 'bg-white text-[#721B29] shadow-xs' : 'text-[#4A453E]'
                }`}
              >
                cm
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'ethnic' ? (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE4D9] text-[#8C8276] uppercase tracking-wider">
                    <th className="py-2 pr-3 font-semibold">Size</th>
                    <th className="py-2 pr-3 font-semibold">Bust</th>
                    <th className="py-2 pr-3 font-semibold">Waist</th>
                    <th className="py-2 pr-3 font-semibold">Hip</th>
                    <th className="py-2 font-semibold">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {ethnicSizes.map((row) => (
                    <tr key={row.size} className="border-b border-[#F0EBE3] text-[#242120]">
                      <td className="py-2.5 pr-3 font-bold">{row.size}</td>
                      <td className="py-2.5 pr-3">{row.bust}</td>
                      <td className="py-2.5 pr-3">{row.waist}</td>
                      <td className="py-2.5 pr-3">{row.hip}</td>
                      <td className="py-2.5">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE4D9] text-[#8C8276] uppercase tracking-wider">
                    <th className="py-2 pr-3 font-semibold">Waist</th>
                    <th className="py-2 pr-3 font-semibold">Measured Waist</th>
                    <th className="py-2 pr-3 font-semibold">Hip</th>
                    <th className="py-2 font-semibold">Inseam</th>
                  </tr>
                </thead>
                <tbody>
                  {westernDenimSizes.map((row) => (
                    <tr key={row.waistSize} className="border-b border-[#F0EBE3] text-[#242120]">
                      <td className="py-2.5 pr-3 font-bold">{row.waistSize}</td>
                      <td className="py-2.5 pr-3">{row.waist}</td>
                      <td className="py-2.5 pr-3">{row.hip}</td>
                      <td className="py-2.5">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-[11px] text-[#736B63] mt-4 leading-relaxed">
            These are boutique-standard reference measurements. Always check the size options listed on the product page — some styles run smaller or have limited size sets.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <Link to="/shop" className="text-xs font-bold text-[#721B29] hover:underline">
            ← Back to shop
          </Link>
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('Hi! Can you help me confirm my size for an outfit?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-lg"
          >
            <MessageCircle className="w-4 h-4" />
            Ask a stylist on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
