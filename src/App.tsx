import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, TransitionType, EventConfig, CuratedPrompt, LivePost } from './types.ts';
import { Header } from './components/Header.tsx';
import { OrganizerDashboard } from './components/OrganizerDashboard.tsx';
import { AttendeeGenerator } from './components/AttendeeGenerator.tsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('organizer-dashboard');
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global event config shared across Organizer & Attendee views
  const [config, setConfig] = useState<EventConfig>({
    eventName: 'SaaS Innovate Summit 2025',
    hostEntity: 'PulseTech Global',
    hashtags: ['#SaaSInnovate2025', '#PulseTech', '#B2BGrowth'],
    linkedinUrl: 'linkedin.com/company/pulsetech',
    twitterHandle: 'PulseTechHQ',
    websiteUrl: 'https://saasinnovate.io',
    portalUrl: 'https://eventpulse.app/event/saas-2025',
  });

  // Curated prompts
  const [prompts, setPrompts] = useState<CuratedPrompt[]>([
    {
      id: 'prompt-1',
      title: '1. Grateful Attendee / Keynote Takeaway',
      isDefault: true,
      preview: 'Honored to spend today at SaaS Innovate Summit learning how modern engineering teams leverage autonomous AI agents...',
      takeawayText: 'Mind blown by the keynote on AI-driven PLG! The session on building durable unit economics had 3 actionable gems...',
      tone: 'Grateful Attendee',
    },
    {
      id: 'prompt-2',
      title: '2. Panel Discussion Insights & Quotes',
      isDefault: false,
      preview: '3 major takeaways from the Future of Enterprise Infra stage with PulseTech Global leadership...',
      takeawayText: '3 major takeaways from the Future of Enterprise Infra stage with PulseTech Global leadership on cloud economics.',
      tone: 'Key Takeaways / Educational',
    },
    {
      id: 'prompt-3',
      title: '3. Networking & Meetup Selfie',
      isDefault: false,
      preview: 'Reconnecting with old colleagues and meeting brilliant minds across product design here in San Francisco!',
      takeawayText: 'Reconnecting with old colleagues and meeting brilliant minds across product design here in San Francisco!',
      tone: 'Casual & Fun',
    },
  ]);

  // Live stream posts
  const [livePosts] = useState<LivePost[]>([
    {
      id: 'post-1',
      authorName: 'Sarah Jenkins',
      authorRole: 'VP Product @ ScaleFlow',
      timeAgo: '4m ago',
      likes: 142,
      content: 'Mind blown by the morning keynote on autonomous SaaS workflows at #SaaSInnovate2025. Here are the 3 structural shifts we are rolling out tomorrow...',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALRdnEb2EuAzfH6tTdcD2BUY6liZIcx_YFmYpfJfQjKTP4P2V-UlvDut_XHMEvWU7Z1Dc-kNBVwU2aVzv-3nKJZLaF5m1rXpagySf-qEWUMnYBNq4xM1Xv6UNBNotCimr_joBA2AuKE697myuEFBnMMTAzi-I8by8dP15MhK5ND06OqZnZHS86nRZDl4yqRAKCSrnuGzOxJuBYo2-f-M4C3bEa9l2A7JKNB4ycDxyZSq4iQv5lJQ_P',
    },
    {
      id: 'post-2',
      authorName: 'David Chen',
      authorRole: 'Founder @ CloudOps Labs',
      timeAgo: '18m ago',
      likes: 88,
      content: 'Great catching up with the @PulseTechHQ engineers after their benchmark deep dive. True community energy in the hallways!',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw6_wQwn4zjH_9FP5luOuNfPZj6TiJi5NBCG99VnD495TKGoeTDIIm_lKcV4Fp-ZORKbqeroEZyrVgiYVQLc23jI9xNaDOFXOXgDi148bSYGlUkZ_MNvEw0YQhHVpixJSwA7PdV-IuLZ67Zdnk1k6wlZIVYM775f0thWyx4_P-Dh-Bx2crjbaTVX8Hf929HLcynj1v8gt40DUPnLAlNSpujfvF4TQmXZ0vuQ9w_NamxuoHlgPkRro2',
    },
  ]);

  // Attendee draft state
  const [attendeeTakeaways, setAttendeeTakeaways] = useState(
    'Mind blown by the keynote on AI-driven PLG! The session on building durable unit economics had 3 actionable gems...'
  );
  const [selectedTone, setSelectedTone] = useState('Grateful Attendee');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleNavigate = (screen: Screen, transition: TransitionType = 'none') => {
    setTransitionType(transition);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectPromptForAttendee = (prompt: CuratedPrompt) => {
    setAttendeeTakeaways(prompt.takeawayText);
    setSelectedTone(prompt.tone);
    showToast(`Loaded "${prompt.title}" into Attendee Generator`);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col relative selection:bg-primary-container selection:text-white">
      {/* Fixed Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        eventName={config.eventName}
      />

      {/* Screen Container with Push or None Transition */}
      <main className="w-full flex-1">
        {transitionType === 'push' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ x: '100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-30%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-full"
            >
              {currentScreen === 'organizer-dashboard' ? (
                <OrganizerDashboard
                  config={config}
                  setConfig={setConfig}
                  prompts={prompts}
                  setPrompts={setPrompts}
                  livePosts={livePosts}
                  onNavigate={handleNavigate}
                  onSelectPromptForAttendee={handleSelectPromptForAttendee}
                  showToast={showToast}
                />
              ) : (
                <AttendeeGenerator
                  config={config}
                  takeaways={attendeeTakeaways}
                  setTakeaways={setAttendeeTakeaways}
                  selectedTone={selectedTone}
                  setSelectedTone={setSelectedTone}
                  showToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full">
            {currentScreen === 'organizer-dashboard' ? (
              <OrganizerDashboard
                config={config}
                setConfig={setConfig}
                prompts={prompts}
                setPrompts={setPrompts}
                livePosts={livePosts}
                onNavigate={handleNavigate}
                onSelectPromptForAttendee={handleSelectPromptForAttendee}
                showToast={showToast}
              />
            ) : (
              <AttendeeGenerator
                config={config}
                takeaways={attendeeTakeaways}
                setTakeaways={setAttendeeTakeaways}
                selectedTone={selectedTone}
                setSelectedTone={setSelectedTone}
                showToast={showToast}
              />
            )}
          </div>
        )}
      </main>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-container-highest/95 backdrop-blur-md text-on-surface shadow-2xl border border-outline-variant/50 text-sm font-medium"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">
              info
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
