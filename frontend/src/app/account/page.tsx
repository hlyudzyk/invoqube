'use client'

import {useState, useEffect, ChangeEvent} from 'react';
import Image from 'next/image';
import apiService from "@/app/services/apiServices";
import {UserType} from "@/app/lib/types";
import {useRouter} from "next/navigation";


const AccountPage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    business_name: '',
    vat_number: '',
    registration_number: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('/no_pfp.png');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userid = localStorage.getItem('user_id');
      if (!userid) {
        router.push('/login');
        return;
      }
      try {
        const userData: UserType = await apiService.get(`/api/auth/${userid}/`);
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          description: userData.description || '',
          business_name: userData.business_name || '',
          vat_number: userData.vat_number || '',
          registration_number: userData.registration_number || '',
          address: userData.address || '',
          city: userData.city || '',
          postal_code: userData.postal_code || '',
          country: userData.country || '',
          phone: userData.phone || '',
        });
        setAvatarUrl(userData.avatar_url || '/no_pfp.png');
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];
      setAvatar(image);
      setAvatarUrl(URL.createObjectURL(image));
    }
  };

  const handleSave = async () => {
    setStatus('loading');
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    if (avatar) data.append('avatar', avatar);

    try {
      await apiService.post(`/api/auth/edit/`, data);
      setStatus('success');
      setIsEditing(false);
      // Refresh user data
      const userid = localStorage.getItem('user_id');
      if (userid) {
        const userData: UserType = await apiService.get(`/api/auth/${userid}/`);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error saving:', error);
      setStatus('error');
    }
  };

  if (!user) {
    return (
      <main className="max-w-[1500px] mx-auto px-6 pb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand">Account Settings</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-accent hover:bg-accent-dark text-brand font-semibold rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setStatus('idle');
              }}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-brand font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={status === 'loading'}
              className="px-6 py-2 bg-accent hover:bg-accent-dark text-brand font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          Profile updated successfully!
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Failed to update profile. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-base-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand mb-4">Profile Picture</h2>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 mb-4">
                <Image
                  width={160}
                  height={160}
                  alt="Profile image"
                  src={avatarUrl}
                  className="rounded-full object-cover w-full h-full border-4 border-accent"
                />
              </div>
              {isEditing && (
                <label className="cursor-pointer px-4 py-2 bg-accent hover:bg-accent-dark text-brand font-semibold rounded-lg transition-colors">
                  <span>Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={setImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-base-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-brand mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand mb-2">Email</label>
                <p className="text-gray-700">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand mb-2">Description</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.description || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-base-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand mb-4">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand mb-2">Business Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.business_name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand mb-2">VAT Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="vat_number"
                    value={formData.vat_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.vat_number || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand mb-2">Registration Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.registration_number || 'Not provided'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand mb-2">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.address || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand mb-2">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.city || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand mb-2">Postal Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.postal_code || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand mb-2">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{user.country || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountPage;