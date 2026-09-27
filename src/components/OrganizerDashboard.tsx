import React, { useState } from 'react';
import { EventConfig, CuratedPrompt, LivePost, TransitionType, Screen } from '../types.ts';

interface OrganizerDashboardProps {
  config: EventConfig;
  setConfig: React.Dispatch<React.SetStateAction<EventConfig>>;
  prompts: CuratedPrompt[];
  setPrompts: React.Dispatch<React.SetStateAction<CuratedPrompt[]>>;
  livePosts: LivePost[];
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
  onSelectPromptForAttendee: (prompt: CuratedPrompt) => void;
  showToast: (msg: string) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  config,
  setConfig,
  prompts,
  setPrompts,
  livePosts,
  onNavigate,
  onSelectPromptForAttendee,
  showToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [emailBlasting, setEmailBlasting] = useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddPromptModal, setShowAddPromptModal] = useState(false);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(config.portalUrl).then(() => {
      setCopied(true);
      showToast('Portal link copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setConfig((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((t) => t !== tagToRemove),
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const formatted = newTagInput.trim().startsWith('#')
      ? newTagInput.trim()
      : `#${newTagInput.trim()}`;
    if (!config.hashtags.includes(formatted)) {
      setConfig((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, formatted],
      }));
      setHasUnsavedChanges(true);
      showToast(`Added ${formatted}`);
    }
    setNewTagInput('');
    setShowAddTagModal(false);
  };

  const handleAddPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptTitle.trim() || !newPromptText.trim()) return;
    const newPrompt: CuratedPrompt = {
      id: `prompt-${Date.now()}`,
      title: `${prompts.length + 1}. ${newPromptTitle.trim()}`,
      isDefault: false,
      preview: newPromptText.slice(0, 100) + '...',
      takeawayText: newPromptText,
      tone: 'Key Takeaways / Educational',
    };
    setPrompts((prev) => [...prev, newPrompt]);
    setNewPromptTitle('');
    setNewPromptText('');
    setShowAddPromptModal(false);
    showToast('New starter prompt added!');
  };

  const handleSendEmailBlast = () => {
    setEmailBlasting(true);
    setTimeout(() => {
      setEmailBlasting(false);
      showToast('Personalized 1-click links sent to 1,200 registered attendees!');
    }, 1200);
  };

  const handleDownloadQr = () => {
    showToast('Downloaded Keynote & Badge QR asset pack (SVG & 300DPI PNG)!');
  };

  const handleSaveConfiguration = () => {
    setHasUnsavedChanges(false);
    showToast('Event configuration and brand kit saved successfully!');
  };

  return (
    <div className="w-full pt-16 bg-background min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Top Bar: Header & Live Event Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">
                Organizer Dashboard
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-semibold">Active Event Live</span>
                <span className="text-on-surface-variant font-normal">
                  • Auto-syncing feeds every 60s
                </span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Configure your event branding, manage post prompts, and track attendee viral reach across LinkedIn in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => showToast('Full Event Performance Report generated (PDF/CSV ready)!')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-colors font-label-lg text-label-lg shadow-sm border border-outline-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Report</span>
            </button>
            <button
              onClick={() => showToast('Create Event dialog opened.')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:opacity-95 transition-opacity font-label-lg text-label-lg shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Create New Event</span>
            </button>
          </div>
        </div>

        {/* Analytics Metrics Strip (4 responsive cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Posts Created
              </span>
              <span className="p-2 rounded-lg bg-secondary-container/40 text-primary">
                <span className="material-symbols-outlined text-[20px]">post_add</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">482</span>
              <span className="inline-flex items-center gap-0.5 font-label-md text-label-md text-primary font-semibold">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> +24% today
              </span>
            </div>
            <div className="mt-3 w-full h-8 flex items-end gap-1">
              <div className="flex-1 bg-surface-container rounded-t h-3" title="9am: 18 posts"></div>
              <div className="flex-1 bg-surface-container rounded-t h-4" title="10am: 32 posts"></div>
              <div className="flex-1 bg-surface-container rounded-t h-3.5" title="11am: 28 posts"></div>
              <div className="flex-1 bg-surface-container rounded-t h-5" title="12pm: 64 posts"></div>
              <div className="flex-1 bg-surface-container-high rounded-t h-6" title="1pm: 110 posts"></div>
              <div className="flex-1 bg-primary/40 rounded-t h-7" title="2pm: 124 posts"></div>
              <div className="flex-1 bg-primary-container rounded-t h-8" title="3pm: 106 posts"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Est. LinkedIn Reach
              </span>
              <span className="p-2 rounded-lg bg-secondary-container/40 text-primary">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">148.5K</span>
              <span className="inline-flex items-center gap-0.5 font-label-md text-label-md text-primary font-semibold">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span> +38% vs yday
              </span>
            </div>
            <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant truncate">
              Calculated via organic LinkedIn 2nd-degree feed spillover.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Avg Engagement Rate
              </span>
              <span className="p-2 rounded-lg bg-secondary-container/40 text-primary">
                <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">6.8%</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                Top 5% tech summit
              </span>
            </div>
            <div className="mt-3 w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div className="bg-primary-container h-2 rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Participant Advocates
              </span>
              <span className="p-2 rounded-lg bg-secondary-container/40 text-primary">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display-lg text-display-lg text-on-surface font-bold">312</span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                of 1,200 attendees
              </span>
            </div>
            <div className="mt-3 flex items-center -space-x-2">
              <img
                className="w-6 h-6 rounded-full object-cover shadow-sm ring-1 ring-white"
                alt="Attendee profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP7QhjcbgLf6Rj12vyv5i6dxLM_E8h28oIcu4y1NLYHcU2jbl-nGRNLsyfai0DtpMPzZcdSsbqxJkOpVm2hsKpubBrAs7E1fQ6lEAmMDpTxHtcbTT9ANNMMAMiNZ2VWj6xk9lXog8es0ZbND5U7oMnDcpcSeVvD6-q4jkdyu-Go2KrItcTAnSzwUJpdsz2TQ0IbYaLjohlYfFwYfDAaA8sPXZuuQRxo8usN7qNSQeaEvUtGJLTBFty"
              />
              <img
                className="w-6 h-6 rounded-full object-cover shadow-sm ring-1 ring-white"
                alt="Attendee profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD83fbISpLqyNStIYzOMyLmzZ2di5q7pWoBKurgDup8qtJF-LISLn13tlRS4KVSoUqHKlH6or33O6FRsNWSJfwFiaNP1d8YkVx4Ln4QcGzUTONQbMHoRrN_vEVupfAITwuLKO68ZhC1zHkeDpMhUKPIeo7jUX9NmECTVDPhiXIHNFKOig0X4yuxJWqAnCU6ZO_cMsmLCWlBQL0rbMxE9PkqN4FJgZITQFxETfpYskUU6ODHSoSC1HED"
              />
              <img
                className="w-6 h-6 rounded-full object-cover shadow-sm ring-1 ring-white"
                alt="Attendee profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfOoWu4v3y7n1PrClliIHw9ioHUG3o43bWQWPupJoA0-MlCFIYQZ5E__dXv9ROwnFRpjx_1lPEFiz5hPtytmUlmyhYeJPdJoPPuTs9fkQnMR6mPqeJT1NipRXJCrkrVIE9NkktKqvYcV811tP6-f5K1vQk_IN2_b5aUHDPj-VqMJZkukLCk_MwUW1TGIBXXzpFhoW4DlMJSkQkhnYK8ykWv8ZF3EhmqgE5AXY8qDnsyc-ZOupbsIPq"
              />
              <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-label-sm text-[10px] font-semibold ring-1 ring-white">
                +309
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Desktop Workspace (12-column grid, gap-8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Span 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Main Form Card: Event Configuration & Brand Kit */}
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-6 border border-outline-variant/30">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-primary-fixed text-on-primary-fixed">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Event Configuration & Brand Kit
                    </h2>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Profile Preset v2.4 Active
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Auto-applied
                </span>
              </div>

              {/* Inputs Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={config.eventName}
                    onChange={(e) => {
                      setConfig((prev) => ({ ...prev, eventName: e.target.value }));
                      setHasUnsavedChanges(true);
                    }}
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    Organizer / Host Entity
                  </label>
                  <input
                    type="text"
                    value={config.hostEntity}
                    onChange={(e) => {
                      setConfig((prev) => ({ ...prev, hostEntity: e.target.value }));
                      setHasUnsavedChanges(true);
                    }}
                    className="px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary shadow-inner"
                  />
                </div>
              </div>

              {/* Official Hashtags */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    Official Event Hashtags
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Default appended in attendee posts
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-surface-container-low min-h-[52px]">
                  {config.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm border border-outline-variant/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                        title="Remove tag"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowAddTagModal(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-secondary-container/50 hover:bg-secondary-container text-on-secondary-container font-label-md text-label-md transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Hashtag
                  </button>
                </div>
              </div>

              {/* Add Tag Inline Modal / Input */}
              {showAddTagModal && (
                <form
                  onSubmit={handleAddTag}
                  className="flex items-center gap-2 p-3 bg-surface-container rounded-lg border border-primary/30"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">tag</span>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter tag (e.g. #SaaSLeaders)"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="flex-1 bg-surface-container-lowest px-3 py-1 rounded border border-outline-variant/40 text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-primary text-white rounded text-xs font-semibold hover:opacity-90"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTagModal(false)}
                    className="px-3 py-1 bg-surface-container-high text-on-surface rounded text-xs hover:bg-surface-variant"
                  >
                    Cancel
                  </button>
                </form>
              )}

              {/* Official Social Mention Handles */}
              <div className="flex flex-col gap-3">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                  Social Mentions & Link Mapping
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      LinkedIn Page URL
                    </span>
                    <div className="flex items-center px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[16px] mr-1.5">link</span>
                      <input
                        type="text"
                        value={config.linkedinUrl}
                        onChange={(e) => {
                          setConfig((prev) => ({ ...prev, linkedinUrl: e.target.value }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full bg-transparent focus:outline-none truncate"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      X / Twitter
                    </span>
                    <div className="flex items-center px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-outline-variant/20">
                      <span className="font-label-sm text-primary font-bold mr-1.5">@</span>
                      <input
                        type="text"
                        value={config.twitterHandle}
                        onChange={(e) => {
                          setConfig((prev) => ({ ...prev, twitterHandle: e.target.value }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full bg-transparent focus:outline-none truncate"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Official Website
                    </span>
                    <div className="flex items-center px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[16px] mr-1.5">language</span>
                      <input
                        type="text"
                        value={config.websiteUrl}
                        onChange={(e) => {
                          setConfig((prev) => ({ ...prev, websiteUrl: e.target.value }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full bg-transparent focus:outline-none truncate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Attendee Generator Portal Distribution */}
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-5 border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Attendee Generator Portal Distribution
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Give attendees frictionless access to generate branded posts right from their phones
                  </p>
                </div>
              </div>

              {/* Link Share Bar: MUST MATCH xpath //div[@id='portal-url'] for navigation with push transition */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div
                  id="portal-url"
                  onClick={() => onNavigate('attendee-generator', 'push')}
                  title="Click to launch Attendee Generator view (Push Transition)"
                  className="flex-1 flex items-center gap-2 px-3 py-2 font-body-sm text-body-sm text-on-surface select-all overflow-hidden truncate cursor-pointer hover:bg-surface-container rounded transition-colors group"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">captive_portal</span>
                  <span className="truncate group-hover:text-primary font-medium">
                    {config.portalUrl}
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded opacity-80 group-hover:opacity-100 transition-opacity ml-auto">
                    <span>Open View</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </span>
                </div>

                <button
                  id="copy-btn"
                  onClick={handleCopyLink}
                  type="button"
                  className={`px-4 py-2 rounded-md font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap transition-all cursor-pointer ${
                    copied
                      ? 'bg-primary text-white'
                      : 'bg-primary-container text-on-primary hover:opacity-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span id="copy-text">
                    {copied ? 'Copied to Clipboard!' : 'Copy Portal Link'}
                  </span>
                </button>
              </div>

              {/* QR Code & Badge Lanyard Integration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-surface-container flex gap-4 items-center border border-outline-variant/20">
                  {/* Visual SVG QR Code placeholder */}
                  <div className="w-20 h-20 bg-surface-container-lowest rounded-lg p-2 shadow-sm flex items-center justify-center flex-shrink-0 border border-outline-variant/20">
                    <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                      <path d="M0,0 h40 v40 h-40 z M10,10 v20 h20 v-20 z M60,0 h40 v40 h-40 z M70,10 v20 h20 v-20 z M0,60 h40 v40 h-40 z M10,70 v20 h20 v-20 z M50,10 h10 v10 h-10 z M10,50 h10 v10 h-10 z M50,50 h20 v10 h-20 z M80,50 h20 v20 h-20 z M60,70 h10 v30 h-10 z M80,80 h20 v20 h-20 z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-headline-sm text-[15px] text-on-surface font-semibold">
                      Badge & Keynote QR Code
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Includes custom vector lockup
                    </span>
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="mt-1 text-left font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">file_download</span>{' '}
                      Download High-Res SVG/PNG
                    </button>
                  </div>
                </div>

                {/* Email distribution snippet trigger */}
                <div className="p-4 rounded-lg bg-surface-container flex flex-col justify-between gap-3 border border-outline-variant/20">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                      mark_email_unread
                    </span>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[15px] text-on-surface font-semibold">
                        Attendee Email Push
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Send direct 1-click generation link
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendEmailBlast}
                    disabled={emailBlasting}
                    className="w-full py-2 px-3 rounded-md bg-surface-container-lowest hover:bg-surface-container-high transition-colors font-label-sm text-label-sm text-on-surface font-semibold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      {emailBlasting ? 'hourglass_top' : 'send'}
                    </span>
                    <span>
                      {emailBlasting
                        ? 'Sending invite blasts...'
                        : 'Send invite blast to 1,200 registered attendees'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Save & Publish Actions Bar */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-outline-variant/30">
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <span
                  className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? 'bg-error animate-ping' : 'bg-primary'}`}
                ></span>
                <span>
                  {hasUnsavedChanges
                    ? 'Unsaved changes in event settings'
                    : 'Last saved 2m ago by PulseTech Admin'}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setHasUnsavedChanges(false);
                    showToast('Changes discarded.');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container font-label-lg text-label-lg transition-colors cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfiguration}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-primary-container text-on-primary hover:opacity-95 font-label-lg text-label-lg transition-opacity shadow-sm cursor-pointer"
                >
                  Save & Update Event Configuration
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Span 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Card: Peak Activity Window */}
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-secondary-container/40 text-primary">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Peak Activity Window
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Real-Time
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Attendees share most actively between{' '}
                <strong className="text-on-surface">12:30 PM & 3:00 PM</strong> during keynote intermissions & lunch panels.
              </p>

              {/* Hourly Bar Chart Visual */}
              <div className="mt-2 flex flex-col gap-2">
                <div className="h-28 w-full flex items-end justify-between gap-1.5 pt-4">
                  {/* 9 AM */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="9 AM: 12 posts/hr">
                    <div className="w-full bg-surface-container rounded-t h-8 group-hover:bg-primary-fixed transition-colors"></div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">9a</span>
                  </div>
                  {/* 10 AM */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="10 AM: 24 posts/hr">
                    <div className="w-full bg-surface-container rounded-t h-12 group-hover:bg-primary-fixed transition-colors"></div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">10a</span>
                  </div>
                  {/* 11 AM */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="11 AM: 42 posts/hr">
                    <div className="w-full bg-surface-container-high rounded-t h-16 group-hover:bg-primary-fixed transition-colors"></div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">11a</span>
                  </div>
                  {/* 12 PM */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="12 PM: 78 posts/hr">
                    <div className="w-full bg-primary/30 rounded-t h-20 group-hover:bg-primary transition-colors"></div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">12p</span>
                  </div>
                  {/* 1 PM Peak */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="1 PM (Peak): 146 posts/hr">
                    <div className="w-full bg-primary-container rounded-t h-24 shadow-sm relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-label-sm text-[9px] font-bold text-primary">
                        Peak
                      </span>
                    </div>
                    <span className="font-label-sm text-[10px] text-primary font-bold">1p</span>
                  </div>
                  {/* 2 PM */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="2 PM: 112 posts/hr">
                    <div className="w-full bg-primary-container/80 rounded-t h-20 group-hover:bg-primary transition-colors"></div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">2p</span>
                  </div>
                  {/* 3 PM */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="3 PM: 64 posts/hr">
                    <div className="w-full bg-surface-container-high rounded-t h-14 group-hover:bg-primary-fixed transition-colors"></div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">3p</span>
                  </div>
                  {/* 4 PM */}
                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" title="4 PM: 30 posts/hr">
                    <div className="w-full bg-surface-container rounded-t h-10 group-hover:bg-primary-fixed transition-colors"></div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">4p</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Post Templates & Starter Prompts */}
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-secondary-container/40 text-primary">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Curated Starter Prompts
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                  {prompts.length} Active
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {prompts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPromptForAttendee(p);
                      onNavigate('attendee-generator', 'none');
                    }}
                    title="Click to load prompt in Attendee Generator"
                    className="p-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-1.5 cursor-pointer border border-transparent hover:border-primary/30 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                        {p.title}
                      </span>
                      {p.isDefault ? (
                        <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-[10px] font-bold uppercase tracking-wider">
                          Default
                        </span>
                      ) : (
                        <span className="text-on-surface-variant hover:text-primary material-symbols-outlined text-[16px]">
                          edit
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      "{p.takeawayText}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Prompt Modal Form */}
              {showAddPromptModal && (
                <form
                  onSubmit={handleAddPrompt}
                  className="p-4 bg-surface-container rounded-lg flex flex-col gap-2.5 border border-primary/30"
                >
                  <span className="text-xs font-semibold text-primary">Add New Prompt Template</span>
                  <input
                    type="text"
                    required
                    placeholder="Prompt Title (e.g. VIP Dinner Reflections)"
                    value={newPromptTitle}
                    onChange={(e) => setNewPromptTitle(e.target.value)}
                    className="px-3 py-1.5 rounded bg-surface-container-lowest text-xs border border-outline-variant/40"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Starter text quote for attendees..."
                    value={newPromptText}
                    onChange={(e) => setNewPromptText(e.target.value)}
                    className="px-3 py-1.5 rounded bg-surface-container-lowest text-xs border border-outline-variant/40 resize-none"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddPromptModal(false)}
                      className="px-3 py-1 bg-surface-container-high rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-primary text-white rounded text-xs font-semibold"
                    >
                      Save Prompt
                    </button>
                  </div>
                </form>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Editing starter prompt templates.')}
                  className="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span> Edit Prompts
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPromptModal(true)}
                  className="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> + Add Custom
                </button>
              </div>
            </div>

            {/* Card: Recent Attendee Posts Stream */}
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-secondary-container/40 text-primary">
                    <span className="material-symbols-outlined text-[18px]">dynamic_feed</span>
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Live Posts Stream
                  </h3>
                </div>
                <button
                  onClick={() => showToast('Displaying all 482 live posts with LinkedIn API sync.')}
                  className="font-label-sm text-label-sm text-primary font-semibold hover:underline cursor-pointer"
                >
                  View All (482)
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {livePosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          className="w-8 h-8 rounded-full object-cover shadow-sm"
                          src={post.avatarUrl}
                          alt={post.authorName}
                        />
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                            {post.authorName}
                          </span>
                          <span className="font-label-sm text-[11px] text-on-surface-variant leading-tight">
                            {post.authorRole} • {post.timeAgo}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-label-sm text-[11px] font-semibold bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-[13px]">thumb_up</span> +{post.likes}
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      "{post.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
