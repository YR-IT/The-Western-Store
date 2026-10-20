import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { OrderHistoryPage } from '../components/OrderHistoryPage';
import { UserAvatar } from '../components/common/UserAvatar';
import { SEOHead } from '../components/common/SEOHead';
import {
  loadCustomerProfile,
  saveCustomerProfile,
  loadSavedAddresses,
  saveSavedAddresses,
  SavedAddress,
  CustomerProfile,
} from '../utils/customerProfile';
import { MapPin, Plus, Trash2, CheckCircle2, User, Package } from 'lucide-react';

type AccountTab = 'orders' | 'profile' | 'addresses';

export const AccountPage: React.FC = () => {
  const { currentUser } = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as AccountTab | null;
  const [tab, setTab] = useState<AccountTab>(
    tabParam === 'profile' || tabParam === 'addresses' || tabParam === 'orders' ? tabParam : 'orders'
  );

  const [profile, setProfile] = useState<CustomerProfile>({
    name: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
  });
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, 'id'>>({
    label: 'Home',
    name: currentUser?.name || '',
    phone: '',
    address: '',
    city: '',
    state: 'Haryana',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!currentUser) return;
    const saved = loadCustomerProfile(currentUser.id);
    setProfile({
      name: saved?.name || currentUser.name || '',
      phone: saved?.phone || '',
      email: saved?.email || currentUser.email || '',
    });
    setAddresses(loadSavedAddresses(currentUser.id));
  }, [currentUser]);

  useEffect(() => {
    if (tabParam === 'profile' || tabParam === 'addresses' || tabParam === 'orders') {
      setTab(tabParam);
    }
  }, [tabParam]);

  const switchTab = (next: AccountTab) => {
    setTab(next);
    setSearchParams(next === 'orders' ? {} : { tab: next }, { replace: true });
  };

  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <SEOHead title="My Account" canonical="/account" />
        <p className="text-sm text-[#736B63] mb-4">Sign in to manage your profile, addresses, and orders.</p>
        <button
          type="button"
          onClick={() => navigate('/login?redirect=/account')}
          className="px-5 py-2.5 bg-[#721B29] text-white text-xs font-bold rounded-lg"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomerProfile(currentUser.id, profile);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.address.trim() || !addressForm.pincode.trim() || !addressForm.phone.trim()) return;
    const next: SavedAddress = {
      ...addressForm,
      id: `addr_${Date.now()}`,
      isDefault: addresses.length === 0 ? true : Boolean(addressForm.isDefault),
    };
    let list = [...addresses];
    if (next.isDefault) {
      list = list.map((a) => ({ ...a, isDefault: false }));
    }
    list = [next, ...list];
    setAddresses(list);
    saveSavedAddresses(currentUser.id, list);
    setAddressForm({
      label: 'Home',
      name: profile.name || currentUser.name,
      phone: profile.phone,
      address: '',
      city: '',
      state: 'Haryana',
      pincode: '',
      isDefault: false,
    });
  };

  const removeAddress = (id: string) => {
    const list = addresses.filter((a) => a.id !== id);
    if (list.length && !list.some((a) => a.isDefault)) {
      list[0].isDefault = true;
    }
    setAddresses(list);
    saveSavedAddresses(currentUser.id, list);
  };

  const setDefaultAddress = (id: string) => {
    const list = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(list);
    saveSavedAddresses(currentUser.id, list);
  };

  return (
    <div className="bg-[#FAF8F3] min-h-[70vh]">
      <SEOHead
        title="My Account"
        description="Manage your The Western Store profile, saved addresses, and order history."
        canonical="/account"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={currentUser.name}
              email={currentUser.email}
              src={currentUser.avatar}
              size="lg"
            />
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#242120]">My Account</h1>
              <p className="text-xs text-[#736B63]">{currentUser.email}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-white border border-[#EAE4D9] rounded-xl w-full sm:w-fit overflow-x-auto">
          {(
            [
              { id: 'orders' as const, label: 'Orders', icon: Package },
              { id: 'profile' as const, label: 'Profile', icon: User },
              { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                tab === id
                  ? 'bg-[#721B29] text-white'
                  : 'text-[#736B63] hover:text-[#242120] hover:bg-[#FAF8F3]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div className="[&>div]:!bg-transparent [&>div]:!min-h-0 [&>div]:!py-0">
            <OrderHistoryPage embedded />
          </div>
        )}

        {tab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white border border-[#EAE4D9] rounded-2xl p-6 max-w-lg space-y-4 shadow-sm"
          >
            <h2 className="font-serif text-lg font-bold text-[#242120]">Profile details</h2>
            <p className="text-xs text-[#736B63]">
              Used to prefill checkout. Changes are saved on this device for your account.
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-[#8C8276] uppercase mb-1">Full name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-xs border border-[#D9CEBF] rounded-lg bg-[#FAF8F3] focus:outline-none focus:border-[#721B29]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8C8276] uppercase mb-1">Phone</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2.5 text-xs border border-[#D9CEBF] rounded-lg bg-[#FAF8F3] focus:outline-none focus:border-[#721B29]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#8C8276] uppercase mb-1">Email</label>
              <input
                value={profile.email}
                readOnly
                className="w-full px-3 py-2.5 text-xs border border-[#EAE4D9] rounded-lg bg-[#F3EFE6] text-[#736B63]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Save profile
            </button>
            {profileSaved && (
              <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Profile saved
              </p>
            )}
          </form>
        )}

        {tab === 'addresses' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#242120]">Saved addresses</h2>
              {addresses.length === 0 && (
                <p className="text-xs text-[#736B63] bg-white border border-[#EAE4D9] rounded-xl p-4">
                  No saved addresses yet. Add one for faster checkout.
                </p>
              )}
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white border border-[#EAE4D9] rounded-xl p-4 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#242120]">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-[#4A453E]">{addr.name} · {addr.phone}</p>
                  <p className="text-[#736B63] leading-relaxed">
                    {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <div className="flex gap-2 pt-2">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-semibold text-[#721B29] hover:underline cursor-pointer"
                      >
                        Set default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      className="text-[11px] font-semibold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
              <Link to="/checkout" className="text-[11px] font-semibold text-[#721B29] hover:underline">
                Go to checkout →
              </Link>
            </div>

            <form
              onSubmit={handleAddAddress}
              className="bg-white border border-[#EAE4D9] rounded-2xl p-5 space-y-3 h-fit shadow-sm"
            >
              <h3 className="font-serif text-base font-bold text-[#242120] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#721B29]" /> Add address
              </h3>
              {(
                [
                  ['label', 'Label (Home / Office)'],
                  ['name', 'Full name'],
                  ['phone', 'Phone'],
                  ['address', 'Street address'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['pincode', 'PIN code'],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-[10px] font-semibold text-[#8C8276] uppercase mb-1">{label}</label>
                  <input
                    value={addressForm[key]}
                    onChange={(e) => setAddressForm((f) => ({ ...f, [key]: e.target.value }))}
                    required={key !== 'label'}
                    className="w-full px-3 py-2 text-xs border border-[#D9CEBF] rounded-lg bg-[#FAF8F3] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 text-xs text-[#4A453E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(addressForm.isDefault)}
                  onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))}
                />
                Set as default shipping address
              </label>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Save address
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
