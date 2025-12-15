import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Page, Layout, Card, TextField, Tabs, Select, ChoiceList, BlockStack, InlineStack,
  Text, Button, Collapsible, Box, InlineGrid, Divider, Popover, ColorPicker, LegacyCard,
  ButtonGroup, Checkbox, RangeSlider, RadioButton, Modal
} from '@shopify/polaris';
import { MagicIcon, LanguageIcon, LinkIcon, DesktopIcon, MobileIcon } from '@shopify/polaris-icons';

// --- IMPORT TEMPLATES FROM DATA FOLDER ---
import { PREDEFINED_TEMPLATES } from '../data/barTemplates';

// -------- Constants ----------
const animationOptions = [
  { label: 'None', value: 'none' },
  { label: 'Bounce', value: 'bounce' },
  { label: 'Fade In', value: 'fade' },
  { label: 'Slide Down', value: 'slideDown' },
  { label: 'Slide Up', value: 'slideUp' },
  { label: 'Pulse', value: 'pulse' },
];

// --- UPDATED CSS FOR ROBUST RESPONSIVENESS ---
const animationKeyframes = `
@keyframes flexibar-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes flexibar-fadeIn { 0% { opacity:0; transform: translateY(8px); } 100% { opacity:1; transform: translateY(0); } }
@keyframes flexibar-slideDown { 0% { opacity:0; transform: translateY(-10px); } 100% { opacity:1; transform: translateY(0); } }
@keyframes flexibar-slideUp { 0% { opacity:0; transform: translateY(10px); } 100% { opacity:1; transform: translateY(0); } }
@keyframes flexibar-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }

/* ===== DESKTOP / DEFAULT STYLES ===== */
.flexibar-announcement-bar {
  width: 100%;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  min-height: auto;
  height: auto;
  flex-wrap: nowrap; /* Default: Don't wrap unless necessary */
}

/* Message should be flexible but not stretch unnecessarily */
.flexibar-message {
  flex: 0 1 auto; /* Can shrink but won't grow */
  white-space: nowrap; /* Keep on one line by default */
  font-size: 15px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Only wrap text when it actually doesn't fit */
@media (max-width: 900px) {
  .flexibar-message {
    white-space: normal; /* Allow wrapping on smaller screens */
    overflow: visible;
    text-overflow: clip;
  }
}

.flexibar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0; /* Actions never shrink */
  flex-wrap: nowrap;
}

.flexibar-countdown {
  display: flex;
  gap: 6px;
}

.flexibar-countdown-block {
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  min-width: 36px;
  text-align: center;
  line-height: 1.2;
  font-size: 0.9em;
}

.flexibar-countdown-value {
  display: block;
  font-size: 1em;
}

.flexibar-countdown-label {
  display: block;
  font-size: 0.7em;
  opacity: 0.9;
  text-transform: uppercase;
  margin-top: 2px;
}

.flexibar-button {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95em;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.flexibar-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ===== MOBILE MODE STYLES (Triggered by .is-mobile class) ===== */
/* This forces the layout to break even inside a desktop browser preview */
.flexibar-announcement-bar.is-mobile {
  padding: 12px 14px !important;
  gap: 10px !important;
  flex-direction: column !important; /* Forces vertical stacking */
  align-items: center !important;
  justify-content: center !important;
  height: auto !important;
  min-height: auto !important;
  text-align: center !important;
}

.flexibar-announcement-bar.is-mobile .flexibar-message {
  flex: 0 0 auto !important;
  width: 100% !important;
  min-width: auto !important;
  white-space: normal !important; /* FORCE TEXT WRAP */
  overflow: visible !important;
  text-overflow: clip !important;
  text-align: center !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  margin-bottom: 10px !important; /* Space between text and actions */
}

.flexibar-announcement-bar.is-mobile .flexibar-actions {
  width: 100% !important;
  justify-content: center !important;
  gap: 8px !important;
  flex-wrap: wrap !important;
}

.flexibar-announcement-bar.is-mobile .flexibar-countdown-block {
  padding: 3px 6px !important;
  min-width: 32px !important;
  font-size: 0.85em !important;
}

/* ===== RESPONSIVE BREAKPOINTS ===== */
/* Tablet and smaller - wrap to vertical layout */
@media (max-width: 768px) {
  .flexibar-announcement-bar:not(.is-mobile) {
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
  }
  
  .flexibar-announcement-bar:not(.is-mobile) .flexibar-message {
    width: 100%;
    text-align: center;
    white-space: normal;
  }
  
  .flexibar-announcement-bar:not(.is-mobile) .flexibar-actions {
    width: 100%;
    justify-content: center;
  }
}

/* Small desktop - allow text to wrap if really needed */
@media (min-width: 769px) and (max-width: 1100px) {
  .flexibar-announcement-bar:not(.is-mobile) {
    gap: 14px;
  }
  
  .flexibar-message {
    max-width: 55%;
  }
}

/* Very tight spaces - wrap everything */
@media (max-width: 600px) {
  .flexibar-announcement-bar:not(.is-mobile) {
    padding: 12px;
    gap: 10px;
  }
  
  .flexibar-announcement-bar:not(.is-mobile) .flexibar-countdown-block {
    padding: 3px 6px;
    min-width: 32px;
    font-size: 0.85em;
  }
}


/* ===== RESPONSIVE BREAKPOINT FOR DESKTOP ===== */
/* When the bar gets narrow (like in a smaller preview), wrap actions to next line */
@media (max-width: 768px) {
  .flexibar-announcement-bar:not(.is-mobile) {
    padding: 14px 16px;
  }
  
  .flexibar-announcement-bar:not(.is-mobile) .flexibar-message {
    min-width: 150px;
    width: 100%;
  }
  
  .flexibar-announcement-bar:not(.is-mobile) .flexibar-actions {
    width: 100%;
    justify-content: center;
    margin-top: 8px;
  }
}

/* ===== COMPACT MODE - For when content + actions don't fit in one line ===== */
.flexibar-announcement-bar.compact-mode {
  flex-direction: column !important;
  align-items: flex-start !important;
  padding: 14px 20px !important;
}

.flexibar-announcement-bar.compact-mode .flexibar-message {
  width: 100% !important;
  margin-bottom: 10px !important;
}

.flexibar-announcement-bar.compact-mode .flexibar-actions {
  width: 100% !important;
  justify-content: flex-end !important;
}
`;

// -------- Helper Functions ----------
function hsbToHex({ hue, saturation, brightness }) {
  const h = hue; const s = saturation; const v = brightness; const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1)); const m = v - c;
  let r1 = 0, g1 = 0, b1 = 0;
  if (0 <= h && h < 60) { r1 = c; g1 = x; } else if (60 <= h && h < 120) { r1 = x; g1 = c; } else if (120 <= h && h < 180) { g1 = c; b1 = x; } else if (180 <= h && h < 240) { g1 = x; b1 = c; } else if (240 <= h && h < 300) { r1 = x; b1 = c; } else if (300 <= h && h < 360) { r1 = c; b1 = x; }
  const r = Math.round((r1 + m) * 255); const g = Math.round((g1 + m) * 255); const b = Math.round((b1 + m) * 255);
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getAnimationValue(animationType) {
  switch (animationType) {
    case 'bounce': return 'flexibar-bounce 1.1s ease-in-out infinite';
    case 'fade': return 'flexibar-fadeIn 0.4s ease-out';
    case 'slideDown': return 'flexibar-slideDown 0.45s ease-out';
    case 'slideUp': return 'flexibar-slideUp 0.45s ease-out';
    case 'pulse': return 'flexibar-pulse 1.1s ease-in-out infinite';
    default: return '';
  }
}

function parseTargetDate(content) {
  if (!content.targetDate) return null;
  const parts = content.targetDate.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10); const month = parseInt(parts[1], 10); const day = parseInt(parts[2], 10);
  let hour = parseInt(content.targetTimeH || '0', 10);
  const minute = parseInt(content.targetTimeM || '0', 10);
  const ampm = content.targetTimeAmPm || 'PM';
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function formatTime(num) { return String(num).padStart(2, '0'); }

function calculateCountdown(content) {
  const target = parseTargetDate(content);
  if (!target) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  const dayMs = 1000 * 60 * 60 * 24; const hourMs = 1000 * 60 * 60; const minuteMs = 1000 * 60;
  const days = Math.floor(diff / dayMs); diff -= days * dayMs;
  const hours = Math.floor(diff / hourMs); diff -= hours * hourMs;
  const minutes = Math.floor(diff / minuteMs); diff -= minutes * minuteMs;
  const seconds = Math.floor(diff / 1000);
  return { days: formatTime(days), hours: formatTime(hours), minutes: formatTime(minutes), seconds: formatTime(seconds) };
}

function createEmptyContent(index) {
  return {
    id: `${Date.now()}-${index}`,
    label: `Content ${index}`,
    message: 'NEW COLLECTION LAUNCHED. 20% Flat Discount on Clothes with a longer text to test mobile responsiveness.',
    showButton: true,
    buttonText: 'Shop Now',
    buttonUrl: '',
    btnBgColor: '#FA4150',
    btnTextColor: '#FFFFFF',
    showCountdown: false,
    targetDate: '2025-10-21',
    targetTimeH: '10',
    targetTimeM: '21',
    targetTimeAmPm: 'PM',
    template: 'none',
    animationType: 'bounce',
    countdownShowDays: true,
    countdownShowLabels: true,
    showButtonAdvance: false,
    showCountdownAdvance: false,
    buttonRadius: '5',
    countdownBgColor: '#FA4150',
    countdownTextColor: '#FFFFFF',
    // --- LINK BUILDER FIELDS ---
    hasLink: false,
    linkText: 'Click Here',
    linkUrl: 'https://example.com',
    linkColor: '#D56767',
    linkUnderline: true,
    linkNewTab: true
  };
}

// -------- Components ----------

const ColorPickerButton = ({ label, color, onChange }) => {
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((prev) => !prev), []);
  const [hsbColor, setHsbColor] = useState({ hue: 0, saturation: 0, brightness: 1 });

  return (
    <BlockStack gap="100">
      <Text variant="bodyMd" as="span">{label}</Text>
      <Popover active={active} activator={
          <div onClick={toggleActive} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #dcdcdc', padding: '6px 12px', borderRadius: '8px', background: '#fff', minWidth: '100px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: color, borderRadius: '4px', border: '1px solid #ddd' }} />
            <Text as="span" variant="bodyMd">{color}</Text>
          </div>
        } onClose={toggleActive}>
        <Box padding="400" minWidth="240px">
          <ColorPicker color={hsbColor} onChange={(c) => { setHsbColor(c); onChange(hsbToHex(c)); }} />
        </Box>
      </Popover>
    </BlockStack>
  );
};

// Pure Component for Skeleton
const EcommerceSkeleton = React.memo(({ mode = 'desktop' }) => {
  const isMobile = mode === 'mobile';
  return (
    <div style={{ width: '100%', padding: '20px', backgroundColor: '#f1f1f1', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ width: '100px', height: '20px', background: '#e0e0e0', borderRadius: '4px' }}></div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: '#e0e0e0', borderRadius: '50%' }}></div>
          <div style={{ width: '30px', height: '30px', background: '#e0e0e0', borderRadius: '50%' }}></div>
        </div>
      </div>
      <div style={{ width: '100%', height: isMobile ? '150px' : '200px', background: '#e0e0e0', borderRadius: '8px' }} />
      <div style={{ width: '60%', height: '15px', background: '#e0e0e0', borderRadius: '4px', marginTop: '10px' }} />
      <div style={{ width: '90%', height: '10px', background: '#e0e0e0', borderRadius: '4px' }} />
      <div style={{ width: '80%', height: '10px', background: '#e0e0e0', borderRadius: '4px' }} />
      <div style={{ width: '85%', height: '10px', background: '#e0e0e0', borderRadius: '4px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: '15px', marginTop: '20px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#e0e0e0', borderRadius: '8px', marginBottom: '8px' }} />
            <div style={{ width: '70%', height: '10px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '5px' }} />
          </div>
        ))}
      </div>
    </div>
  );
});

// --- UPDATED TheBar COMPONENT WITH SMART WRAPPING ---
const TheBar = ({ content, barBgColor, backgroundType, gradientColorFrom, gradientColorTo, gradientAngle, fontFamily, fontColor, fontSize, isBold, viewMode }) => {
  if (!content) return null;
  const [countdown, setCountdown] = useState(() => calculateCountdown(content));
  const barRef = useRef(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!content.showCountdown) return;
    const interval = setInterval(() => { setCountdown(calculateCountdown(content)); }, 1000);
    return () => clearInterval(interval);
  }, [content.showCountdown, content.targetDate, content.targetTimeH, content.targetTimeM, content.targetTimeAmPm]);

  // Check if content needs to wrap
  useEffect(() => {
    const checkLayout = () => {
      if (!barRef.current || viewMode === 'mobile') return;
      
      const barWidth = barRef.current.offsetWidth;
      const messageEl = barRef.current.querySelector('.flexibar-message');
      const actionsEl = barRef.current.querySelector('.flexibar-actions');
      
      if (messageEl && actionsEl) {
        const messageWidth = messageEl.scrollWidth;
        const actionsWidth = actionsEl.scrollWidth;
        const totalNeeded = messageWidth + actionsWidth + 100; // Add gap and padding
        
        setIsCompact(totalNeeded > barWidth);
      }
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, [content, viewMode]);

  let backgroundStyle = barBgColor;
  if (backgroundType === 'gradient') {
    backgroundStyle = `linear-gradient(${gradientAngle}deg, ${gradientColorFrom}, ${gradientColorTo})`;
  }

  let fontFamilyValue = fontFamily === 'inter' ? 'Inter, sans-serif' : fontFamily; 
  if (fontFamily === 'josefin sans') fontFamilyValue = "'Josefin Sans', sans-serif";
  if (fontFamily === 'madimi one') fontFamilyValue = "'Madimi One', cursive";

  const countdownBlocks = [];
  if (content.countdownShowDays) countdownBlocks.push({ label: content.countdownShowLabels ? 'Days' : '', value: countdown.days });
  countdownBlocks.push({ label: content.countdownShowLabels ? 'Hours' : '', value: countdown.hours }, { label: content.countdownShowLabels ? 'Minutes' : '', value: countdown.minutes }, { label: content.countdownShowLabels ? 'Seconds' : '', value: countdown.seconds });

  // Build class names
  const mobileClass = viewMode === 'mobile' ? 'is-mobile' : '';
  const compactClass = isCompact && viewMode !== 'mobile' ? 'compact-mode' : '';

  return (
    <div 
      ref={barRef}
      className={`flexibar-announcement-bar ${mobileClass} ${compactClass}`}
      style={{ 
        background: backgroundStyle, 
        color: fontColor, 
        fontFamily: fontFamilyValue,
        fontWeight: isBold ? 700 : 400,
        animation: getAnimationValue(content.animationType)
      }}
    >
      <span className="flexibar-message" style={{ fontSize: fontSize === 'small' ? '13px' : fontSize === 'large' ? '17px' : '15px' }}>
        {content.message}
        {content.hasLink && (
           <a 
             href={content.linkUrl} 
             target={content.linkNewTab ? '_blank' : '_self'}
             rel="noreferrer"
             style={{ 
               color: content.linkColor, 
               textDecoration: content.linkUnderline ? 'underline' : 'none',
               marginLeft: '6px',
               cursor: 'pointer'
             }}
           >
             {content.linkText}
           </a>
        )}
      </span>
      <div className="flexibar-actions">
        {content.showCountdown && (
          <div className="flexibar-countdown">
            {countdownBlocks.map((item, idx) => (
              <div key={idx} className="flexibar-countdown-block" style={{
                background: content.countdownBgColor || 'rgba(0, 0, 0, 0.2)',
                color: content.countdownTextColor || fontColor
              }}>
                <span className="flexibar-countdown-value">{item.value}</span>
                {item.label && <span className="flexibar-countdown-label">{item.label}</span>}
              </div>
            ))}
          </div>
        )}
        {content.showButton && (
          <button 
            className="flexibar-button"
            style={{ 
              backgroundColor: content.btnBgColor, 
              color: content.btnTextColor,
              borderRadius: `${content.buttonRadius || 5}px`
            }}
          >
            {content.buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

const CleanPreviewContainer = ({ content, viewMode, barPosition = 'top', barBgColor, backgroundType, gradientColorFrom, gradientColorTo, gradientAngle, fontFamily, fontColor, fontSize, isBold, onPrevContent, onNextContent, hasMultipleContents, currentIndex, totalContents, slideMode, slideDuration }) => {
  const isMobile = viewMode === 'mobile';
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  
  const [displayContent, setDisplayContent] = useState(content);

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayContent(content);
    }
  }, [content, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setSlideDirection('next');
    setIsTransitioning(true);
    setTimeout(() => {
      onNextContent(); 
      setSlideDirection('');
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, onNextContent]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setSlideDirection('prev');
    setIsTransitioning(true);
    setTimeout(() => {
      onPrevContent();
      setSlideDirection('');
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, onPrevContent]);

  useEffect(() => {
    let interval;
    if (slideMode === 'auto' && hasMultipleContents && !isTransitioning) {
      interval = setInterval(() => {
        handleNext();
      }, slideDuration * 1000);
    }
    return () => clearInterval(interval);
  }, [slideMode, slideDuration, hasMultipleContents, handleNext, isTransitioning, currentIndex]);

  const slideStyle = {
    position: 'absolute',
    width: '100%',
    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning 
      ? (slideDirection === 'prev' ? 'translateX(20%)' : 'translateX(-20%)') 
      : 'translateX(0)',
  };
  
  return (
    <div style={{ 
      width: '100%', 
      background: '#F4F6F8', 
      padding: '24px 0', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      minHeight: '500px', 
      position: 'relative'
    }}>
      
      {/* Device Frame */}
      <div style={{ 
        width: isMobile ? '375px' : '100%',
        maxWidth: isMobile ? '375px' : '100%',
        background: '#FFFFFF', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
        border: '1px solid #E5E7EB', 
        borderRadius: isMobile ? '16px' : '8px', 
        overflow: 'visible', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        
        {/* Top Bar Container */}
        {barPosition === 'top' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: 'auto', background: '#fff', overflow: 'visible' }}>
            
            {hasMultipleContents && slideMode === 'manual' && (
              <button
                onClick={handlePrev}
                disabled={isTransitioning}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)', cursor: isTransitioning ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F2937',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 100, opacity: isTransitioning ? 0.5 : 1, transition: 'opacity 0.2s'
                }}
              >‹</button>
            )}
            
            <div style={{ flex: 1, overflow: 'visible', position: 'relative', minHeight: "auto" }}>
              <div style={slideStyle}>
                <TheBar 
                  content={displayContent} barBgColor={barBgColor} backgroundType={backgroundType} 
                  gradientColorFrom={gradientColorFrom} gradientColorTo={gradientColorTo} gradientAngle={gradientAngle} 
                  fontFamily={fontFamily} fontColor={fontColor} fontSize={fontSize} isBold={isBold} 
                  viewMode={viewMode}
                />
              </div>
            </div>
            
            {hasMultipleContents && slideMode === 'manual' && (
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)', cursor: isTransitioning ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F2937',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 100, opacity: isTransitioning ? 0.5 : 1, transition: 'opacity 0.2s'
                }}
              >›</button>
            )}
          </div>
        )}
        
        <EcommerceSkeleton mode={viewMode} />
        
        {/* Bottom Bar Container */}
        {barPosition === 'bottom' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: "auto" }}>
             
             {hasMultipleContents && slideMode === 'manual' && (
              <button
                onClick={handlePrev}
                disabled={isTransitioning}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)', cursor: isTransitioning ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F2937',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 100, opacity: isTransitioning ? 0.5 : 1
                }}
              >‹</button>
            )}
            
            <div style={{ flex: 1, overflow: 'visible', position: 'relative', minHeight: "auto" }}>
              <div style={slideStyle}>
                <TheBar 
                  content={displayContent} barBgColor={barBgColor} backgroundType={backgroundType} 
                  gradientColorFrom={gradientColorFrom} gradientColorTo={gradientColorTo} gradientAngle={gradientAngle} 
                  fontFamily={fontFamily} fontColor={fontColor} fontSize={fontSize} isBold={isBold} 
                  viewMode={viewMode}
                />
              </div>
            </div>
             
             {hasMultipleContents && slideMode === 'manual' && (
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)', cursor: isTransitioning ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F2937',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 100, opacity: isTransitioning ? 0.5 : 1
                }}
              >›</button>
            )}
          </div>
        )}
        
        {/* Content Indicator Dots */}
        {hasMultipleContents && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            padding: '6px 10px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '100px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 50
          }}>
            {Array.from({ length: totalContents }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === currentIndex ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: idx === currentIndex ? '#1F2937' : '#D1D5DB',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// -------- Main Component ----------
function CreateBarPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [barName, setBarName] = useState('');
  const [template, setTemplate] = useState('none');
  const [barType, setBarType] = useState('multiple');
  const [contents, setContents] = useState([createEmptyContent(1)]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Link Builder Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [tempLinkData, setTempLinkData] = useState({
      linkText: '', linkUrl: '', linkColor: '', linkUnderline: true, linkNewTab: true
  });

  // Slide Settings
  const [slideMode, setSlideMode] = useState('manual');
  const [slideDuration, setSlideDuration] = useState(5);

  // Design States
  const [fontFamily, setFontFamily] = useState('inter');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState('small');
  const [isBold, setIsBold] = useState(false);
  const [backgroundType, setBackgroundType] = useState('solid');
  const [barBgColor, setBarBgColor] = useState('#4F46E5');
  const [gradientColorFrom, setGradientColorFrom] = useState('#F0A15G');
  const [gradientColorTo, setGradientColorTo] = useState('#F87171');
  const [gradientAngle, setGradientAngle] = useState(32);
  const [barPosition, setBarPosition] = useState('top');
  const [isSticky, setIsSticky] = useState(true);

  // Placing States
  const [schedulingEnabled, setSchedulingEnabled] = useState(true);
  const [startMode, setStartMode] = useState('now');
  const [startDate, setStartDate] = useState('2025-10-21');
  const [startHour, setStartHour] = useState('10');
  const [startMinute, setStartMinute] = useState('21');
  const [startAmPm, setStartAmPm] = useState('PM');
  const [endMode, setEndMode] = useState('date');
  const [endDate, setEndDate] = useState('2025-10-25');
  const [endHour, setEndHour] = useState('10');
  const [endMinute, setEndMinute] = useState('21');
  const [endAmPm, setEndAmPm] = useState('PM');
  const [deviceTarget, setDeviceTarget] = useState('all');
  const [pageScope, setPageScope] = useState('specific');
  const [pageCart, setPageCart] = useState(true);
  const [pageCollection, setPageCollection] = useState(true);
  const [pageCheckout, setPageCheckout] = useState(false);
  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(true);
  const [countryScope, setCountryScope] = useState('specific');
  const [country, setCountry] = useState('Algeria');

  // Handlers
  const handleTabChange = useCallback((index) => setSelectedTab(index), []);
  const updateContentField = (index, field, value) => { setContents((prev) => { const copy = [...prev]; copy[index] = { ...copy[index], [field]: value }; return copy; }); };
  const triggerPreviewLoading = () => { setIsLoadingPreview(true); setTimeout(() => setIsLoadingPreview(false), 400); };
  
  const handleChangeContent = (i) => { setActiveIndex(i); triggerPreviewLoading(); };
  const addContent = () => { setContents(p => [...p, createEmptyContent(p.length + 1)]); setActiveIndex(contents.length); triggerPreviewLoading(); };
  const removeContent = (index) => { if(contents.length > 1) { const u = [...contents]; u.splice(index, 1); setContents(u); setActiveIndex(0); triggerPreviewLoading(); }};
  const handleChangePreviewMode = (mode) => { setPreviewMode(mode); };
  const handleDesignAnimationChange = (val) => setContents(p => p.map(c => ({...c, animationType: val})));
  
  const handlePrevContent = () => {
    const newIndex = activeIndex === 0 ? contents.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
  };
  
  const handleNextContent = () => {
    const newIndex = activeIndex === contents.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
  };

  const handlePublish = useCallback(() => {
    setIsPublishing(true);
    console.log("Publishing Bar Data...");
    setTimeout(() => {
        setIsPublishing(false);
        console.log("Published!");
    }, 1000);
  }, []);

  const handleDiscard = useCallback(() => {
      console.log("Discard clicked");
  }, []);

  // --- LINK MODAL HANDLERS ---
  const activeContent = contents[activeIndex];

  const handleOpenLinkModal = () => {
    setTempLinkData({
        linkText: activeContent.linkText || 'Click Here',
        linkUrl: activeContent.linkUrl || 'https://',
        linkColor: activeContent.linkColor || '#D56767',
        linkUnderline: activeContent.linkUnderline !== false,
        linkNewTab: activeContent.linkNewTab !== false
    });
    setIsLinkModalOpen(true);
  };

  const handleCloseLinkModal = () => {
      setIsLinkModalOpen(false);
  };

  const handleInsertLink = () => {
      updateContentField(activeIndex, 'hasLink', true);
      updateContentField(activeIndex, 'linkText', tempLinkData.linkText);
      updateContentField(activeIndex, 'linkUrl', tempLinkData.linkUrl);
      updateContentField(activeIndex, 'linkColor', tempLinkData.linkColor);
      updateContentField(activeIndex, 'linkUnderline', tempLinkData.linkUnderline);
      updateContentField(activeIndex, 'linkNewTab', tempLinkData.linkNewTab);
      setIsLinkModalOpen(false);
  };

  const handleTemplateSelection = (val) => {
    setTemplate(val);
    const selected = PREDEFINED_TEMPLATES.find(t => t.value === val);
    if (!selected || !selected.data) return;
    const data = selected.data;

    setContents(prev => {
        const copy = [...prev];
        copy[activeIndex] = {
            ...copy[activeIndex],
            message: data.textSettings.message || copy[activeIndex].message,
            showButton: data.buttonSettings.isSelected,
            buttonText: data.buttonSettings.content || 'Click Here',
            showCountdown: data.countdownSettings.isSelected,
            animationType: data.barDesignSettings.animation === 'fallingTop' ? 'slideDown' : 'none'
        };
        return copy;
    });

    setFontColor(data.textSettings.style.color);
    const size = data.textSettings.style.fontSize;
    setFontSize(size < 18 ? 'medium' : size >= 18 ? 'large' : 'small');
    setFontFamily(data.textSettings.style.fontFamily.toLowerCase());
    setIsBold(data.textSettings.style.fontWeight > 400);
    setBackgroundType(data.barDesignSettings.backgroundType);
    if (data.barDesignSettings.backgroundType === 'solid') {
        setBarBgColor(data.barDesignSettings.style.background);
    } else {
        setGradientColorFrom(data.barDesignSettings.style.gradientColor1);
        setGradientColorTo(data.barDesignSettings.style.gradientColor2);
        setGradientAngle(data.barDesignSettings.style.gradientAngle);
    }
    setBarPosition(data.barDesignSettings.position);
    triggerPreviewLoading();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationKeyframes }} />
      <style>
        {`
          .Polaris-Page {
            padding-left: 24px !important;
            padding-right: 24px !important;
            max-width: 100% !important;
          }
          .Polaris-Layout__Section {
            max-width: 1200px !important;
            margin: 0 auto !important;
          }
        `}
      </style>
      <Page 
          backAction={{ content: 'Flexibar', onAction: () => console.log('Back clicked') }} 
          title={`Flexibar - ${barName || 'Bar Name'}`}
          subtitle="Create Bar" 
          compactTitle
          primaryAction={{
              content: 'Save & Publish',
              onAction: handlePublish,
              loading: isPublishing,
              variant: 'primary',
          }}
          secondaryActions={[
              {
                  content: 'Discard',
                  onAction: handleDiscard,
              }
          ]}
      >
        <Layout>
          <Layout.Section>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {/* LEFT - Editor */}
              <div style={{ width: '380px', minWidth: '380px', flexShrink: 0 }}>
                <div style={{ marginBottom: 16 }}><Tabs tabs={[{id: 'c', content: 'Contents'}, {id: 'd', content: 'Design'}, {id: 'p', content: 'Placing'}]} selected={selectedTab} onSelect={handleTabChange} fitted /></div>
                
                {/* CONTENTS TAB */}
                {selectedTab === 0 && (
                  <BlockStack gap="400">
                    <Card>
                      <Box padding="400">
                        <BlockStack gap="200">
                          <Text variant="headingSm" as="h2">Bar Name*</Text>
                          <TextField label="Bar name" labelHidden value={barName} onChange={setBarName} placeholder="e.g. Winter Sale (7th October 2025)" autoComplete="off" />
                        </BlockStack>
                      </Box>
                    </Card>
                    
                    <Card>
                      <Box padding="400">
                        <BlockStack gap="200">
                          <Text variant="headingSm" as="h2">Templates</Text>
                          <Select label="Template" labelHidden options={PREDEFINED_TEMPLATES.map(t => ({label: t.label, value: t.value}))} value={template} onChange={handleTemplateSelection} />
                        </BlockStack>
                      </Box>
                    </Card>
                    
                    <Card>
                      <Box padding="400">
                        <BlockStack gap="200">
                          <Text variant="headingSm" as="h2">Bar Type</Text>
                          <ChoiceList title="" choices={[{ label: 'Single Message', value: 'single' }, { label: 'Multiple Message', value: 'multiple' }, { label: 'Running Message', value: 'running' }]} selected={[barType]} onChange={(v) => setBarType(v[0])} />
                          
                          {barType === 'multiple' && (
                            <Box paddingBlockStart="400">
                              <Divider />
                              <Box paddingBlockStart="400">
                                <Text variant="headingSm" as="h3">Transition Settings</Text>
                                <BlockStack gap="300">
                                  <RadioButton label="Manual (Arrows Only)" checked={slideMode === 'manual'} id="slideManual" name="slideMode" onChange={() => setSlideMode('manual')} />
                                  <RadioButton label="Auto Slide" checked={slideMode === 'auto'} id="slideAuto" name="slideMode" onChange={() => setSlideMode('auto')} />
                                  {slideMode === 'auto' && (<RangeSlider label={`Slide Duration: ${slideDuration}s`} value={slideDuration} onChange={setSlideDuration} min={2} max={10} output />)}
                                </BlockStack>
                              </Box>
                            </Box>
                          )}
                        </BlockStack>
                      </Box>
                    </Card>

                    {/* Content List & Details */}
                    <Card>
                      <Box padding="400">
                        <BlockStack gap="400">
                          <InlineStack gap="200" wrap>
                            {contents.map((c, i) => (<Button key={c.id} onClick={() => handleChangeContent(i)} variant={i === activeIndex ? 'primary' : 'secondary'} size="slim">{c.label}</Button>))}
                            <Button onClick={addContent} variant="tertiary" size="slim">+ Add Content</Button>
                          </InlineStack>
                          <Divider />
                          {activeContent && (
                            <BlockStack gap="400">
                              <Text variant="headingMd" as="h2">{activeContent.label}</Text>
                              
                              <BlockStack gap="200">
                                <Text variant="bodySm" fontWeight="semibold" as="p">Template</Text>
                                <Select label="Template" labelHidden options={PREDEFINED_TEMPLATES.map(t => ({label: t.label, value: t.value}))} value={activeContent.template || 'none'} onChange={(val) => { updateContentField(activeIndex, 'template', val); const selected = PREDEFINED_TEMPLATES.find(t => t.value === val); if (selected && selected.data) { const data = selected.data; updateContentField(activeIndex, 'message', data.textSettings.message || activeContent.message); updateContentField(activeIndex, 'showButton', data.buttonSettings.isSelected); updateContentField(activeIndex, 'buttonText', data.buttonSettings.content || 'Click Here'); updateContentField(activeIndex, 'showCountdown', data.countdownSettings.isSelected); updateContentField(activeIndex, 'animationType', data.barDesignSettings.animation === 'fallingTop' ? 'slideDown' : 'none'); } }} />
                              </BlockStack>
                              
                              <BlockStack gap="200">
                                <TextField label="Message" value={activeContent.message} onChange={(val) => updateContentField(activeIndex, 'message', val)} autoComplete="off" multiline={1} />
                                <InlineStack gap="200">
                                  <Button icon={LinkIcon} size="slim" onClick={handleOpenLinkModal}>Link</Button>
                                  <Button icon={MagicIcon} size="slim">AI Message Generation</Button>
                                  <Button icon={LanguageIcon} size="slim">AI Translation</Button>
                                </InlineStack>
                              </BlockStack>
                              
                              <InlineGrid columns={2} gap="400">
                                <Select label="Animation" options={animationOptions} value={activeContent.animationType} onChange={(v) => updateContentField(activeIndex, 'animationType', v)} />
                              </InlineGrid>
                              
                              <Divider />
                              
                              <InlineGrid columns="1fr auto" alignItems="center">
                                <Text variant="bodyMd" fontWeight="bold" as="span">Button</Text>
                                <div onClick={() => updateContentField(activeIndex, 'showButton', !activeContent.showButton)} style={{ width: '40px', height: '20px', background: activeContent.showButton ? '#108043' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}><div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: activeContent.showButton ? '22px' : '2px', transition: '0.25s' }} /></div>
                              </InlineGrid>
                              <Collapsible open={activeContent.showButton} id="button-settings">
                                <BlockStack gap="400">
                                  <InlineGrid columns={2} gap="400">
                                    <TextField label="Button Text" value={activeContent.buttonText} onChange={(v) => updateContentField(activeIndex, 'buttonText', v)} autoComplete="off" />
                                    <TextField label="URL" value={activeContent.buttonUrl} onChange={(v) => updateContentField(activeIndex, 'buttonUrl', v)} autoComplete="off" />
                                  </InlineGrid>
                                  <Button plain size="slim" onClick={() => updateContentField(activeIndex, 'showButtonAdvance', !activeContent.showButtonAdvance)}>+ Advance Settings</Button>
                                  <Collapsible open={activeContent.showButtonAdvance} id={`button-advance-${activeIndex}`}>
                                    <BlockStack gap="400">
                                      <InlineGrid columns={2} gap="400">
                                        <ColorPickerButton label="Button Background" color={activeContent.btnBgColor} onChange={(c) => updateContentField(activeIndex, 'btnBgColor', c)} />
                                        <ColorPickerButton label="Button Text Color" color={activeContent.btnTextColor} onChange={(c) => updateContentField(activeIndex, 'btnTextColor', c)} />
                                      </InlineGrid>
                                      <BlockStack gap="200">
                                        <Text variant="bodySm" as="p">Button Radius</Text>
                                        <TextField label="Button Radius" labelHidden type="number" value={activeContent.buttonRadius || '5'} onChange={(v) => updateContentField(activeIndex, 'buttonRadius', v)} autoComplete="off" suffix="px" />
                                      </BlockStack>
                                    </BlockStack>
                                  </Collapsible>
                                </BlockStack>
                              </Collapsible>
                              
                              <Divider />
                              
                              <InlineGrid columns="1fr auto" alignItems="center">
                                <Text variant="bodyMd" fontWeight="bold" as="span">Countdown</Text>
                                <div onClick={() => updateContentField(activeIndex, 'showCountdown', !activeContent.showCountdown)} style={{ width: '40px', height: '20px', background: activeContent.showCountdown ? '#108043' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}><div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: activeContent.showCountdown ? '22px' : '2px', transition: '0.25s' }} /></div>
                              </InlineGrid>
                              <Collapsible open={activeContent.showCountdown} id="countdown-settings">
                                <BlockStack gap="400">
                                  <BlockStack gap="200">
                                    <Text variant="bodySm" as="p">Target Date</Text>
                                    <TextField label="Target Date" type="date" value={activeContent.targetDate} onChange={(v) => updateContentField(activeIndex, 'targetDate', v)} autoComplete="off" labelHidden />
                                  </BlockStack>
                                  <BlockStack gap="200">
                                    <Text variant="bodySm" as="p">Target Time</Text>
                                    <InlineStack gap="200" blockAlign="center">
                                      <div style={{ width: '70px' }}><TextField label="Hour" value={activeContent.targetTimeH} onChange={(v) => updateContentField(activeIndex, 'targetTimeH', v)} autoComplete="off" labelHidden placeholder="10" /></div>
                                      <div style={{ width: '70px' }}><TextField label="Minute" value={activeContent.targetTimeM} onChange={(v) => updateContentField(activeIndex, 'targetTimeM', v)} autoComplete="off" labelHidden placeholder="21" /></div>
                                      <div style={{ width: '80px' }}><Select label="AM / PM" options={[{ label: 'AM', value: 'AM' }, { label: 'PM', value: 'PM' }]} value={activeContent.targetTimeAmPm} onChange={(v) => updateContentField(activeIndex, 'targetTimeAmPm', v)} labelHidden /></div>
                                    </InlineStack>
                                  </BlockStack>
                                  <Button plain size="slim" onClick={() => updateContentField(activeIndex, 'showCountdownAdvance', !activeContent.showCountdownAdvance)}>+ Advance Settings</Button>
                                  <Collapsible open={activeContent.showCountdownAdvance} id={`countdown-advance-${activeIndex}`}>
                                    <BlockStack gap="400">
                                      <InlineGrid columns={2} gap="400">
                                        <Checkbox label="Show days" checked={activeContent.countdownShowDays} onChange={(val) => updateContentField(activeIndex, 'countdownShowDays', val)} />
                                        <Checkbox label="Show labels" checked={activeContent.countdownShowLabels} onChange={(val) => updateContentField(activeIndex, 'countdownShowLabels', val)} />
                                      </InlineGrid>
                                      <InlineGrid columns={2} gap="400">
                                        <ColorPickerButton label="Countdown Background" color={activeContent.countdownBgColor || '#FA4150'} onChange={(c) => updateContentField(activeIndex, 'countdownBgColor', c)} />
                                        <ColorPickerButton label="Countdown Text Color" color={activeContent.countdownTextColor || '#FFFFFF'} onChange={(c) => updateContentField(activeIndex, 'countdownTextColor', c)} />
                                      </InlineGrid>
                                    </BlockStack>
                                  </Collapsible>
                                </BlockStack>
                              </Collapsible>
                              
                              <Divider />
                              {contents.length > 1 && (<Box paddingBlockStart="300"><Button tone="critical" onClick={() => removeContent(activeIndex)}>Remove this content</Button></Box>)}
                            </BlockStack>
                          )}
                        </BlockStack>
                      </Box>
                    </Card>
                    <Box paddingBlockStart="200">
                      <Button fullWidth onClick={() => handleTabChange(1)}>Step 2: Design</Button>
                    </Box>
                  </BlockStack>
                )}

                {/* DESIGN & PLACING TABS (Same as before) */}
                {selectedTab === 1 && (
                  <BlockStack gap="400">
                    <Card>
                      <Box padding="400">
                        <BlockStack gap="300">
                          <Text variant="headingSm" as="h2">Typography</Text>
                          <BlockStack gap="200"><Select label="Current Font Name Here*" options={[{ label: 'Inter', value: 'inter' }, { label: 'Poppins', value: 'poppins' }, { label: 'Roboto', value: 'roboto' }, { label: 'Open Sans', value: 'openSans' }, { label: 'Montserrat', value: 'montserrat' }, { label: 'System Default', value: 'system' }]} value={fontFamily} onChange={setFontFamily} /></BlockStack>
                          <InlineGrid columns="1fr 1fr auto" gap="400" alignItems="end">
                            <ColorPickerButton label="Font Color" color={fontColor} onChange={setFontColor} />
                            <Select label="Font Size" options={[{ label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }]} value={fontSize} onChange={setFontSize} />
                            <BlockStack gap="100"><Text variant="bodyMd" as="span">Bold</Text><div onClick={() => setIsBold((b) => !b)} style={{ width: '40px', height: '22px', background: isBold ? '#108043' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s', marginTop: '4px' }}><div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isBold ? '20px' : '2px', transition: '0.25s' }} /></div></BlockStack>
                          </InlineGrid>
                        </BlockStack>
                      </Box>
                    </Card>
                    <Card>
                      <Box padding="400">
                        <BlockStack gap="400">
                          <Text variant="headingSm" as="h2">Bar Design</Text>
                          <InlineStack align="space-between">
                              <BlockStack gap="200"><Text variant="bodyMd" as="p">Background Type</Text><InlineStack gap="300"><RadioButton label="Solid" checked={backgroundType === 'solid'} id="bgSolid" name="backgroundType" onChange={() => setBackgroundType('solid')} /><RadioButton label="Gradient" checked={backgroundType === 'gradient'} id="bgGradient" name="backgroundType" onChange={() => setBackgroundType('gradient')} /></InlineStack></BlockStack>
                              {backgroundType === 'solid' && (<ColorPickerButton label="Bar Background Color" color={barBgColor} onChange={setBarBgColor} />)}
                          </InlineStack>
                          {backgroundType === 'gradient' && (
                            <BlockStack gap="300"><Text variant="bodyMd" as="span">Gradient Angle</Text><InlineStack gap="400" align="start" blockAlign="center"><div style={{flex: 1}}><RangeSlider label="Gradient Angle" labelHidden min={0} max={360} value={gradientAngle} onChange={setGradientAngle} output /></div><Text as="span">{gradientAngle}</Text></InlineStack><InlineGrid columns={2} gap="400"><ColorPickerButton label="From" color={gradientColorFrom} onChange={setGradientColorFrom} /><ColorPickerButton label="To" color={gradientColorTo} onChange={setGradientColorTo} /></InlineGrid></BlockStack>
                          )}
                          <BlockStack gap="200"><Select label="Animation" options={animationOptions} value={contents[0]?.animationType || 'bounce'} onChange={handleDesignAnimationChange} /></BlockStack>
                          <InlineStack align="space-between" blockAlign="end">
                              <BlockStack gap="200"><Text variant="bodyMd" as="span">Bar Position</Text><div style={{ width: '200px', borderRadius: '8px', background: '#f1f1f1', display: 'flex', overflow: 'visible', border: '1px solid #dcdcdc' }}><button type="button" onClick={() => setBarPosition('top')} style={{ flex: 1, padding: '8px 12px', border: 'none', background: barPosition === 'top' ? '#ffffff' : 'transparent', fontSize: '13px', cursor: 'pointer', fontWeight: barPosition === 'top' ? '600' : '400', boxShadow: barPosition === 'top' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Top</button><button type="button" onClick={() => setBarPosition('bottom')} style={{ flex: 1, padding: '8px 12px', border: 'none', background: barPosition === 'bottom' ? '#ffffff' : 'transparent', fontSize: '13px', cursor: 'pointer', fontWeight: barPosition === 'bottom' ? '600' : '400', boxShadow: barPosition === 'bottom' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Bottom</button></div></BlockStack>
                              <BlockStack gap="100" align="center"><Text variant="bodyMd" as="span">Sticky</Text><div onClick={() => setIsSticky((v) => !v)} style={{ width: '40px', height: '22px', background: isSticky ? '#108043' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s', marginTop: '4px' }}><div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isSticky ? '20px' : '2px', transition: '0.25s' }} /></div></BlockStack>
                          </InlineStack>
                        </BlockStack>
                      </Box>
                    </Card>
                    <Box paddingBlockStart="200"><Button fullWidth onClick={() => handleTabChange(2)}>Step 3: Placing</Button></Box>
                  </BlockStack>
                )}

                {selectedTab === 2 && (
                   <BlockStack gap="400">
                   <Card>
                     <Box padding="400">
                       <BlockStack gap="300">
                         <InlineGrid columns="1fr auto" alignItems="center"><Text variant="headingSm" as="h2">Scheduling</Text><div onClick={() => setSchedulingEnabled((v) => !v)} style={{ width: '40px', height: '20px', background: schedulingEnabled ? '#108043' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}><div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: schedulingEnabled ? '22px' : '2px', transition: '0.25s' }} /></div></InlineGrid>
                         <Collapsible open={schedulingEnabled}>
                           <BlockStack gap="400">
                             <BlockStack gap="200"><RadioButton label="Start Now" checked={startMode === 'now'} id="startNow" name="startMode" onChange={() => setStartMode('now')} /><RadioButton label="Start Target Date" checked={startMode === 'date'} id="startDate" name="startMode" onChange={() => setStartMode('date')} />{startMode === 'date' && (<Box paddingInlineStart="400"><InlineStack gap="200"><div style={{ flexGrow: 2 }}><TextField label="Date" type="date" value={startDate} onChange={setStartDate} labelHidden autoComplete="off" /></div><div style={{ flexGrow: 1 }}><TextField label="Hour" value={startHour} onChange={setStartHour} labelHidden autoComplete="off" placeholder="HH" /></div><div style={{ flexGrow: 1 }}><TextField label="Minute" value={startMinute} onChange={setStartMinute} labelHidden autoComplete="off" placeholder="MM" /></div><div style={{ flexGrow: 1 }}><Select label="AM/PM" options={[{ label: 'AM', value: 'AM' }, { label: 'PM', value: 'PM' }]} value={startAmPm} onChange={setStartAmPm} labelHidden /></div></InlineStack></Box>)}</BlockStack>
                             <Divider />
                             <BlockStack gap="200"><RadioButton label="Never Ends" checked={endMode === 'never'} id="endNever" name="endMode" onChange={() => setEndMode('never')} /><RadioButton label="End Target Date" checked={endMode === 'date'} id="endDate" name="endMode" onChange={() => setEndMode('date')} />{endMode === 'date' && (<Box paddingInlineStart="400"><InlineStack gap="200"><div style={{ flexGrow: 2 }}><TextField label="Date" type="date" value={endDate} onChange={setEndDate} labelHidden autoComplete="off" /></div><div style={{ flexGrow: 1 }}><TextField label="Hour" value={endHour} onChange={setEndHour} labelHidden autoComplete="off" placeholder="HH" /></div><div style={{ flexGrow: 1 }}><TextField label="Minute" value={endMinute} onChange={setEndMinute} labelHidden autoComplete="off" placeholder="MM" /></div><div style={{ flexGrow: 1 }}><Select label="AM/PM" options={[{ label: 'AM', value: 'AM' }, { label: 'PM', value: 'PM' }]} value={endAmPm} onChange={setEndAmPm} labelHidden /></div></InlineStack></Box>)}</BlockStack>
                           </BlockStack>
                         </Collapsible>
                       </BlockStack>
                     </Box>
                   </Card>
                   <Card><Box padding="400"><BlockStack gap="200"><Text variant="headingSm" as="h2">Devices</Text><Select label="" options={[{ label: 'All Devices', value: 'all' }, { label: 'Desktop only', value: 'desktop' }, { label: 'Mobile only', value: 'mobile' }]} value={deviceTarget} onChange={setDeviceTarget} /></BlockStack></Box></Card>
                   <Card><Box padding="400"><BlockStack gap="250"><Text variant="headingSm" as="h2">Pages</Text><ChoiceList title="" choices={[{ label: 'Entire Store', value: 'entire' }, { label: 'Specific Page', value: 'specific' }]} selected={[pageScope]} onChange={(v) => setPageScope(v[0])} />{pageScope === 'specific' && (<BlockStack gap="150"><Checkbox label="Page 1 Name" checked={page1} onChange={setPage1} /><Checkbox label="Cart" checked={pageCart} onChange={setPageCart} /><Checkbox label="Collection Name" checked={pageCollection} onChange={setPageCollection} /><Checkbox label="Checkout Page" checked={pageCheckout} onChange={setPageCheckout} /><Checkbox label="Page 2 Name" checked={page2} onChange={setPage2} /></BlockStack>)}</BlockStack></Box></Card>
                   <Card><Box padding="400"><BlockStack gap="250"><Text variant="headingSm" as="h2">Countries</Text><ChoiceList title="" choices={[{ label: 'No Country Specific', value: 'all' }, { label: 'Specific Countries', value: 'specific' }]} selected={[countryScope]} onChange={(v) => setCountryScope(v[0])} />{countryScope === 'specific' && (<Select label="" options={[{ label: 'Algeria', value: 'Algeria' }, { label: 'United States', value: 'United States' }, { label: 'Canada', value: 'Canada' }, { label: 'United Kingdom', value: 'United Kingdom' }, { label: 'Australia', value: 'Australia' }]} value={country} onChange={setCountry} />)}</BlockStack></Box></Card>
                   <Box paddingBlockStart="300"><Button primary fullWidth onClick={handlePublish}>Publish!</Button></Box>
                 </BlockStack>
                )}
              </div>

              {/* RIGHT - Preview */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <LegacyCard title="Real-time Preview" sectioned>
                  <BlockStack gap="400">
                    <InlineStack align="center" blockAlign="center">
                      <ButtonGroup segmented>
                        <Button pressed={previewMode === 'desktop'} icon={DesktopIcon} onClick={() => handleChangePreviewMode('desktop')}>Desktop</Button>
                        <Button pressed={previewMode === 'mobile'} icon={MobileIcon} onClick={() => handleChangePreviewMode('mobile')}>Mobile</Button>
                      </ButtonGroup>
                    </InlineStack>
                    
                    {isLoadingPreview ? (
                      <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text tone="subdued">Loading preview...</Text></div>
                    ) : (
                      <CleanPreviewContainer 
                        content={activeContent} 
                        viewMode={previewMode} 
                        barPosition={barPosition}
                        barBgColor={barBgColor} 
                        backgroundType={backgroundType} 
                        gradientColorFrom={gradientColorFrom} 
                        gradientColorTo={gradientColorTo} 
                        gradientAngle={gradientAngle} 
                        fontFamily={fontFamily} 
                        fontColor={fontColor} 
                        fontSize={fontSize} 
                        isBold={isBold}
                        hasMultipleContents={contents.length > 1}
                        currentIndex={activeIndex}
                        totalContents={contents.length}
                        onPrevContent={handlePrevContent}
                        onNextContent={handleNextContent}
                        slideMode={slideMode}
                        slideDuration={slideDuration}
                      />
                    )}

                    <BlockStack gap="200">
                      <Text variant="headingSm" as="h3">All contents preview</Text>
                      {contents.map((c, i) => (
                        <Box key={c.id} padding="300" borderColor={i === activeIndex ? 'border-strong' : 'border'} borderWidth="025" borderRadius="200" background="bg-surface" style={{ cursor: 'pointer' }} onClick={() => handleChangeContent(i)}>
                          <InlineStack align="space-between" blockAlign="center">
                            <Text variant="bodySm" fontWeight="bold">{c.label}</Text>
                            <Text tone="subdued" variant="bodySm">{c.showButton ? 'BTN ' : ''}{c.showCountdown ? 'Time' : ''}</Text>
                          </InlineStack>
                          <Text variant="bodySm" tone="subdued" truncate as="p">{c.message}</Text>
                        </Box>
                      ))}
                    </BlockStack>
                  </BlockStack>
                </LegacyCard>
              </div>
            </div>
          </Layout.Section>
        </Layout>
        
        {/* --- LINK BUILDER MODAL --- */}
        <Modal
          open={isLinkModalOpen}
          onClose={handleCloseLinkModal}
          title="Build a Link"
          primaryAction={{
            content: 'Insert Link',
            onAction: handleInsertLink,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleCloseLinkModal,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <TextField 
                label="Link Text" 
                value={tempLinkData.linkText} 
                onChange={(v) => setTempLinkData(p => ({...p, linkText: v}))} 
                autoComplete="off" 
              />
              <TextField 
                label="Link Address" 
                value={tempLinkData.linkUrl} 
                onChange={(v) => setTempLinkData(p => ({...p, linkUrl: v}))} 
                autoComplete="off" 
              />
              <ColorPickerButton 
                label={`Link Color ${tempLinkData.linkColor}`}
                color={tempLinkData.linkColor} 
                onChange={(c) => setTempLinkData(p => ({...p, linkColor: c}))} 
              />
              <BlockStack gap="200">
                <Text as="p" fontWeight="bold">Link Style</Text>
                <BlockStack>
                  <RadioButton
                    label="With underline"
                    checked={tempLinkData.linkUnderline === true}
                    id="linkUnderlineYes"
                    name="linkStyle"
                    onChange={() => setTempLinkData(p => ({...p, linkUnderline: true}))}
                  />
                  <RadioButton
                    label="Without underline"
                    checked={tempLinkData.linkUnderline === false}
                    id="linkUnderlineNo"
                    name="linkStyle"
                    onChange={() => setTempLinkData(p => ({...p, linkUnderline: false}))}
                  />
                </BlockStack>
              </BlockStack>
              <BlockStack gap="200">
                <Text as="p" fontWeight="bold">Link Open</Text>
                <BlockStack>
                  <RadioButton
                    label="In a new tab"
                    checked={tempLinkData.linkNewTab === true}
                    id="linkTabNew"
                    name="linkOpen"
                    onChange={() => setTempLinkData(p => ({...p, linkNewTab: true}))}
                  />
                  <RadioButton
                    label="In the same tab"
                    checked={tempLinkData.linkNewTab === false}
                    id="linkTabSame"
                    name="linkOpen"
                    onChange={() => setTempLinkData(p => ({...p, linkNewTab: false}))}
                  />
                </BlockStack>
              </BlockStack>
            </BlockStack>
          </Modal.Section>
        </Modal>

      </Page>
    </>
  );
}

export default CreateBarPage;