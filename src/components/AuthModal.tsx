import React, { useState } from 'react';
import { UserProfile } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  onSelectProfile: (profile: UserProfile) => void;
  onCreateProfile: (profile: UserProfile) => void;
  showToast: (msg: string) => void;
}

const PRESET_AVATARS = [
  {
    name: 'Sarah Jenkins',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1XYq33tCqtSnpdeQ7RWvgfTHdqz6PbWoDYmguFclAkBbqFfiYIKxlbUjUtDga2vW7AgLOPKoozV4WGT_1LDCdackbNehchLrZZK6R2XqA4M1pzt4Htb93yPRn_d2af2WVycZUiFZTDams97-WQTuXRfw3paRkxPdjBmfb6hgluRk9dasOgxGnugULA5gxASBS947K8if6BbldJJrha6StRPmGh8Skgi1IBAObtVwD1sRIrcDZhjD6eu5xg',
  },
  {
    name: 'David Chen',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw6_wQwn4zjH_9FP5luOuNfPZj6TiJi5NBCG99VnD495TKGoeTDIIm_lKcV4Fp-ZORKbqeroEZyrVgiYVQLc23jI9xNaDOFXOXgDi148bSYGlUkZ_MNvEw0YQhHVpixJSwA7PdV-IuLZ67Zdnk1k6wlZIVYM775f0thWyx4_P-Dh-Bx2crjbaTVX8Hf929HLcynj1v8gt40DUPnLAlNSpujfvF4TQmXZ0vuQ9w_NamxuoHlgPkRro2',
  },
  {
    name: 'Elena Rostova',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALRdnEb2EuAzfH6tTdcD2BUY6liZIcx_YFmYpfJfQjKTP4P2V-UlvDut_XHMEvWU7Z1Dc-kNBVwU2aVzv-3nKJZLaF5m1rXpagySf-qEWUMnYBNq4xM1Xv6UNBNotCimr_joBA2AuKE697myuEFBnMMTAzi-I8by8dP15MhK5ND06OqZnZHS86nRZDl4yqRAKCSrnuGzOxJuBYo2-f-M4C3bEa9l2A7JKNB4ycDxyZSq4iQv5lJQ_P',
  },
  {
    name: 'Marcus Vance',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP7QhjcbgLf6Rj12vyv5i6dxLM_E8h28oIcu4y1NLYHcU2jbl-nGRNLsyfai0DtpMPzZcdSsbqxJkOpVm2hsKpubBrAs7E1fQ6lEAmMDpTxHtcbTT9ANNMMAMiNZ2VWj6xk9lXog8es0ZbND5U7oMnDcpcSeVvD6-q4jkdyu-Go2KrItcTAnSzwUJpdsz2TQ0IbYaLjohlYfFwYfDAaA8sPXZuuQRxo8usN7qNSQeaEvUtGJLTBFty',
  },
  {
    name: 'Aria Takahashi',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD83fbISpLqyNStIYzOMyLmzZ2di5q7pWoBKurgDup8qtJF-LISLn13tlRS4KVSoUqHKlH6or33O6FRsNWSJfwFiaNP1d8YkVx4Ln4QcGzUTONQbMHoRrN_vEVupfAITwuLKO68ZhC1zHkeDpMhUKPIeo7jUX9NmECTVDPhiXIHNFKOig0X4yuxJWqAnCU6ZO_cMsmLCWlBQL0rbMxE9PkqN4FJgZITQFxETfpYskUU6ODHSoSC1HED',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  profiles,
  currentProfile,
  onSelectProfile,
  onCreateProfile,
  showToast,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign up form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [userType, setUserType] = useState<'organizer' | 'attendee'>('attendee');

  // Sign in custom email
  const [signInEmail, setSignInEmail] = useState('');

  if (!isOpen) return null;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Attendee',
      company: company.trim() || 'Tech Innovator',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      headline: headline.trim() || `${role.trim() || 'Tech Leader'} at ${company.trim() || 'Innovate Inc'}`,
      avatarUrl: selectedAvatar,
      userType: userType,
    };

    onCreateProfile(newProfile);
    showToast(`Welcome, ${newProfile.name}! Profile created and signed in.`);
    onClose();
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = profiles.find(
      (p) => p.email.toLowerCase() === signInEmail.trim().toLowerCase()
    );
    if (existing) {
      onSelectProfile(existing);
      showToast(`Welcome back, ${existing.name}!`);
      onClose();
    } else {
      // Auto create or switch
      const fallback: UserProfile = {
        id: `user-${Date.now()}`,
        name: signInEmail.split('@')[0] || 'Conference Member',
        role: 'Attendee',
        company: 'Innovate Network',
        email: signInEmail.trim(),
        headline: 'Tech Professional & Conference Attendee',
        avatarUrl: PRESET_AVATARS[2].url,
        userType: 'attendee',
      };
      onCreateProfile(fallback);
      showToast(`Signed in as ${fallback.name}!`);
      onClose();
    }
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedAvatar(url);
      showToast(`Custom photo selected: ${file.name}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Mode Tabs */}
        <div className="p-5 pb-3 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt="Brand logo"
              className="h-7 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1X0OaKsSpSc4Cvc-EoDp74BD177zmLzh5x-rFMm9K-k3tZO_qaPwxDUE-13h4I0cDh8_u6jV5MisR7Df0NKgrUJO5qAPU9nkOOr2-aJoDpDyfWMeQK4R8IYVtfrj0jo3DSu07J4SZmrsxSb825mWpC79VVPg69kfl9ZSU1lsrFS7WclGnajjwY2KnUafJmn4CV97Gx9kdT9pPsEywjqkIKYVVvuYvIehwZiKOkxiHEcU7K4JfaRvh8Xces"
            />
            <span className="font-bold text-on-surface text-base">Accounts & Profiles</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-surface-container-low border-b border-outline-variant/30">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Sign Up / Make Profile</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="p-6 overflow-y-auto flex-1">
          {mode === 'signin' ? (
            <div className="flex flex-col gap-6">
              {/* Profile Picker for Quick Sign In */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Select Existing Profile
                </label>
                <div className="flex flex-col gap-2">
                  {profiles.map((p) => {
                    const isCurrent = currentProfile?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSelectProfile(p);
                          showToast(`Signed in as ${p.name}`);
                          onClose();
                        }}
                        className={`p-3 rounded-xl flex items-center justify-between text-left transition-all border cursor-pointer ${
                          isCurrent
                            ? 'bg-primary/5 border-primary ring-1 ring-primary/20'
                            : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-outline-variant/40"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                              {p.name}
                              {isCurrent && (
                                <span className="text-[10px] bg-primary text-white px-2 py-0.2 rounded-full font-medium">
                                  Current
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-on-surface-variant">
                              {p.role} {p.company ? `• ${p.company}` : ''}
                            </span>
                          </div>
                        </div>

                        <span className="material-symbols-outlined text-primary text-[20px]">
                          arrow_forward
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or manual email sign in */}
              <div className="relative flex items-center justify-center my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30"></div>
                </div>
                <span className="relative px-3 bg-surface-container-lowest text-xs text-on-surface-variant font-medium">
                  or sign in with email
                </span>
              </div>

              <form onSubmit={handleCustomSignIn} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.jenkins@pulsetech.io"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="px-3.5 py-2 rounded-lg bg-surface-container-low text-sm border border-outline-variant/30 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-1 py-2.5 px-4 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Continue to Dashboard</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <span className="text-xs text-on-surface-variant">
                  Don't have a profile yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Make a profile now &rarr;
                  </button>
                </span>
              </div>
            </div>
          ) : (
            /* Sign Up / Make Profile Form */
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              {/* Avatar Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Choose Profile Picture
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`relative rounded-full p-0.5 transition-all cursor-pointer ${
                        selectedAvatar === av.url
                          ? 'ring-2 ring-primary scale-105'
                          : 'opacity-70 hover:opacity-100 ring-1 ring-outline-variant/40'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {selectedAvatar === av.url && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}

                  <label className="w-12 h-12 rounded-full bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center border border-dashed border-outline-variant/60 cursor-pointer text-secondary hover:text-primary transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-sm border border-outline-variant/30 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VP of Product"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-sm border border-outline-variant/30 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ScaleFlow"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-sm border border-outline-variant/30 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="elena@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-sm border border-outline-variant/30 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface-variant">
                  LinkedIn Headline
                </label>
                <input
                  type="text"
                  placeholder="VP of Product @ ScaleFlow | SaaS Summit Speaker | B2B Advisor"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-surface-container-low text-sm border border-outline-variant/30 focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
                />
                <span className="text-[11px] text-on-surface-variant">
                  This appears beneath your name on generated LinkedIn post previews.
                </span>
              </div>

              {/* Profile Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">
                  Profile Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserType('attendee')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                      userType === 'attendee'
                        ? 'bg-primary-container text-white border-primary-container'
                        : 'bg-surface-container-low border-outline-variant/30 text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>Event Attendee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('organizer')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                      userType === 'organizer'
                        ? 'bg-primary-container text-white border-primary-container'
                        : 'bg-surface-container-low border-outline-variant/30 text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">badge</span>
                    <span>Event Organizer / Host</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 py-3 px-4 rounded-lg bg-primary-container text-white font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span>Create Profile & Sign In</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-on-surface-variant">
                  Already have a profile?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Sign in here &rarr;
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
