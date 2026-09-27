import React, { useState, useId } from 'react';
import { EventConfig, PhotoAsset, UserProfile } from '../types.ts';

interface AttendeeGeneratorProps {
  config: EventConfig;
  takeaways: string;
  setTakeaways: (val: string) => void;
  selectedTone: string;
  setSelectedTone: (tone: string) => void;
  showToast: (msg: string) => void;
  currentProfile: UserProfile | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
}

export const AttendeeGenerator: React.FC<AttendeeGeneratorProps> = ({
  config,
  takeaways,
  setTakeaways,
  selectedTone,
  setSelectedTone,
  showToast,
  currentProfile,
  onOpenAuthModal,
}) => {
  const fileInputId = useId();
  const [isMobileView, setIsMobileView] = useState(false);
  const [includeSpeakerTagging, setIncludeSpeakerTagging] = useState(true);
  const [addCarouselCTA, setAddCarouselCTA] = useState(false);
  const [formatEmojiBullets, setFormatEmojiBullets] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Photos state
  const [photos, setPhotos] = useState<PhotoAsset[]>([
    {
      id: 'photo-1',
      name: 'Keynote_Stage_Day1.jpg',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0xmVlONBxHlwurbUASrDGwsxHMeH8ZnkKys_IkG6KOSJgJ2aLOrlqSMULbE9M-r0jNw1EsNFLKOKqEEpsT_5mXNHQeDPnX4WZscZKDe-IuWcangPEAGw64-6eJGccSMas6paTvs7vjMwMf8ztebNMM0vzT_lXWw6iQbl5Cs4DiTG5-ix2EhnBO1u--zbu5YyoKHnRIaWX4aR60RPSUtuuuDZ2AIZATIsiERed0l0itoqX8sd8LuvL',
      active: true,
    },
    {
      id: 'photo-2',
      name: 'Lounge_Selfie_VIP.jpg',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq7FczO71xBJaSjR15aIdHGp90lH7jyIWqgWAmWWKwyy_-Xgy7yhphdCgJ_9KMGE4X7xSxbhOysAMSwJKqlObOXrQ4ENVXOlLarHsb7ShlB84iUHXoj5ceLQAVwkE17LruC94Lh6pk5j6scya0kBzqsae0Y7eWn1JDXfM0CapNMnVEgjXuTFblMuGNtfzDforWKReSEOsjMnFLlRqdLwOL6ZrSdskMI6L4FMSMp2PlPidZzip26-kv',
      active: false,
    },
  ]);

  const activePhoto = photos.find((p) => p.active) || photos[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      const newPhoto: PhotoAsset = {
        id: `user-photo-${Date.now()}`,
        name: file.name,
        url: newUrl,
        active: true,
      };
      setPhotos((prev) => [
        ...prev.map((p) => ({ ...p, active: false })),
        newPhoto,
      ]);
      showToast(`Uploaded ${file.name}`);
    }
  };

  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.active)) {
        filtered[0].active = true;
      }
      return filtered;
    });
  };

  const handleSelectPhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        active: p.id === id,
      }))
    );
  };

  const tones = [
    'Professional',
    'Grateful Attendee',
    'Key Takeaways / Educational',
    'Thought Leadership',
    'Casual & Fun',
  ];

  // Dynamic post synthesis based on selected tone, enhancements, and config
  const getGeneratedPostContent = () => {
    const mainTag = config.hashtags[0] || '#SaaSInnovate2025';
    const host = config.hostEntity || 'PulseTech Global';
    const otherTags = config.hashtags.join(' ');

    let intro = '';
    let bullets: string[] = [];
    let outro = '';

    if (selectedTone === 'Grateful Attendee') {
      intro = `Incredible energy at ${mainTag} hosted by @${host}! 🚀\n\nHuge thank you to the organizers for curating such a high-caliber community. Three core takeaways from today's sessions:`;
      bullets = [
        'Durable retention beats top-of-funnel hype every time.',
        "AI isn't replacing product managers—it's supercharging speed to conviction.",
        'Community-led growth creates genuine defensibility.',
      ];
      outro = `Excited for Day 2! If you're here in SF, let's connect! 🤝`;
    } else if (selectedTone === 'Professional') {
      intro = `Reflecting on strategic learnings from ${mainTag} with industry colleagues and executive leaders from @${host}.`;
      bullets = [
        'Prioritizing capital-efficient expansion models in enterprise software.',
        'Institutionalizing AI agent orchestration across customer journey touchpoints.',
        'Aligning product metrics with tangible net-revenue-retention milestones.',
      ];
      outro = `Looking forward to continuing the conversation with fellow founders and operators.`;
    } else if (selectedTone === 'Thought Leadership') {
      intro = `The SaaS landscape is fundamentally shifting. Standing on the floor at ${mainTag}, one realization stands above the rest:`;
      bullets = [
        'Speed is no longer a moat; precision in domain workflow execution is.',
        'High-density human insight will command a massive premium over generic outputs.',
        'The strongest enterprise software businesses of 2026 are rebuilding their data pipelines today.',
      ];
      outro = `Kudos to @${host} for spotlighting the real frontier. Where do you see SaaS heading next year?`;
    } else if (selectedTone === 'Casual & Fun') {
      intro = `Best decision of the week: heading to ${mainTag} in SF! ☕️⚡️ Amazing discussions, brilliant humans, and more espresso than strictly recommended.`;
      bullets = [
        'Keynotes were packed with real case studies, zero fluff.',
        'Hallway chats with the @${host} team were gold.',
        'Met at least 15 leaders doing wild things with autonomous tools.',
      ];
      outro = `Who is around for the after-hours mixers tonight? Say hi! 👋`;
    } else {
      // Key Takeaways / Educational
      intro = `3 actionable playbooks distilled from today's keynotes at ${mainTag} hosted by @${host}:`;
      bullets = [
        'PLG & Enterprise Hybrid: Shift friction from discovery to adoption velocity.',
        'Unit Economics in 2025: Track Gross Margin Adjusted CAC payback relentlessly.',
        'AI Workflows: Embed agentic loops right where daily decisions happen.',
      ];
      outro = `Bookmark this for your Q4 roadmap planning! 📌`;
    }

    // Adjust speaker tagging
    if (includeSpeakerTagging) {
      outro += `\n\nSpecial shoutout to keynote speakers and the @${config.twitterHandle || 'PulseTechHQ'} engineering team for pulling back the curtain.`;
    }

    // Adjust carousel CTA
    if (addCarouselCTA) {
      outro += `\n\n👉 Swipe through the 5-slide visual breakdown attached below!`;
    }

    // Format bullets
    let formattedBullets = '';
    if (formatEmojiBullets) {
      formattedBullets = bullets
        .map((b, idx) => {
          const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
          return `${numbers[idx] || `${idx + 1}.`} ${b}`;
        })
        .join('\n');
    } else {
      formattedBullets = bullets.map((b) => `• ${b}`).join('\n');
    }

    return `${intro}\n\n${formattedBullets}\n\n${outro}\n\n${otherTags} #ProductLeadership`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('LinkedIn post synthesized with latest prompt and tone!');
    }, 900);
  };

  const handleCopy = () => {
    const text = getGeneratedPostContent();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      showToast('Post copy copied to clipboard!');
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const handleOpenLinkedIn = () => {
    handleCopy();
    showToast('Copied text! Ready to paste into LinkedIn feed.');
  };

  const handleLikeToggle = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleVoiceNoteToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      showToast('Voice recording started... Speak your takeaways.');
      setTimeout(() => {
        setIsRecordingVoice(false);
        setTakeaways(
          'Deep architectural insights on agentic inference pipelines from keynote speaker. Our team is implementing this on Monday!'
        );
        showToast('Voice transcribed into prompt!');
      }, 2500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  return (
    <div className="w-full pt-16 bg-background min-h-screen">
      {/* Event Banner Across Top Content Area */}
      <section className="w-full bg-surface-container-low py-4 px-4 sm:px-8 border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-fixed font-label-md text-label-md font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                Day 2 of 3 • Active Live
              </span>
              <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-1.5 font-bold">
                {config.eventName}
                <span
                  className="material-symbols-outlined text-primary-container text-[20px] fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </h1>
              <span className="font-body-sm text-body-sm text-secondary">
                In-Person • San Francisco (Moscone Center) • Hosted by{' '}
                <strong className="text-on-surface">{config.hostEntity}</strong>
              </span>
            </div>

            {/* Official Tag Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                Official Tags:
              </span>
              {config.hashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (!takeaways.includes(tag)) {
                      setTakeaways(`${takeaways} ${tag}`);
                      showToast(`Added ${tag} to prompt`);
                    }
                  }}
                  className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm hover:bg-primary-fixed transition-colors cursor-pointer"
                  title="Click to insert into your thoughts"
                >
                  {tag}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const tag = `@${config.twitterHandle || 'PulseTechHQ'}`;
                  if (!takeaways.includes(tag)) {
                    setTakeaways(`${takeaways} ${tag}`);
                    showToast(`Added ${tag}`);
                  }
                }}
                className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm hover:bg-primary-fixed transition-colors cursor-pointer"
              >
                @{config.twitterHandle || 'PulseTechHQ'}
              </button>
            </div>
          </div>

          {/* Quick Session Indicator Stats */}
          <div className="flex items-center gap-6 self-start lg:self-center bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-outline-variant/30">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase">
                Attendees Registered
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                3,850+
              </span>
            </div>
            <div className="w-px h-8 bg-surface-container-high"></div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary uppercase">
                Community Posts Today
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                1,240
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Productivity Workspace */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Generator Controls & Inputs (5 Cols) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {/* Form Card Wrapper */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-5 border border-outline-variant/30">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container text-[22px]">
                      auto_awesome
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Customize Your Post
                    </h2>
                  </div>
                  <span className="font-body-sm text-body-sm text-secondary pl-7">
                    Attendee Prompt Builder & Media Curator
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold tracking-wide">
                  GPT-4o Vision
                </span>
              </div>

              {/* Event Photos Dropzone */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
                  <span>Event Photos & Live Captures</span>
                  <span className="font-body-sm text-body-sm text-secondary">
                    {photos.filter((p) => p.active).length} of {photos.length} selected
                  </span>
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id={fileInputId}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Dropzone Area */}
                <label
                  htmlFor={fileInputId}
                  className="group relative rounded-xl bg-surface-container-low p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-all duration-200 border-2 border-dashed border-outline-variant/40 hover:border-primary/50"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary-container mb-2 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                  </div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">
                    Drag & drop stage or selfie photo, or{' '}
                    <span className="text-primary underline">browse</span>
                  </p>
                  <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                    Supports high-res PNG, JPG up to 15MB
                  </p>
                </label>

                {/* Uploaded photos thumbnail tray */}
                <div className="grid grid-cols-3 gap-2.5 mt-1">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => handleSelectPhoto(photo.id)}
                      className={`relative group rounded-lg overflow-hidden bg-surface-container-high aspect-video shadow-sm cursor-pointer border-2 transition-all ${
                        photo.active ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                      }`}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={photo.url}
                        alt={photo.name}
                      />
                      <div className="absolute inset-0 bg-primary/20 flex items-start justify-between p-1.5">
                        {photo.active && (
                          <span className="w-5 h-5 rounded-full bg-primary-container text-surface-container-lowest flex items-center justify-center shadow">
                            <span className="material-symbols-outlined text-[13px] font-bold">
                              check
                            </span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleRemovePhoto(photo.id, e)}
                          className="w-5 h-5 rounded-full bg-on-surface/60 hover:bg-error text-surface-container-lowest flex items-center justify-center backdrop-blur-sm transition-colors ml-auto cursor-pointer"
                          title="Remove photo"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-on-surface/80 px-1.5 py-0.5">
                        <p className="font-label-sm text-[10px] text-surface-container-lowest truncate">
                          {photo.name}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add More Slot */}
                  <label
                    htmlFor={fileInputId}
                    className="rounded-lg bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center text-secondary hover:text-on-surface aspect-video cursor-pointer transition-colors border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                    <span className="font-label-sm text-[11px] font-medium mt-1">+ Add More</span>
                  </label>
                </div>
              </div>

              {/* Key Highlights / Takeaways Prompt Input */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    className="font-label-md text-label-md text-on-surface font-medium"
                    htmlFor="takeaways"
                  >
                    What inspired you today?{' '}
                    <span className="text-secondary font-normal">(AI expands this)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleVoiceNoteToggle}
                    className={`flex items-center gap-1 text-body-sm font-label-sm transition-colors cursor-pointer ${
                      isRecordingVoice
                        ? 'text-error animate-pulse font-bold'
                        : 'text-primary hover:text-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isRecordingVoice ? 'graphic_eq' : 'mic'}
                    </span>
                    <span>{isRecordingVoice ? 'Listening...' : 'Voice Note'}</span>
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    id="takeaways"
                    rows={4}
                    value={takeaways}
                    onChange={(e) => setTakeaways(e.target.value)}
                    className="w-full rounded-lg bg-surface-container-low p-3.5 pr-8 font-body-md text-body-md text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all resize-none border border-outline-variant/30"
                  ></textarea>
                  <span className="material-symbols-outlined absolute right-2.5 top-3 text-secondary text-[18px]">
                    edit_note
                  </span>
                </div>
                <div className="flex items-center justify-between px-0.5">
                  <span className="font-body-sm text-[11px] text-secondary">
                    Token density: Optimal (~112 words inferred)
                  </span>
                  <span className="font-label-sm text-[11px] text-secondary">
                    {takeaways.length} / 500 chars
                  </span>
                </div>
              </div>

              {/* Tone Selector Chips */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Writing Tone & Narrative Angle
                </label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((tone) => {
                    const isSelected = selectedTone === tone;
                    return (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setSelectedTone(tone)}
                        className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-primary-container text-surface-container-lowest font-semibold shadow-sm'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                        <span>{tone}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Formatting Options Toggles */}
              <div className="flex flex-col gap-2.5 pt-2">
                <span className="font-label-sm text-[11px] text-secondary uppercase tracking-wider font-semibold">
                  Post Enhancements
                </span>
                <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/20">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      alternate_email
                    </span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      Include Keynote Speaker Tagging
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeSpeakerTagging}
                    onChange={(e) => setIncludeSpeakerTagging(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-container accent-primary-container focus:ring-0 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/20">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      view_carousel
                    </span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      Add Carousel Call-To-Action
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={addCarouselCTA}
                    onChange={(e) => setAddCarouselCTA(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-container accent-primary-container focus:ring-0 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/20">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      format_list_numbered
                    </span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      Format with emoji numbered bullets
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formatEmojiBullets}
                    onChange={(e) => setFormatEmojiBullets(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-container accent-primary-container focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Primary Generate Action Button */}
              <button
                type="button"
                id="generateBtn"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-2 py-3 px-4 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-75"
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isGenerating ? 'animate-spin' : ''
                  }`}
                >
                  {isGenerating ? 'refresh' : 'auto_awesome'}
                </span>
                <span>{isGenerating ? 'Synthesizing Post...' : 'Generate LinkedIn Post'}</span>
              </button>
            </div>

            {/* Help Banner / Pro Tip */}
            <div className="p-4 rounded-xl bg-secondary-container/50 flex items-start gap-3 border border-secondary-container">
              <span className="material-symbols-outlined text-primary-container text-[20px] mt-0.5">
                tips_and_updates
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Pro Attendee Tip
                </span>
                <p className="font-body-sm text-body-sm text-secondary">
                  Posts uploaded with keynote photos between 11:30 AM and 2:00 PM during summit
                  hours see a <strong>3.2x higher viral impression rate</strong> from peers on-site.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Authentic LinkedIn Mockup & Actions (7 Cols) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 sticky top-20">
            {/* Preview Top Bar Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  LinkedIn Post Preview
                </h2>
                <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[11px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  Auto-synced
                </span>
              </div>

              {/* Device switcher & Feed Mode Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-0.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setIsMobileView(false)}
                    className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      !isMobileView
                        ? 'bg-surface-container-lowest shadow-sm text-primary'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
                    <span>Desktop Feed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileView(true)}
                    className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isMobileView
                        ? 'bg-surface-container-lowest shadow-sm text-primary'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">smartphone</span>
                    <span>Mobile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Authentic LinkedIn Post Card (White Canvas + Native Platform Look) */}
            <div className={`transition-all duration-300 ${isMobileView ? 'max-w-md mx-auto w-full' : 'w-full'}`}>
              <article className="w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden transition-all duration-200 border border-outline-variant/30">
                {/* Post Author Profile Header */}
                <div className="p-4 pb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      alt={`${currentProfile?.name || 'Sarah Jenkins'} portrait`}
                      className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-surface-container-low"
                      src={
                        currentProfile?.avatarUrl ||
                        'https://lh3.googleusercontent.com/aida/AEtjO1XYq33tCqtSnpdeQ7RWvgfTHdqz6PbWoDYmguFclAkBbqFfiYIKxlbUjUtDga2vW7AgLOPKoozV4WGT_1LDCdackbNehchLrZZK6R2XqA4M1pzt4Htb93yPRn_d2af2WVycZUiFZTDams97-WQTuXRfw3paRkxPdjBmfb6hgluRk9dasOgxGnugULA5gxASBS947K8if6BbldJJrha6StRPmGh8Skgi1IBAObtVwD1sRIrcDZhjD6eu5xg'
                      }
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span 
                          onClick={() => onOpenAuthModal('signup')}
                          className="font-label-lg text-label-lg text-on-surface font-bold hover:underline cursor-pointer"
                          title="Click to edit profile"
                        >
                          {currentProfile?.name || 'Sarah Jenkins'}
                        </span>
                        <span className="text-secondary text-[12px] font-normal">• 1st</span>
                        <button
                          type="button"
                          onClick={() => onOpenAuthModal('signin')}
                          className="text-[10px] text-primary hover:underline font-semibold bg-primary/10 px-1.5 py-0.5 rounded cursor-pointer ml-1"
                        >
                          Switch
                        </button>
                      </div>
                      <p className="font-body-sm text-[12px] text-secondary truncate max-w-md">
                        {currentProfile?.headline ||
                          'VP of Product @ CloudScale | SaaS Summit Speaker | B2B SaaS Advisor'}
                      </p>
                      <div className="flex items-center gap-1 text-secondary font-body-sm text-[11px]">
                        <span>Just now</span>
                        <span>•</span>
                        <span className="material-symbols-outlined text-[12px]">public</span>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn 3-dots Menu Button */}
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('signup')}
                    className="p-1 rounded-full text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                    title="Edit profile"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                  </button>
                </div>

                {/* Post Verbatim Copy Area */}
                <div className="px-4 py-2 font-body-md text-[14px] text-on-surface leading-relaxed whitespace-pre-line select-text">
                  {getGeneratedPostContent()}
                </div>

                {/* Media Attachment inside card */}
                {activePhoto && (
                  <div className="mt-2 w-full bg-on-surface overflow-hidden relative group max-h-[380px] flex items-center justify-center">
                    <img
                      className="w-full h-full object-cover max-h-[380px]"
                      src={
                        activePhoto.name.includes('Keynote')
                          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF5_vtJFSZpWjVVLFGpq6c5uWu3StebzcUnE8MR0N2JmYfCKj7i8eTeEV2Gi9Igv7ec4ehvfiy0YWUtGhOEFbhHKtw6VRBOGbayzHMh3SbQVbtDfDvBIHhqfij1c6PGMQpE2fcGjLpMhLL50CV-ZZy4mGvrLqFJxp1czjE8wdVFmZ5xAk1p3g_WGCXabKAXRZLbtuwJfrWjDodsRy-joMuso5uMF8seav0eYTGUXHABu-leDUzhYAC'
                          : activePhoto.url
                      }
                      alt="Keynote event presentation"
                    />
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-on-surface/70 backdrop-blur-sm text-surface-container-lowest text-[11px] font-label-sm font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                      <span>Keynote Hall A • Live</span>
                    </div>
                  </div>
                )}

                {/* Social Proof & Engagement Bar */}
                <div className="px-4 py-2.5 flex items-center justify-between text-secondary font-body-sm text-[12px] bg-surface-container-lowest border-t border-outline-variant/10">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center -space-x-1">
                      <span className="w-4 h-4 rounded-full bg-primary-container text-surface-container-lowest flex items-center justify-center text-[10px] shadow">
                        👍
                      </span>
                      <span className="w-4 h-4 rounded-full bg-tertiary-container text-surface-container-lowest flex items-center justify-center text-[10px] shadow">
                        💡
                      </span>
                      <span className="w-4 h-4 rounded-full bg-error text-surface-container-lowest flex items-center justify-center text-[10px] shadow">
                        ❤️
                      </span>
                    </div>
                    <span className="hover:underline cursor-pointer font-medium pl-0.5">
                      {likeCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hover:underline cursor-pointer">18 comments</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">4 reposts</span>
                  </div>
                </div>

                {/* Standard LinkedIn Native 4-Column Action Bar */}
                <div className="px-2 py-1 bg-surface-container-lowest grid grid-cols-4 gap-1 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={handleLikeToggle}
                    className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-surface-container transition-colors font-label-md text-label-md font-semibold cursor-pointer ${
                      hasLiked ? 'text-primary' : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        hasLiked ? 'fill' : ''
                      }`}
                      style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      thumb_up
                    </span>
                    <span>{hasLiked ? 'Liked' : 'Like'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Comment drawer opened.')}
                    className="py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-secondary hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">mode_comment</span>
                    <span>Comment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Repost prompt: Repost to your LinkedIn feed with thoughts.')}
                    className="py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-secondary hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">repeat</span>
                    <span>Repost</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Send directly via LinkedIn InMail.')}
                    className="py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-secondary hover:bg-surface-container hover:text-on-surface transition-colors font-label-md text-label-md font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Send</span>
                  </button>
                </div>
              </article>
            </div>

            {/* Post Action Controls Bar */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 border border-outline-variant/30">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenLinkedIn}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-surface-container-lowest font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  <span>Open LinkedIn & Paste</span>
                </button>
                <button
                  type="button"
                  id="copyBtn"
                  onClick={handleCopy}
                  title="Copy Text"
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {copiedText ? 'done' : 'content_copy'}
                  </span>
                  <span className="hidden md:inline font-semibold">
                    {copiedText ? 'Copied!' : 'Copy Text'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Regenerate</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Generated high-res graphic badge ready for download!')}
                  className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download Graphic</span>
                </button>
              </div>
            </div>

            {/* Live Post Optimization Score Card Widget */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  {/* Inline Circular Progress SVG (94%) */}
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    ></path>
                    <path
                      className="text-primary-container"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#0a66c2"
                      strokeDasharray="94, 100"
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></path>
                  </svg>
                  <span className="absolute font-headline-sm text-[13px] font-bold text-on-surface">
                    94
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      High Virality Score (94/100)
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-secondary-container text-on-secondary-fixed">
                      Top 5%
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Optimal hashtag density (4 tags), speaker attribution, and high-readability numbered structure.
                  </p>
                </div>
              </div>
              <div className="hidden xl:flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-surface-container-low text-secondary font-label-sm text-[11px]">
                  Read Time: <strong>26 sec</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
