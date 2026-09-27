import React, { useState } from 'react';
import { Screen, TransitionType, UserProfile } from '../types.ts';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
  eventName: string;
  currentProfile: UserProfile | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  eventName,
  currentProfile,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    'SaaS Innovate Summit 2025',
    'Enterprise CloudScale 2025',
    'AI Product Leadership Forum',
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/40 shadow-xs">
      <div className="h-16 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand with single Logo & Event Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="flex items-center cursor-pointer select-none group"
            onClick={() => onNavigate('organizer-dashboard', 'none')}
            title="EventPulse Home"
          >
            {/* Single Brand Logo */}
            <img
              alt="EventPulse"
              className="h-12 sm:h-[50px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1X0OaKsSpSc4Cvc-EoDp74BD177zmLzh5x-rFMm9K-k3tZO_qaPwxDUE-13h4I0cDh8_u6jV5MisR7Df0NKgrUJO5qAPU9nkOOr2-aJoDpDyfWMeQK4R8IYVtfrj0jo3DSu07J4SZmrsxSb825mWpC79VVPg69kfl9ZSU1lsrFS7WclGnajjwY2KnUafJmn4CV97Gx9kdT9pPsEywjqkIKYVVvuYvIehwZiKOkxiHEcU7K4JfaRvh8Xces"
            />
          </div>

          <div className="h-7 w-px bg-outline-variant/60 hidden md:block"></div>

          {/* Event Selector Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowEventDropdown(!showEventDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer border border-outline-variant/30 transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">event</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold max-w-[130px] md:max-w-[210px] truncate">
                {eventName}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                expand_more
              </span>
            </button>

            {showEventDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Active Events
                </div>
                {events.map((evt) => (
                  <button
                    key={evt}
                    onClick={() => {
                      setShowEventDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer ${
                      evt === eventName
                        ? 'text-primary font-semibold bg-surface-container-low/50'
                        : 'text-on-surface'
                    }`}
                  >
                    <span>{evt}</span>
                    {evt === eventName && (
                      <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Screen Navigation & Search */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav
            className="flex items-center p-1 bg-surface-container rounded-lg border border-outline-variant/30"
            data-active-classes="bg-surface-container-lowest text-primary font-semibold shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
          >
            <a
              href="#"
              data-path="organizer-dashboard"
              aria-current={currentScreen === 'organizer-dashboard' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('organizer-dashboard', 'none');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded transition-all font-label-md text-label-md cursor-pointer ${
                currentScreen === 'organizer-dashboard'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Organizer
            </a>

            <a
              href="#"
              data-path="attendee-generator"
              aria-current={currentScreen === 'attendee-generator' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('attendee-generator', 'none');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded transition-all font-label-md text-label-md cursor-pointer ${
                currentScreen === 'attendee-generator'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Attendee View
            </a>
          </nav>

          <div className="relative hidden xl:flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, metrics, speakers..."
              className="w-56 lg:w-64 pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline border border-outline-variant/30 font-body-sm text-body-sm focus:outline-none focus:border-primary-container focus:bg-surface-container-lowest transition-all"
            />
          </div>
        </div>

        {/* Right: Sign In / Sign Up, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Sign In & Sign Up / Make Profile Buttons */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenAuthModal('signin')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign in with an existing account"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenAuthModal('signup')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-container hover:bg-primary text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              title="Create a new attendee or organizer profile"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Make Profile</span>
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </button>

            {showNotification && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    Live Event Alerts
                  </span>
                  <span className="text-[10px] bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                    2 New
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="p-2 rounded-lg bg-surface-container-low flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                      trending_up
                    </span>
                    <div>
                      <p className="font-semibold text-on-surface">Viral Spike Detected</p>
                      <p className="text-on-surface-variant text-[11px]">
                        48 attendee posts shared in last 15 min during Keynote Hall A.
                      </p>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                      qr_code
                    </span>
                    <div>
                      <p className="font-semibold text-on-surface">Lanyard QR Scans: +120</p>
                      <p className="text-on-surface-variant text-[11px]">
                        Moscone West registration desk badge scans.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-outline-variant/60 hidden sm:block"></div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 cursor-pointer group"
              title="Account Menu & Profile"
            >
              <img
                alt={currentProfile?.name || 'Profile'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-outline-variant/40 group-hover:ring-primary transition-all shadow-xs"
                src={
                  currentProfile?.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida/AEtjO1XYq33tCqtSnpdeQ7RWvgfTHdqz6PbWoDYmguFclAkBbqFfiYIKxlbUjUtDga2vW7AgLOPKoozV4WGT_1LDCdackbNehchLrZZK6R2XqA4M1pzt4Htb93yPRn_d2af2WVycZUiFZTDams97-WQTuXRfw3paRkxPdjBmfb6hgluRk9dasOgxGnugULA5gxASBS947K8if6BbldJJrha6StRPmGh8Skgi1IBAObtVwD1sRIrcDZhjD6eu5xg'
                }
              />
              <span className="hidden md:inline-block font-label-md text-label-md text-on-surface font-semibold max-w-[140px] truncate leading-none">
                {currentProfile?.name || 'Sarah Jenkins'}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px] hidden sm:block">
                expand_more
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50 animate-fadeIn">
                <div className="px-3.5 py-2.5 border-b border-outline-variant/20 flex items-center gap-2.5">
                  <img
                    src={
                      currentProfile?.avatarUrl ||
                      'https://lh3.googleusercontent.com/aida/AEtjO1XYq33tCqtSnpdeQ7RWvgfTHdqz6PbWoDYmguFclAkBbqFfiYIKxlbUjUtDga2vW7AgLOPKoozV4WGT_1LDCdackbNehchLrZZK6R2XqA4M1pzt4Htb93yPRn_d2af2WVycZUiFZTDams97-WQTuXRfw3paRkxPdjBmfb6hgluRk9dasOgxGnugULA5gxASBS947K8if6BbldJJrha6StRPmGh8Skgi1IBAObtVwD1sRIrcDZhjD6eu5xg'
                    }
                    alt="Active user"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-primary/40"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {currentProfile?.name || 'Sarah Jenkins'}
                    </p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {currentProfile?.email || 'sarah.jenkins@pulsetech.io'}
                    </p>
                    <span className="mt-0.5 text-[9px] uppercase tracking-wider font-semibold text-primary">
                      {currentProfile?.userType === 'organizer' ? 'Event Organizer' : 'Event Attendee'}
                    </span>
                  </div>
                </div>

                <div className="py-1.5 border-b border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuthModal('signup');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-primary hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span>+ Make New Profile / Sign Up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuthModal('signin');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">switch_account</span>
                    <span>Switch Profile / Sign In</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuthModal('signup');
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      manage_accounts
                    </span>
                    <span>Edit Profile & Headline</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-error hover:bg-error/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
