import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Page, Layout, Card, TextField, Tabs, Select, ChoiceList, BlockStack, InlineStack,
  Text, Button, Collapsible, Box, InlineGrid, Divider, Popover, ColorPicker, LegacyCard,
  ButtonGroup, Checkbox, RangeSlider, RadioButton, Modal, DatePicker, Icon, ActionList
} from '@shopify/polaris';
import { MagicIcon, LanguageIcon, LinkIcon, DesktopIcon, TabletIcon, MobileIcon, CalendarIcon, ChevronDownIcon } from '@shopify/polaris-icons';

// --- IMPORT TEMPLATES FROM DATA FOLDER ---
import { PREDEFINED_TEMPLATES } from '../data/barTemplates';
import { countdownTemplates } from '../data/countdownTemplates';

// -------- Constants ----------
const animationOptions = [
  { label: 'None', value: 'none' },
  { label: 'Bounce', value: 'bounce' },
  { label: 'Fade In', value: 'fade' },
  { label: 'Slide Down', value: 'slideDown' },
  { label: 'Slide Up', value: 'slideUp' },
  { label: 'Pulse', value: 'pulse' },
];

const countdownTemplateOptions = countdownTemplates.map(t => ({
  label: t.label,
  value: t.value
}));

const countryList = [
  'Andorra', 'United Arab Emirates', 'Afghanistan', 'Antigua and Barbuda', 'Anguilla', 'Albania', 'Armenia', 'Angola', 'Antarctica', 'Argentina', 'American Samoa', 'Austria', 'Australia', 'Aruba', 'Åland Islands', 'Azerbaijan', 'Bosnia and Herzegovina', 'Barbados', 'Bangladesh', 'Belgium', 'Burkina Faso', 'Bulgaria', 'Bahrain', 'Burundi', 'Benin', 'Saint Barthélemy', 'Bermuda', 'Brunei Darussalam', 'Bolivia', 'Bonaire, Sint Eustatius and Saba', 'Brazil', 'Bahamas', 'Bhutan', 'Bouvet Island', 'Botswana', 'Belarus', 'Belize', 'Canada', 'Cocos Islands', 'Congo', 'Central African Republic', 'Congo', 'Switzerland', "Côte d'Ivoire", 'Cook Islands', 'Chile', 'Cameroon', 'China', 'Colombia', 'Costa Rica', 'Cuba', 'Cabo Verde', 'Curaçao', 'Christmas Island', 'Cyprus', 'Czech Republic', 'Germany', 'Djibouti', 'Denmark', 'Dominica', 'Dominican Republic', 'Algeria', 'Ecuador', 'Estonia', 'Egypt', 'Western Sahara', 'Eritrea', 'Spain', 'Ethiopia', 'Finland', 'Fiji', 'Falkland Islands', 'Federated States of Micronesia', 'Faroe Islands', 'France', 'Gabon', 'United Kingdom of Great Britain and Northern Ireland', 'Grenada', 'Georgia', 'French Guiana', 'Guernsey', 'Ghana', 'Gibraltar', 'Greenland', 'Gambia', 'Guinea', 'Guadeloupe', 'Equatorial Guinea', 'Greece', 'South Georgia and the South Sandwich Islands', 'Guatemala', 'Guam', 'Guinea-Bissau', 'Guyana', 'Hong Kong', 'Heard Island and McDonald Islands', 'Honduras', 'Croatia', 'Haiti', 'Hungary', 'Indonesia', 'Ireland', 'Israel', 'Isle of Man', 'India', 'British Indian Ocean Territory', 'Iraq', 'Islamic Republic of Iran', 'Iceland', 'Italy', 'Jersey', 'Jamaica', 'Jordan', 'Japan', 'Kenya', 'Kyrgyzstan', 'Cambodia', 'Kiribati', 'Comoros', 'Saint Kitts and Nevis', "Democratic People's Republic of Korea", 'Republic of Korea', 'Kuwait', 'Cayman Islands', 'Kazakhstan', "Lao People's Democratic Republic", 'Lebanon', 'Saint Lucia', 'Liechtenstein', 'Sri Lanka', 'Liberia', 'Lesotho', 'Lithuania', 'Luxembourg', 'Latvia', 'Libya', 'Morocco', 'Monaco', 'Republic of Moldova', 'Montenegro', 'Saint Martin', 'Madagascar', 'Marshall Islands', 'Macedonia', 'Mali', 'Myanmar', 'Mongolia', 'Macao', 'Northern Mariana Islands', 'Martinique', 'Mauritania', 'Montserrat', 'Malta', 'Mauritius', 'Maldives', 'Malawi', 'Mexico', 'Malaysia', 'Mozambique', 'Namibia', 'New Caledonia', 'Niger', 'Norfolk Island', 'Nigeria', 'Nicaragua', 'Netherlands', 'Norway', 'Nepal', 'Nauru', 'Niue', 'New Zealand', 'Oman', 'Panama', 'Peru', 'French Polynesia', 'Papua New Guinea', 'Philippines', 'Pakistan', 'Poland', 'Saint Pierre and Miquelon', 'Pitcairn', 'Puerto Rico', 'State of Palestine', 'Portugal', 'Palau', 'Paraguay', 'Qatar', 'Réunion', 'Romania', 'Serbia', 'Russian Federation', 'Rwanda', 'Saudi Arabia', 'Solomon Islands', 'Seychelles', 'Sudan', 'Sweden', 'Singapore', 'Saint Helena, Ascension and Tristan da Cunha', 'Slovenia', 'Svalbard and Jan Mayen', 'Slovakia', 'Sierra Leone', 'San Marino', 'Senegal', 'Somalia', 'Suriname', 'South Sudan', 'Sao Tome and Principe', 'El Salvador', 'Sint Maarten', 'Syrian Arab Republic', 'Swaziland', 'Turks and Caicos Islands', 'Chad', 'French Southern Territories', 'Togo', 'Thailand', 'Tajikistan', 'Tokelau', 'Timor-Leste', 'Turkmenistan', 'Tunisia', 'Tonga', 'Turkey', 'Trinidad and Tobago', 'Tuvalu', 'Taiwan, Province of China', 'United Republic of Tanzania', 'Ukraine', 'Uganda', 'United States Minor Outlying Islands', 'United States of America', 'Uruguay', 'Uzbekistan', 'Holy See', 'Saint Vincent and the Grenadines', 'Venezuela (Bolivarian Republic of)', 'Virgin Islands', 'Virgin Islands of the United States', 'Viet Nam', 'Vanuatu', 'Wallis and Futuna', 'Samoa', 'Yemen', 'Mayotte', 'South Africa', 'Zambia', 'Zimbabwe'
];

// --- CSS STYLES ---
const stylesAndAnimations = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Poppins:wght@400;700&family=Roboto:wght@400;700&display=swap');

@keyframes flexibar-bounce { 
  0%, 100% { transform: translateY(0); } 
  50% { transform: translateY(-6px); } 
}
@keyframes flexibar-fadeIn { 
  0% { opacity: 0; transform: translateY(10px); } 
  100% { opacity: 1; transform: translateY(0); } 
}
@keyframes flexibar-slideDown { 
  0% { opacity: 0; transform: translateY(-20px); } 
  100% { opacity: 1; transform: translateY(0); } 
}
@keyframes flexibar-slideUp { 
  0% { opacity: 0; transform: translateY(20px); } 
  100% { opacity: 1; transform: translateY(0); } 
}
@keyframes flexibar-pulse { 
  0% { transform: scale(1); } 
  50% { transform: scale(1.05); } 
  100% { transform: scale(1); } 
}

@keyframes flexibar-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 12px)); }
}

.flexibar-announcement-bar {
  width: 100%;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  min-height: auto;
  height: auto;
  flex-wrap: nowrap; 
  overflow: hidden;
  position: relative;
  text-align: left;
}

.flexibar-announcement-bar.is-centered-text {
  justify-content: center;
}

.flexibar-announcement-bar.is-centered-text .flexibar-message-container {
  text-align: center;
}

.flexibar-announcement-bar.is-centered-text .flexibar-message {
  text-align: center;
}

.flexibar-announcement-bar.has-arrows {
  padding-left: 50px;
  padding-right: 50px;
}

.flexibar-announcement-bar.marquee-mode {
  justify-content: space-between;
  gap: 0;
  padding-right: 12px;
}

.flexibar-message-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-width: 0;
  mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
}

.flexibar-announcement-bar:not(.marquee-mode) .flexibar-message-container {
  mask-image: none;
  -webkit-mask-image: none;
  overflow: visible;
}

.flexibar-marquee-track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  animation: flexibar-scroll var(--marquee-duration, 25s) linear infinite;
  will-change: transform;
}

.flexibar-marquee-track:hover {
  animation-play-state: paused;
}

.flexibar-marquee-content {
  display: inline-flex;
  align-items: center;
  padding-left: 24px;
}

.flexibar-marquee-content:first-child {
  padding-left: 0;
}

.flexibar-marquee-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.5;
  margin: 0 24px;
  flex-shrink: 0;
}

.flexibar-message {
  display: inline-block;
  line-height: 1.4;
}

.flexibar-announcement-bar:not(.marquee-mode) .flexibar-message {
  white-space: normal;
  word-break: break-word;
  text-align: left;
}

.flexibar-announcement-bar.marquee-mode .flexibar-message {
  white-space: nowrap; 
}

@media (max-width: 900px) {
  .flexibar-announcement-bar:not(.marquee-mode) .flexibar-message {
    white-space: normal; 
    overflow: visible;
    text-overflow: clip;
  }
}

.flexibar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: nowrap;
  position: relative;
  z-index: 5;
  margin-left: auto;
}

.flexibar-announcement-bar.marquee-mode .flexibar-actions {
  padding-left: 16px;
  margin-left: 8px;
}

.flexibar-countdown-wrapper {
  display: flex;
  align-items: center;
}

.flexibar-button {
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.flexibar-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.flexibar-announcement-bar.is-mobile {
  padding: 10px 12px !important;
  gap: 8px !important;
  flex-direction: column !important; 
  align-items: center !important;
  justify-content: center !important;
  height: auto !important;
  min-height: auto !important;
  text-align: center !important;
}

.flexibar-announcement-bar.is-mobile.has-arrows {
  padding-left: 40px !important;
  padding-right: 40px !important;
}

.flexibar-announcement-bar.is-mobile.marquee-mode {
  flex-direction: column !important;
}

.flexibar-announcement-bar.is-mobile .flexibar-message-container {
  width: 100% !important;
  mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent) !important;
  -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent) !important;
}

.flexibar-announcement-bar.is-mobile:not(.marquee-mode) .flexibar-message-container {
  mask-image: none !important;
  -webkit-mask-image: none !important;
}

.flexibar-announcement-bar.is-mobile .flexibar-message {
  text-align: center !important;
  line-height: 1.4 !important;
}

.flexibar-announcement-bar.is-mobile:not(.marquee-mode) .flexibar-message {
  white-space: normal !important; 
  overflow: visible !important;
}

.flexibar-announcement-bar.is-mobile .flexibar-actions {
  width: auto !important;
  justify-content: center !important;
  gap: 8px !important;
  flex-wrap: nowrap !important;
  padding-left: 0 !important;
  margin-left: 0 !important;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .flexibar-announcement-bar:not(.is-mobile):not(.marquee-mode) {
    flex-direction: column;
    gap: 10px;
    padding: 12px 16px;
  }
    
  .flexibar-announcement-bar:not(.is-mobile):not(.marquee-mode) .flexibar-message {
    width: 100%;
    text-align: center;
    white-space: normal;
  }
    
  .flexibar-announcement-bar:not(.is-mobile):not(.marquee-mode) .flexibar-actions {
    width: 100%;
    justify-content: center;
  }
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
    case 'bounce': return 'flexibar-bounce 1.5s ease-in-out infinite';
    case 'fade': return 'flexibar-fadeIn 0.8s ease-out forwards';
    case 'slideDown': return 'flexibar-slideDown 0.6s ease-out forwards';
    case 'slideUp': return 'flexibar-slideUp 0.6s ease-out forwards';
    case 'pulse': return 'flexibar-pulse 2s ease-in-out infinite';
    default: return 'none';
  }
}

function getFontFamilyString(font) {
  const map = {
    'inter': "'Inter', sans-serif",
    'poppins': "'Poppins', sans-serif",
    'roboto': "'Roboto', sans-serif",
    'openSans': "'Open Sans', sans-serif",
    'montserrat': "'Montserrat', sans-serif",
    'system': "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
  };
  return map[font] || "'Inter', sans-serif";
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

function getStringAsDate(dateString) {
  if (!dateString) return new Date();
  const parts = dateString.split('-');
  if (parts.length !== 3) return new Date();
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
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

function renderCountdownHtml(templateHtml, data) {
  if (!templateHtml) return '';
  return templateHtml.replace(/{{(\w+)}}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

// *** CHANGE 1: Added isMessageDirty to empty content ***
function createEmptyContent(index) {
  return {
    id: `${Date.now()}-${index}`,
    label: `Content ${index}`,
    message: 'NEW COLLECTION LAUNCHED. 20% Flat Discount.',
    isMessageDirty: false, // NEW: track if user manually edited
    showButton: true,
    buttonText: 'Shop Now',
    buttonUrl: '',
    btnBgColor: '#FA4150',
    btnTextColor: '#FFFFFF',
    buttonAnimation: 'none',
    showCountdown: false,
    targetDate: '2025-10-21',
    targetTimeH: '10',
    targetTimeM: '21',
    targetTimeAmPm: 'PM',
    template: 'none',
    animationType: 'none',
    countdownShowDays: true,
    countdownShowLabels: true,
    showButtonAdvance: false,
    showCountdownAdvance: false,
    buttonRadius: '5',
    countdownBgColor: '#FA4150',
    countdownTextColor: '#FFFFFF',
    countdownTemplate: 'template1',
    hasLink: false,
    linkText: 'Click Here',
    linkUrl: 'https://example.com',
    linkColor: '#D56767',
    linkUnderline: true,
    linkNewTab: true
  };
}

// -------- Components ----------

const CustomSelect = ({ label, options, value, onChange }) => {
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((prev) => !prev), []);
  
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <BlockStack gap="100">
      <Text variant="bodyMd" as="span">{label}</Text>
      <Popover
        active={active}
        activator={
          <div onClick={toggleActive} style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '8px', 
            border: '1px solid #dcdcdc', 
            padding: '6px 12px', 
            borderRadius: '8px', 
            background: '#fff', 
            minWidth: '100px',
            minHeight: '38px' 
          }}>
            <Text as="span" variant="bodyMd">{selectedLabel}</Text>
            <div style={{opacity: 0.6, display: 'flex'}}><Icon source={ChevronDownIcon} tone="base" /></div>
          </div>
        }
        onClose={toggleActive}
      >
        <ActionList
          items={options.map(opt => ({
            content: opt.label,
            onAction: () => { onChange(opt.value); setActive(false); },
            active: opt.value === value
          }))}
        />
      </Popover>
    </BlockStack>
  );
};

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

const MessageItem = ({ content }) => {
  return (
    <span className="flexibar-message">
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
            cursor: 'pointer',
            fontSize: 'inherit',
            fontWeight: 'inherit'
          }}
        >
          {content.linkText}
        </a>
      )}
    </span>
  );
};

const TheBar = ({ 
  content, 
  contents,
  barBgColor, 
  backgroundType, 
  gradientColorFrom, 
  gradientColorTo, 
  gradientAngle, 
  fontFamily, 
  fontColor, 
  fontSize, 
  isBold, 
  viewMode,
  isMarqueeMode = false,
  marqueeSpeed = 30,
  hasArrowNavigation = false
}) => {
  if (!content) return null;
  
  const [countdown, setCountdown] = useState(() => calculateCountdown(content));
  const marqueeTrackRef = useRef(null);
  const containerRef = useRef(null);
  const [marqueeDuration, setMarqueeDuration] = useState(marqueeSpeed);

  useEffect(() => {
    if (!content.showCountdown) return;
    const interval = setInterval(() => { setCountdown(calculateCountdown(content)); }, 1000);
    return () => clearInterval(interval);
  }, [content.showCountdown, content.targetDate, content.targetTimeH, content.targetTimeM, content.targetTimeAmPm]);

  useEffect(() => {
    if (isMarqueeMode && marqueeTrackRef.current && containerRef.current) {
      const timer = setTimeout(() => {
        const trackWidth = marqueeTrackRef.current.scrollWidth;
        const pixelsPerSecond = 60;
        const duration = Math.max(10, (trackWidth / 2) / pixelsPerSecond);
        setMarqueeDuration(duration);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMarqueeMode, contents]);

  let backgroundStyle = barBgColor;
  if (backgroundType === 'gradient') {
    backgroundStyle = `linear-gradient(${gradientAngle}deg, ${gradientColorFrom}, ${gradientColorTo})`;
  }

  const fontFamilyValue = getFontFamilyString(fontFamily);

  const mobileClass = viewMode === 'mobile' ? 'is-mobile' : '';
  const marqueeClass = isMarqueeMode ? 'marquee-mode' : '';
  const arrowClass = hasArrowNavigation ? 'has-arrows' : '';

  const globalFontSize = fontSize === 'small' ? '13px' : fontSize === 'large' ? '17px' : '15px';
  const numericFontSize = fontSize === 'small' ? 13 : fontSize === 'large' ? 17 : 15;
  const globalFontWeight = isBold ? 700 : 400;

  const selectedTemplateObj = countdownTemplates.find(t => t.value === content.countdownTemplate) || countdownTemplates[0];
    
  const templateData = {
      name: content.id,
      days: countdown.days,
      hours: countdown.hours,
      minutes: countdown.minutes,
      seconds: countdown.seconds,
      color: content.countdownTextColor || '#FFFFFF',
      background: content.countdownBgColor || '#FA4150',
      fontFamily: fontFamilyValue,
      fontSize: numericFontSize,
      fontWeight: globalFontWeight,
      shadow: 'rgba(0,0,0,0.15)'
  };

  const renderedCountdownHtml = renderCountdownHtml(selectedTemplateObj.html, templateData);
  const hasActions = content.showCountdown || content.showButton;
  const centerClass = !hasActions && !isMarqueeMode ? 'is-centered-text' : '';

  const renderMarqueeContent = () => {
    const items = [];
    contents.forEach((c, index) => {
      items.push(
        <span key={`msg-${c.id}`} className="flexibar-message">
          {c.message}
          {c.hasLink && (
            <a 
              href={c.linkUrl} 
              target={c.linkNewTab ? '_blank' : '_self'}
              rel="noreferrer"
              style={{ 
                color: c.linkColor, 
                textDecoration: c.linkUnderline ? 'underline' : 'none',
                marginLeft: '6px',
                cursor: 'pointer'
              }}
            >
              {c.linkText}
            </a>
          )}
        </span>
      );
      items.push(<span key={`dot-${c.id}`} className="flexibar-marquee-dot" />);
    });
    return items;
  };

  return (
    <div 
      className={`flexibar-announcement-bar ${mobileClass} ${marqueeClass} ${arrowClass} ${centerClass}`}
      style={{ 
        background: backgroundStyle, 
        color: fontColor, 
        fontFamily: fontFamilyValue,
        fontWeight: globalFontWeight, 
        fontSize: globalFontSize,    
        animation: !isMarqueeMode ? getAnimationValue(content.animationType) : 'none',
        '--marquee-duration': `${marqueeDuration}s`
      }}
    >
      <div className="flexibar-message-container" ref={containerRef}>
        {isMarqueeMode ? (
          <div className="flexibar-marquee-track" ref={marqueeTrackRef}>
            <div className="flexibar-marquee-content">
              {renderMarqueeContent()}
            </div>
            <div className="flexibar-marquee-content">
              {renderMarqueeContent()}
            </div>
          </div>
        ) : (
          <MessageItem content={content} />
        )}
      </div>

      {hasActions && (
        <div className="flexibar-actions">
          {content.showCountdown && (
            <div 
               className="flexibar-countdown-wrapper"
               dangerouslySetInnerHTML={{ __html: renderedCountdownHtml }}
            />
          )}
          {content.showButton && (
            <button 
              className="flexibar-button"
              style={{ 
                backgroundColor: content.btnBgColor, 
                borderRadius: `${content.buttonRadius || 5}px`,
                color: content.btnTextColor,
                fontSize: globalFontSize,
                fontWeight: globalFontWeight,
                animation: getAnimationValue(content.buttonAnimation)
              }}
            >
              {content.buttonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// --- CLEAN PREVIEW CONTAINER ---
const CleanPreviewContainer = ({
content, 
  contents,
  viewMode, 
  barPosition = 'top', 
  barBgColor, 
  backgroundType, 
  gradientColorFrom, 
  gradientColorTo, 
  gradientAngle, 
  fontFamily, 
  fontColor, 
  fontSize, 
  isBold, 
  onPrevContent, 
  onNextContent, 
  hasMultipleContents, 
  currentIndex, 
  totalContents, 
  slideMode, 
  slideDuration,
  barType,
  showSliderArrows = true

}) => {
  const isMobile = viewMode === 'mobile';
  const isTablet = viewMode === 'tablet';
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  const [displayContent, setDisplayContent] = useState(content);

  const isMarqueeMode = barType === 'running';
  const isSliderActive = barType === 'multiple' && hasMultipleContents;

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayContent(content);
    }
  }, [content, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning || isMarqueeMode) return;
    setSlideDirection('next');
    setIsTransitioning(true);
    setTimeout(() => {
      onNextContent(); 
      setSlideDirection('');
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, onNextContent, isMarqueeMode]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || isMarqueeMode) return;
    setSlideDirection('prev');
    setIsTransitioning(true);
    setTimeout(() => {
      onPrevContent();
      setSlideDirection('');
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, onPrevContent, isMarqueeMode]);

  useEffect(() => {
    let interval;
    if (isSliderActive && !isTransitioning) {
      interval = setInterval(() => {
        handleNext();
      }, slideDuration * 1000);
    }
    return () => clearInterval(interval);
  }, [isSliderActive, slideDuration, handleNext, isTransitioning, currentIndex]);

  const isStaticMode = isMarqueeMode || barType === 'single' || (barType === 'multiple' && !hasMultipleContents);

  const slideStyle = {
    position: isStaticMode ? 'relative' : 'absolute',
    width: '100%',
    left: 0,
    top: 0,
    transition: isStaticMode ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
    opacity: isStaticMode ? 1 : (isTransitioning ? 0 : 1),
    transform: isStaticMode ? 'none' : (isTransitioning 
      ? (slideDirection === 'prev' ? 'translateX(20%)' : 'translateX(-20%)') 
      : 'translateX(0)'),
  };

  const showNavArrows = isSliderActive && showSliderArrows;

  const barProps = {
    barBgColor,
    backgroundType,
    gradientColorFrom,
    gradientColorTo,
    gradientAngle,
    fontFamily,
    fontColor,
    fontSize,
    isBold,
    viewMode,
    contents,
    hasArrowNavigation: showNavArrows
  };

  const renderBar = () => (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      background: '#fff', 
      overflow: 'visible',
      minHeight: 'auto'
    }}>
      {showNavArrows && (
        <button
          onClick={handlePrev}
          disabled={isTransitioning}
          style={{
            position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
            width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0,0,0,0.1)', cursor: isTransitioning ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F2937',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 100, opacity: isTransitioning ? 0.5 : 1,
            fontSize: '14px', lineHeight: 1
          }}
        >‹</button>
      )}
      
      <div style={{ 
        flex: 1, 
        overflow: 'hidden', 
        position: 'relative',
        minHeight: 'auto'
      }}>
        {isSliderActive ? (
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ visibility: 'hidden', position: 'relative' }}>
              <TheBar 
                content={displayContent} 
                {...barProps}
                isMarqueeMode={false}
              />
            </div>
            <div style={{
              ...slideStyle,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}>
              <TheBar 
                content={displayContent} 
                {...barProps}
                isMarqueeMode={false}
              />
            </div>
          </div>
        ) : (
          <div style={slideStyle}>
            <TheBar 
              content={displayContent} 
              {...barProps}
              isMarqueeMode={isMarqueeMode}
            />
          </div>
        )}
      </div>
      
      {showNavArrows && (
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0,0,0,0.1)', cursor: isTransitioning ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F2937',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 100, opacity: isTransitioning ? 0.5 : 1,
            fontSize: '14px', lineHeight: 1
          }}
        >›</button>
      )}
    </div>
  );
    
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
      <div style={{ 
        width: isMobile ? '375px' : (isTablet ? '768px' : '100%'),
        maxWidth: isMobile ? '375px' : (isTablet ? '768px' : '100%'),
        background: '#FFFFFF', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
        border: '1px solid #E5E7EB', 
        borderRadius: (isMobile || isTablet) ? '16px' : '8px', 
        overflow: 'hidden', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        {barPosition === 'top' && renderBar()}
        <EcommerceSkeleton mode={viewMode} />
        {barPosition === 'bottom' && renderBar()}
        
        {showNavArrows && (
          <div style={{
            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '6px', padding: '6px 10px',
            background: 'rgba(255, 255, 255, 0.95)', borderRadius: '100px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50
          }}>
            {Array.from({ length: totalContents }).map((_, idx) => (
              <div key={idx} style={{
                width: idx === currentIndex ? '20px' : '6px', height: '6px', borderRadius: '3px',
                background: idx === currentIndex ? '#1F2937' : '#D1D5DB',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }} />
            ))}
          </div>
        )}

        {isMarqueeMode && (
          <div style={{
            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            padding: '6px 14px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '100px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50,
            fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span style={{ 
              display: 'inline-block', width: '8px', height: '8px', 
              background: '#10B981', borderRadius: '50%',
              animation: 'flexibar-pulse 2s ease-in-out infinite'
            }}></span >
            Marquee • {totalContents} messages
          </div>
        )}
      </div>
    </div>
  );
};
// -------- Main Component ----------
function CreateBarPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [barName, setBarName] = useState('Winter Sale (17th October 2025)');
  const [template, setTemplate] = useState('none');
  const [barType, setBarType] = useState('single');
  const [contents, setContents] = useState([createEmptyContent(1)]);
  const [activeIndex, setActiveIndex] = useState(0); // For Editor
  const [previewIndex, setPreviewIndex] = useState(0); // For Preview Slider
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateMonth, setSelectedDateMonth] = useState(new Date().getMonth());
  const [selectedDateYear, setSelectedDateYear] = useState(new Date().getFullYear());

  const [schedulingEnabled, setSchedulingEnabled] = useState(true);
  const [startMode, setStartMode] = useState('now');
  const [startDate, setStartDate] = useState(new Date());
  const [{month: startMonth, year: startYear}, setStartMonthYear] = useState({month: new Date().getMonth(), year: new Date().getFullYear()});
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startHour, setStartHour] = useState('10');
  const [startMinute, setStartMinute] = useState('21');
  const [startAmPm, setStartAmPm] = useState('PM');

  const [endMode, setEndMode] = useState('never');
  const [endDate, setEndDate] = useState(new Date());
  const [{month: endMonth, year: endYear}, setEndMonthYear] = useState({month: new Date().getMonth(), year: new Date().getFullYear()});
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [endHour, setEndHour] = useState('10');
  const [endMinute, setEndMinute] = useState('21');
  const [endAmPm, setEndAmPm] = useState('PM');
    
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [tempLinkData, setTempLinkData] = useState({
      linkText: '', linkUrl: '', linkColor: '', linkUnderline: true, linkNewTab: true
  });

  const [slideMode, setSlideMode] = useState('auto');
  const [slideDuration, setSlideDuration] = useState(3);
  const [showSliderArrows, setShowSliderArrows] = useState(true);

  const [fontFamily, setFontFamily] = useState('inter');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState('small');
  const [isBold, setIsBold] = useState(false);
  const [backgroundType, setBackgroundType] = useState('solid');
  const [barBgColor, setBarBgColor] = useState('#4F46E5');
  const [gradientColorFrom, setGradientColorFrom] = useState('#F0A150');
  const [gradientColorTo, setGradientColorTo] = useState('#F87171');
  const [gradientAngle, setGradientAngle] = useState(32);
  const [barPosition, setBarPosition] = useState('top');
  const [isSticky, setIsSticky] = useState(true);

  const [deviceTarget, setDeviceTarget] = useState(['all', 'desktop', 'mobile', 'tablet']);
  
  const handleDeviceChange = (device, isChecked) => {
    setDeviceTarget(prev => {
      let nextState;
      if (isChecked) {
        nextState = [...prev, device];
        const hasDesktop = nextState.includes('desktop');
        const hasMobile = nextState.includes('mobile');
        const hasTablet = nextState.includes('tablet');
        if (hasDesktop && hasMobile && hasTablet && !nextState.includes('all')) {
          nextState.push('all');
        }
      } else {
        nextState = prev.filter(d => d !== device);
        nextState = nextState.filter(d => d !== 'all');
      }
      return [...new Set(nextState)];
    });
  };

  const handleAllDevicesChange = (isChecked) => {
    if (isChecked) {
      setDeviceTarget(['all', 'desktop', 'mobile', 'tablet']);
    } else {
      setDeviceTarget([]);
    }
  };

  const [pageScope, setPageScope] = useState('specific');
  const [pageCart, setPageCart] = useState(true);
  const [pageCollection, setPageCollection] = useState(true);
  const [pageCheckout, setPageCheckout] = useState(false);
  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(true);
  const [countryScope, setCountryScope] = useState('specific');
  const [selectedCountries, setSelectedCountries] = useState(['Algeria']);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [isCountryListVisible, setIsCountryListVisible] = useState(true);

  const formatDateDisplay = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleTabChange = useCallback((index) => setSelectedTab(index), []);

  // *** CHANGE 2: Updated updateContentField to set isMessageDirty flag ***
  const updateContentField = (index, field, value) => { 
    setContents((prev) => { 
      const copy = [...prev]; 
      if (field === 'message') {
        copy[index] = { ...copy[index], [field]: value, isMessageDirty: true }; 
      } else {
        copy[index] = { ...copy[index], [field]: value }; 
      }
      return copy; 
    }); 
  };

  const triggerPreviewLoading = () => { setIsLoadingPreview(true); setTimeout(() => setIsLoadingPreview(false), 400); };
    
  const handleChangeContent = (i) => { 
    setActiveIndex(i); 
    setPreviewIndex(i); 
    triggerPreviewLoading(); 
  };

  const addContent = () => { 
    const newIndex = contents.length;
    setContents(p => [...p, createEmptyContent(p.length + 1)]); 
    setActiveIndex(newIndex); 
    setPreviewIndex(newIndex);
    triggerPreviewLoading(); 
  };

  const removeContent = (index) => { 
    if(contents.length > 1) { 
      const u = [...contents]; 
      u.splice(index, 1); 
      const renumbered = u.map((content, idx) => ({ ...content, label: `Content ${idx + 1}` }));
      setContents(renumbered); 
      setActiveIndex(0); 
      setPreviewIndex(0);
      triggerPreviewLoading(); 
    }
  };

  const handleChangePreviewMode = (mode) => { setPreviewMode(mode); };
  const handleDesignAnimationChange = (val) => setContents(p => p.map(c => ({...c, animationType: val})));
    
  const handlePrevContent = () => {
    const newIndex = previewIndex === 0 ? contents.length - 1 : previewIndex - 1;
    setPreviewIndex(newIndex);
  };
    
  const handleNextContent = () => {
    const newIndex = previewIndex === contents.length - 1 ? 0 : previewIndex + 1;
    setPreviewIndex(newIndex);
  };

  const formatTimePayload = (h, m, ampm) => {
    let hour = parseInt(h || '0', 10);
    const minute = m || '00';
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const formatDatePayload = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getPositionPayload = () => {
    if (isSticky) return `sticky-${barPosition}`;
    return barPosition;
  };

  const handlePublish = useCallback(() => {
    setIsPublishing(true);
    const settingsPayload = {
      type: barType,
      fontFamily, fontColor, fontSize,
      barPosition: getPositionPayload(),
      barAnimation: contents[0]?.animationType || 'none',
      barBackgroundType: backgroundType,
      barBackgroundColor: barBgColor,
      barGradient: { angle: gradientAngle, color1: gradientColorFrom, color2: gradientColorTo },
      countdown: {
        selected_template: contents[0]?.countdownTemplate || 'template1',
        textColor: contents[0]?.countdownTextColor || '#ffffff',
        backgroundColor: contents[0]?.countdownBgColor || 'transparent',
        shadowColor: 'rgba(0,0,0,0.15)' 
      },
      button: {
        textColor: contents[0]?.btnTextColor || '#ffffff',
        backgroundColor: contents[0]?.btnBgColor || '#000000',
        borderRadius: parseInt(contents[0]?.buttonRadius || 5)
      }
    };

    const barsPayload = contents.map(content => {
      let messageHtml = content.message;
      if (content.hasLink) {
        const target = content.linkNewTab ? '_blank' : '_self';
        const underlineClass = content.linkUnderline ? 'link-style-underline' : '';
        messageHtml += ` <a href="${content.linkUrl}" class="${underlineClass}" style="color: ${content.linkColor}" target="${target}">${content.linkText}</a>`;
      }
      let isoTargetDate = null;
      if (content.targetDate) {
        const tDate = parseTargetDate(content);
        if (tDate) isoTargetDate = tDate.toISOString();
      }
      return {
        message: { title: messageHtml },
        button: { buttonEnabled: content.showButton, text: content.buttonText, url: content.buttonUrl, openWith: "_blank", animation: content.buttonAnimation },
        countdown: { countdownEnabled: content.showCountdown, targetDate: isoTargetDate }
      };
    });

    const placementPayload = {
      pages: pageScope === 'entire' ? ['all'] : [],
      keywords: "",
      countries: countryScope === 'all' ? [] : selectedCountries,
      targetedDevice: deviceTarget.includes('all') ? 'all' : deviceTarget
    };

    const finalPayload = {
      name: barName,
      settings: settingsPayload,
      bars: barsPayload,
      barMessageTranslations: [],
      placementSettings: placementPayload,
      isSchedule: schedulingEnabled,
      startDate: { date: formatDatePayload(startDate), time: formatTimePayload(startHour, startMinute, startAmPm), timeZone: null },
      endDate: { date: endMode === 'never' ? null : formatDatePayload(endDate), time: endMode === 'never' ? null : formatTimePayload(endHour, endMinute, endAmPm), timeZone: null }
    };

    console.log("Generated JSON for Backend:", JSON.stringify(finalPayload, null, 2));
    setTimeout(() => { setIsPublishing(false); console.log("Published Data Ready!"); }, 1000);
  }, [barName, barType, fontFamily, fontColor, fontSize, isSticky, barPosition, contents, backgroundType, barBgColor, gradientAngle, gradientColorFrom, gradientColorTo, pageScope, countryScope, selectedCountries, deviceTarget, schedulingEnabled, startDate, startHour, startMinute, startAmPm, endMode, endDate, endHour, endMinute, endAmPm]);

  const handleDiscard = useCallback(() => { console.log("Discard clicked"); }, []);

  const handleStartMonthChange = useCallback((month, year) => setStartMonthYear({month, year}), []);
  const handleStartDateSelection = useCallback(({end: newSelectedDate}) => { setStartDate(newSelectedDate); setShowStartDatePicker(false); }, []);
  const handleEndMonthChange = useCallback((month, year) => setEndMonthYear({month, year}), []);
  const handleEndDateSelection = useCallback(({end: newSelectedDate}) => { setEndDate(newSelectedDate); setShowEndDatePicker(false); }, []);

  const handleActivatorClick = (e, modeSetter, pickerSetter, targetMode) => {
    e.stopPropagation(); 
    modeSetter(targetMode);
    pickerSetter((prev) => !prev);
  };

  const toggleCountryListVisibility = useCallback(() => {
    setIsCountryListVisible((prev) => !prev);
  }, []);

  const activeContent = contents[activeIndex];
  const previewContent = contents[previewIndex];

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

  const handleCloseLinkModal = () => { setIsLinkModalOpen(false); };

  const handleInsertLink = () => {
      updateContentField(activeIndex, 'hasLink', true);
      updateContentField(activeIndex, 'linkText', tempLinkData.linkText);
      updateContentField(activeIndex, 'linkUrl', tempLinkData.linkUrl);
      updateContentField(activeIndex, 'linkColor', tempLinkData.linkColor);
      updateContentField(activeIndex, 'linkUnderline', tempLinkData.linkUnderline);
      updateContentField(activeIndex, 'linkNewTab', tempLinkData.linkNewTab);
      setIsLinkModalOpen(false);
  };

  // *** CHANGE 3: Updated handleTemplateSelection logic to respect dirty message ***
  const handleTemplateSelection = (val) => {
    setTemplate(val);
    const selected = PREDEFINED_TEMPLATES.find(t => t.value === val);
    if (!selected || !selected.data) return;
    const data = selected.data;

    setContents(prev => {
        const copy = [...prev];
        const currentContent = copy[activeIndex];

        // LOGIC: If user has manually edited, keep current. Otherwise use template default.
        const messageToUse = currentContent.isMessageDirty 
                             ? currentContent.message 
                             : (data.textSettings.message || currentContent.message);

        copy[activeIndex] = {
            ...currentContent,
            message: messageToUse,
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
      <style dangerouslySetInnerHTML={{ __html: stylesAndAnimations }} />
      <style>{`.Polaris-Page { padding-left: 24px !important; padding-right: 24px !important; max-width: 100% !important; } .Polaris-Layout__Section { max-width: 1200px !important; margin: 0 auto !important; }`}</style>
      <Page 
          backAction={{ content: 'Flexibar', onAction: () => console.log('Back clicked') }} 
          title={`Flexibar - ${barName || 'Bar Name'}`}
          subtitle="Create Bar" 
          compactTitle
          primaryAction={{ content: 'Save & Publish', onAction: handlePublish, loading: isPublishing, variant: 'primary' }}
          secondaryActions={[{ content: 'Discard', onAction: handleDiscard }]}
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
                    <Card><Box padding="300"><BlockStack gap="200"><Text variant="headingSm" as="h2">Bar Name*</Text><TextField label="Bar name" labelHidden value={barName} onChange={setBarName}  autoComplete="off" helpText="This will be visible to you only" /></BlockStack></Box></Card>
                      
                    <Card><Box padding="300"><BlockStack gap="200"><Text variant="headingSm" as="h2">Templates</Text><Select label="Template" labelHidden options={[{label: 'Select a template', value: 'none'}, ...PREDEFINED_TEMPLATES.map(t => ({label: t.label, value: t.value}))]} value={template} onChange={handleTemplateSelection} /></BlockStack></Box></Card>
                      
                    <Card>
                      <Box padding="300">
                        <BlockStack gap="200">
                          <Text variant="headingSm" as="h2">Bar Type</Text>
                          <ChoiceList title="" choices={[{ label: 'Single Message', value: 'single' }, { label: 'Multiple Message (Slider)', value: 'multiple' }, { label: 'Running Message (Marquee)', value: 'running' }]} selected={[barType]} onChange={(v) => {
                            const newType = v[0];
                            setBarType(newType);
                            if (newType === 'single' && contents.length > 1) {
                              setContents([contents[0]]);
                              setActiveIndex(0);
                              setPreviewIndex(0); 
                            }
                          }} />
                            
                          {barType === 'multiple' && (
                            <Box paddingBlockStart="300">
                              <Divider />
                              <Box paddingBlockStart="300">
                                <BlockStack gap="300">
                                  <Text variant="headingSm" as="h3">Slider Settings</Text>
                                  <RangeSlider 
                                    label={`Auto-slide Duration: ${slideDuration}s`} 
                                    value={slideDuration} 
                                    onChange={setSlideDuration} 
                                    min={2} 
                                    max={10} 
                                    output 
                                  />

                                  <InlineGrid columns="1fr auto" alignItems="center">
                                    <Text variant="bodyMd" as="span">Show Slider Arrows</Text>
                                    <div
                                      onClick={() => setShowSliderArrows(v => !v)}
                                      style={{
                                        width: '42px',
                                        height: '22px',
                                        background: showSliderArrows ? '#303030' : '#ccc',
                                        borderRadius: '999px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: '0.25s'
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '18px',
                                          height: '18px',
                                          background: '#fff',
                                          borderRadius: '50%',
                                          position: 'absolute',
                                          top: '2px',
                                          left: showSliderArrows ? '22px' : '2px',
                                          transition: '0.25s'
                                        }}
                                      />
                                    </div>
                                  </InlineGrid>
                                  <Text variant="bodySm" tone="subdued">
                                    Auto-slide will continue even when arrows are hidden.
                                  </Text>
                                  <Text variant="bodySm" as="p" tone="subdued">
                                    Slides will automatically change every {slideDuration} seconds. 
                                  </Text>
                                </BlockStack>
                              </Box>
                            </Box>
                          )}
                          
                          {barType === 'running' && contents.length > 1 && (
                            <Box paddingBlockStart="200">
                              <div style={{ padding: '10px 12px', background: '#EEF3FF', borderRadius: '8px', border: '1px solid #C9D4F5', fontSize: '13px', color: '#3B5998' }}>
                                💡 <strong>Marquee Mode:</strong> All {contents.length} messages will scroll continuously from right to left.
                              </div>
                            </Box>
                          )}
                        </BlockStack>
                      </Box>
                    </Card>

                    <Card>
                      <Box padding="300">
                        <BlockStack gap="400">
                          {barType !== 'single' && (
                            <>
                              <InlineStack gap="200" wrap>
                                {contents.map((c, i) => (
                                  <Button key={c.id} onClick={() => handleChangeContent(i)} variant={i === activeIndex ? 'primary' : 'secondary'} size="slim">{c.label}</Button>
                                ))}
                                <Button onClick={addContent} variant="tertiary" size="slim">+ Add Content</Button>
                              </InlineStack>
                              <Divider />
                            </>
                          )}
                          {activeContent && (
                            <BlockStack gap="400">
                              <Text variant="headingMd" as="h2">{activeContent.label}</Text>
                                
                              <BlockStack gap="200">
                                <TextField label="Message" value={activeContent.message} onChange={(val) => updateContentField(activeIndex, 'message', val)} autoComplete="off" multiline={4} helpText="Text will auto-expand as you type" />
                                <InlineStack gap="200">
                                  <Button icon={LinkIcon} size="slim" onClick={handleOpenLinkModal}>Link</Button>
                                  <Button icon={MagicIcon} size="slim">AI Message Generation</Button>
                                  <Button icon={LanguageIcon} size="slim">AI Translation</Button>
                                </InlineStack>
                              </BlockStack>
                                
                              <Divider />
                                
                              <InlineGrid columns="1fr auto" alignItems="center">
                                <Text variant="bodyMd" fontWeight="bold" as="span">Button</Text>
                                <div onClick={() => updateContentField(activeIndex, 'showButton', !activeContent.showButton)} style={{ width: '40px', height: '20px', background: activeContent.showButton ? '#303030' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}><div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: activeContent.showButton ? '22px' : '2px', transition: '0.25s' }} /></div>
                              </InlineGrid>
                              <Collapsible open={activeContent.showButton} id="button-settings">
                                <BlockStack gap="400">
                                  <InlineGrid columns={2} gap="400">
                                    <TextField label="Button Text" value={activeContent.buttonText} onChange={(v) => updateContentField(activeIndex, 'buttonText', v)} autoComplete="off" />
                                    <TextField label="URL" value={activeContent.buttonUrl} onChange={(v) => updateContentField(activeIndex, 'buttonUrl', v)} autoComplete="off" />
                                  </InlineGrid>
                                  <Button plain size="slim" onClick={() => updateContentField(activeIndex, 'showButtonAdvance', !activeContent.showButtonAdvance)}>
                                    {activeContent.showButtonAdvance ? '- Advance Settings' : '+ Advance Settings'}
                                  </Button>
                                  <Collapsible open={activeContent.showButtonAdvance} id={`button-advance-${activeIndex}`}>
                                    <BlockStack gap="400">
                                      <InlineGrid columns={2} gap="400">
                                        <ColorPickerButton label="Button Background" color={activeContent.btnBgColor} onChange={(c) => updateContentField(activeIndex, 'btnBgColor', c)} />
                                        <ColorPickerButton label="Button Text Color" color={activeContent.btnTextColor} onChange={(c) => updateContentField(activeIndex, 'btnTextColor', c)} />
                                      </InlineGrid>
                                      <InlineGrid columns={2} gap="400">
                                        <Select label="Animation" options={animationOptions} value={activeContent.buttonAnimation || 'none'} onChange={(v) => updateContentField(activeIndex, 'buttonAnimation', v)} />
                                        <TextField label="Button Radius" type="number" value={activeContent.buttonRadius || '5'} onChange={(v) => updateContentField(activeIndex, 'buttonRadius', v)} autoComplete="off" suffix="px" />
                                      </InlineGrid>
                                    </BlockStack>
                                  </Collapsible>
                                </BlockStack>
                              </Collapsible>
                                
                              <Divider />
                                
                              <InlineGrid columns="1fr auto" alignItems="center">
                                <Text variant="bodyMd" fontWeight="bold" as="span">Countdown</Text>
                                <div onClick={() => updateContentField(activeIndex, 'showCountdown', !activeContent.showCountdown)} style={{ width: '40px', height: '20px', background: activeContent.showCountdown ? '#303030' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}><div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: activeContent.showCountdown ? '22px' : '2px', transition: '0.25s' }} /></div>
                              </InlineGrid>
                              <Collapsible open={activeContent.showCountdown} id="countdown-settings">
                                <BlockStack gap="400">
                                  <InlineGrid columns={2} gap="400">
                                    <BlockStack gap="200">
                                      <Text variant="bodySm" as="p">Target Date</Text>
                                      <Popover active={showDatePicker} activator={<Button onClick={() => setShowDatePicker(!showDatePicker)} disclosure={showDatePicker ? 'up' : 'down'} fullWidth textAlign="left">{activeContent.targetDate || 'Select date'}</Button>} onClose={() => setShowDatePicker(false)}>
                                        <Box padding="400">
                                          <DatePicker month={selectedDateMonth} year={selectedDateYear} selected={getStringAsDate(activeContent.targetDate)} onChange={(date) => { const year = date.start.getFullYear(); const month = String(date.start.getMonth() + 1).padStart(2, '0'); const day = String(date.start.getDate()).padStart(2, '0'); updateContentField(activeIndex, 'targetDate', `${year}-${month}-${day}`); setShowDatePicker(false); }} onMonthChange={(month, year) => { setSelectedDateMonth(month); setSelectedDateYear(year); }} />
                                        </Box>
                                      </Popover>
                                    </BlockStack>
                                    <BlockStack gap="200">
                                      <Text variant="bodySm" as="p">Target Time</Text>
                                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'nowrap', width: '100%', maxWidth: '100%' }}>
                                        <div style={{ flex: '1 1 0', minWidth: '45px', maxWidth: '60px' }}><TextField label="Hour" value={activeContent.targetTimeH} onChange={(v) => updateContentField(activeIndex, 'targetTimeH', v)} autoComplete="off" labelHidden placeholder="10" /></div>
                                        <div style={{ flex: '1 1 0', minWidth: '45px', maxWidth: '60px' }}><TextField label="Minute" value={activeContent.targetTimeM} onChange={(v) => updateContentField(activeIndex, 'targetTimeM', v)} autoComplete="off" labelHidden placeholder="21" /></div>
                                        <div style={{ flex: '1 1 0', minWidth: '55px', maxWidth: '70px' }}><Select label="AM / PM" options={[{ label: 'AM', value: 'AM' }, { label: 'PM', value: 'PM' }]} value={activeContent.targetTimeAmPm} onChange={(v) => updateContentField(activeIndex, 'targetTimeAmPm', v)} labelHidden /></div>
                                      </div>
                                    </BlockStack>
                                  </InlineGrid>
                                  <Button plain size="slim" onClick={() => updateContentField(activeIndex, 'showCountdownAdvance', !activeContent.showCountdownAdvance)}>
                                    {activeContent.showCountdownAdvance ? '- Advance Settings' : '+ Advance Settings'}
                                  </Button>
                                  <Collapsible open={activeContent.showCountdownAdvance} id={`countdown-advance-${activeIndex}`}>
                                    <BlockStack gap="400">
                                      <InlineGrid columns={2} gap="400">
                                        <Checkbox label="Show days" checked={activeContent.countdownShowDays} onChange={(val) => updateContentField(activeIndex, 'countdownShowDays', val)} />
                                        <Checkbox label="Show labels" checked={activeContent.countdownShowLabels} onChange={(val) => updateContentField(activeIndex, 'countdownShowLabels', val)} />
                                      </InlineGrid>
                                      <Select label="Countdown Template" options={countdownTemplateOptions} value={activeContent.countdownTemplate || 'template1'} onChange={(v) => updateContentField(activeIndex, 'countdownTemplate', v)} />
                                      <InlineGrid columns={2} gap="400">
                                        <ColorPickerButton label="Countdown Background" color={activeContent.countdownBgColor || '#FA4150'} onChange={(c) => updateContentField(activeIndex, 'countdownBgColor', c)} />
                                        <ColorPickerButton label="Countdown Text Color" color={activeContent.countdownTextColor || '#FFFFFF'} onChange={(c) => updateContentField(activeIndex, 'countdownTextColor', c)} />
                                      </InlineGrid>
                                    </BlockStack>
                                  </Collapsible>
                                </BlockStack>
                              </Collapsible>
                                
                              <Divider />
                              {barType !== 'single' && contents.length > 1 && (<Box paddingBlockStart="300"><Button tone="critical" onClick={() => removeContent(activeIndex)}>Remove this content</Button></Box>)}
                            </BlockStack>
                          )}
                        </BlockStack>
                      </Box>
                    </Card>
                    <Box paddingBlockStart="200"><Button fullWidth onClick={() => handleTabChange(1)}>Step 2: Design</Button></Box>
                  </BlockStack>
                )}

                {/* DESIGN TAB */}
                {selectedTab === 1 && (
                  <BlockStack gap="400">
                    <Card>
                      <Box padding="300">
                        <BlockStack gap="300">
                          <Text variant="headingSm" as="h2">Typography</Text>
                          <CustomSelect label="Current Font Name Here*" options={[{ label: 'Inter', value: 'inter' }, { label: 'Poppins', value: 'poppins' }, { label: 'Roboto', value: 'roboto' }, { label: 'Open Sans', value: 'openSans' }, { label: 'Montserrat', value: 'montserrat' }, { label: 'System Default', value: 'system' }]} value={fontFamily} onChange={setFontFamily} />
                          <InlineGrid columns={3} gap="400">
                            <ColorPickerButton label="Font Color" color={fontColor} onChange={setFontColor} />
                            <CustomSelect label="Font Size" options={[{ label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }]} value={fontSize} onChange={setFontSize} />
                            <BlockStack gap="200">
                              <Text variant="bodyMd" as="span">Bold</Text>
                              <div onClick={() => setIsBold((b) => !b)} style={{ width: '40px', height: '22px', background: isBold ? '#303030' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}><div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isBold ? '20px' : '2px', transition: '0.25s' }} /></div>
                            </BlockStack>
                          </InlineGrid>
                        </BlockStack>
                      </Box>
                    </Card>
                    <Card>
                      <Box padding="300">
                        <BlockStack gap="400">
                          <Text variant="headingSm" as="h2">Bar Design</Text>
                          <BlockStack gap="200">
                            <Text variant="bodyMd" as="p">Background Type</Text>
                            <InlineStack gap="300">
                              <RadioButton label="Solid" checked={backgroundType === 'solid'} id="bgSolid" name="backgroundType" onChange={() => setBackgroundType('solid')} />
                              <RadioButton label="Gradient" checked={backgroundType === 'gradient'} id="bgGradient" name="backgroundType" onChange={() => setBackgroundType('gradient')} />
                            </InlineStack>
                          </BlockStack>
                          {backgroundType === 'solid' && <ColorPickerButton label="Bar Background Color" color={barBgColor} onChange={setBarBgColor} />}
                          {backgroundType === 'gradient' && (
                            <BlockStack gap="300">
                              <Text variant="bodyMd" as="span">Gradient Angle</Text>
                              <InlineStack gap="400" align="start" blockAlign="center">
                                <div style={{flex: 1}}><RangeSlider label="Gradient Angle" labelHidden min={0} max={360} value={gradientAngle} onChange={setGradientAngle} output /></div>
                                <Text as="span">{gradientAngle}</Text>
                              </InlineStack>
                              <InlineGrid columns={2} gap="400">
                                <ColorPickerButton label="From" color={gradientColorFrom} onChange={setGradientColorFrom} />
                                <ColorPickerButton label="To" color={gradientColorTo} onChange={setGradientColorTo} />
                              </InlineGrid>
                            </BlockStack>
                          )}
                          <Select label="Animation" options={animationOptions} value={contents[0]?.animationType || 'bounce'} onChange={handleDesignAnimationChange} />
                          
                          <BlockStack gap="200">
                            <Text variant="headingSm" as="h3">Bar Position</Text>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                              <div style={{ background: '#F1F2F4', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', flex: '1 1 auto', maxWidth: '300px' }}>
                                <button type="button" onClick={() => setBarPosition('top')} style={{ flex: 1, padding: '6px 16px', border: 'none', borderRadius: '6px', background: barPosition === 'top' ? '#FFFFFF' : 'transparent', color: barPosition === 'top' ? '#000000' : '#5C5F62', fontSize: '13px', cursor: 'pointer', fontWeight: barPosition === 'top' ? '600' : '500', boxShadow: barPosition === 'top' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s ease' }}>Top</button>
                                <button type="button" onClick={() => setBarPosition('bottom')} style={{ flex: 1, padding: '6px 16px', border: 'none', borderRadius: '6px', background: barPosition === 'bottom' ? '#FFFFFF' : 'transparent', color: barPosition === 'bottom' ? '#000000' : '#5C5F62', fontSize: '13px', cursor: 'pointer', fontWeight: barPosition === 'bottom' ? '600' : '500', boxShadow: barPosition === 'bottom' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s ease' }}>Bottom</button>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Text variant="bodyMd" as="span">Sticky</Text>
                                <div onClick={() => setIsSticky((v) => !v)} style={{ width: '40px', height: '22px', background: isSticky ? '#303030' : '#E4E5E7', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}>
                                  <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isSticky ? '20px' : '2px', transition: '0.25s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                                </div>
                              </div>
                            </div>
                          </BlockStack>
                        </BlockStack>
                      </Box>
                    </Card>
                    <Box paddingBlockStart="200"><Button fullWidth onClick={() => handleTabChange(2)}>Step 3: Placing</Button></Box>
                  </BlockStack>
                )}

                {/* PLACING TAB */}
                {selectedTab === 2 && (
                  <BlockStack gap="400">
                    <Card>
                      <Box padding="300">
                        <BlockStack gap="200">
                          <Text variant="headingSm" as="h2">Targeted Device</Text>
                          <Checkbox label="All Devices" checked={deviceTarget.includes('all')} onChange={handleAllDevicesChange} />
                          <Checkbox label="Desktop" checked={deviceTarget.includes('desktop')} onChange={(c) => handleDeviceChange('desktop', c)} />
                          <Checkbox label="Mobile" checked={deviceTarget.includes('mobile')} onChange={(c) => handleDeviceChange('mobile', c)} />
                          <Checkbox label="Tablet" checked={deviceTarget.includes('tablet')} onChange={(c) => handleDeviceChange('tablet', c)} />
                        </BlockStack>
                      </Box>
                    </Card>

                    <Card>
                      <Box padding="300">
                        <BlockStack gap="400">
                          <InlineGrid columns="1fr auto" alignItems="center">
                            <Text variant="headingSm" as="h2">Scheduling</Text>
                            <div onClick={() => setSchedulingEnabled((v) => !v)} style={{ width: '40px', height: '20px', background: schedulingEnabled ? '#303030' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.25s' }}><div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: schedulingEnabled ? '22px' : '2px', transition: '0.25s' }} /></div>
                          </InlineGrid>
                          <Collapsible open={schedulingEnabled}>
                            <InlineGrid columns={{xs: 1, sm: 2}} gap="400" alignItems="start">
                              <BlockStack gap="200">
                                <div onClick={() => setStartMode('now')} style={{cursor: 'pointer'}}>
                                  <BlockStack gap="200">
                                    <RadioButton label="Start Now" checked={startMode === 'now'} id="startNow" name="startMode" onChange={() => setStartMode('now')} />
                                    <Popover active={showStartDatePicker && startMode === 'date'} activator={<div onClick={(e) => handleActivatorClick(e, setStartMode, setShowStartDatePicker, 'date')} style={{ padding: '8px 12px', background: startMode === 'date' ? '#fff' : '#f1f1f1', border: '1px solid #dcdcdc', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: startMode === 'date' ? 1 : 0.6, color: startMode === 'date' ? 'inherit' : '#8c9196' }}><span>{formatDateDisplay(startDate)}</span>{startMode === 'date' && <Icon source={CalendarIcon} tone="base" />}</div>} onClose={() => setShowStartDatePicker(false)}>
                                      <div onClick={(e) => e.stopPropagation()}><Box padding="400"><DatePicker month={startMonth} year={startYear} onChange={handleStartDateSelection} onMonthChange={handleStartMonthChange} selected={startDate} /></Box></div>
                                    </Popover>
                                  </BlockStack>
                                </div>
                                <div onClick={() => setEndMode('never')} style={{cursor: 'pointer'}}>
                                  <BlockStack gap="200">
                                    <RadioButton label="Never Ends" checked={endMode === 'never'} id="endNever" name="endMode" onChange={() => setEndMode('never')} />
                                    <Popover active={showEndDatePicker && endMode === 'date'} activator={<div onClick={(e) => handleActivatorClick(e, setEndMode, setShowEndDatePicker, 'date')} style={{ padding: '8px 12px', background: endMode === 'date' ? '#fff' : '#f1f1f1', border: '1px solid #dcdcdc', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: endMode === 'date' ? 1 : 0.6, color: endMode === 'date' ? 'inherit' : '#8c9196' }}><span>{formatDateDisplay(endDate)}</span>{endMode === 'date' && <Icon source={CalendarIcon} tone="base" />}</div>} onClose={() => setShowEndDatePicker(false)}>
                                      <div onClick={(e) => e.stopPropagation()}><Box padding="400"><DatePicker month={endMonth} year={endYear} onChange={handleEndDateSelection} onMonthChange={handleEndMonthChange} selected={endDate} /></Box></div>
                                    </Popover>
                                  </BlockStack>
                                </div>
                              </BlockStack>
                              <BlockStack gap="200">
                                <div onClick={() => setStartMode('date')}>
                                  <BlockStack gap="200">
                                    <RadioButton label="Start Target Date" checked={startMode === 'date'} id="startDate" name="startMode" onChange={() => setStartMode('date')} />
                                    <div style={{ opacity: startMode === 'date' ? 1 : 0.4, pointerEvents: startMode === 'date' ? 'auto' : 'none' }}>
                                      <InlineGrid columns="1fr 1fr 1fr" gap="200">
                                        <TextField label="H" labelHidden value={startHour} onChange={setStartHour} autoComplete="off" placeholder="10" align="center" />
                                        <TextField label="M" labelHidden value={startMinute} onChange={setStartMinute} autoComplete="off" placeholder="21" align="center" />
                                        <Select label="Ap" labelHidden options={['AM','PM']} value={startAmPm} onChange={setStartAmPm} />
                                      </InlineGrid>
                                    </div>
                                  </BlockStack>
                                </div>
                                <div onClick={() => setEndMode('date')}>
                                  <BlockStack gap="200">
                                    <RadioButton label="End Target Date" checked={endMode === 'date'} id="endDate" name="endMode" onChange={() => setEndMode('date')} />
                                    <div style={{ opacity: endMode === 'date' ? 1 : 0.4, pointerEvents: endMode === 'date' ? 'auto' : 'none' }}>
                                      <InlineGrid columns="1fr 1fr 1fr" gap="200">
                                        <TextField label="H" labelHidden value={endHour} onChange={setEndHour} autoComplete="off" placeholder="10" align="center" />
                                        <TextField label="M" labelHidden value={endMinute} onChange={setEndMinute} autoComplete="off" placeholder="21" align="center" />
                                        <Select label="Ap" labelHidden options={['AM','PM']} value={endAmPm} onChange={setEndAmPm} />
                                      </InlineGrid>
                                    </div>
                                  </BlockStack>
                                </div>
                              </BlockStack>
                            </InlineGrid>
                          </Collapsible>
                        </BlockStack>
                      </Box>
                    </Card>
                    
                    <Card><Box padding="300"><BlockStack gap="250"><Text variant="headingSm" as="h2">Pages</Text><ChoiceList title="" choices={[{ label: 'Entire Store', value: 'entire' }, { label: 'Specific Page', value: 'specific' }]} selected={[pageScope]} onChange={(v) => setPageScope(v[0])} />{pageScope === 'specific' && (<Box paddingInlineStart="400"><BlockStack gap="150"><Checkbox label="Page 1 Name" checked={page1} onChange={setPage1} /><Checkbox label="Cart" checked={pageCart} onChange={setPageCart} /><Checkbox label="Collection Name" checked={pageCollection} onChange={setPageCollection} /><Checkbox label="Checkout Page" checked={pageCheckout} onChange={setPageCheckout} /><Checkbox label="Page 2 Name" checked={page2} onChange={setPage2} /></BlockStack></Box>)}</BlockStack></Box></Card>

                    <Card>
                      <Box padding="300">
                        <BlockStack gap="250">
                          <InlineStack align="space-between" blockAlign="center">
                            <Text variant="headingSm" as="h2">Countries</Text>
                            {countryScope === 'specific' && (
                              <Button plain onClick={toggleCountryListVisibility}>
                                {isCountryListVisible ? 'Hide' : 'Show'}
                              </Button>
                            )}
                          </InlineStack>
                          <Text variant="bodySm" as="p" tone="subdued">If no option is selected, this will be displayed on all countries by default.</Text>
                          <ChoiceList title="" choices={[{ label: 'No Country Specific', value: 'all' }, { label: 'Specific Countries', value: 'specific' }]} selected={[countryScope]} onChange={(v) => setCountryScope(v[0])} />
                          <Collapsible open={countryScope === 'specific' && isCountryListVisible} id="countries-collapsible">
                            <Box paddingBlockStart="300">
                              <BlockStack gap="300">
                                <InlineStack gap="200" align="space-between">
                                  <div style={{ flex: 1 }}>
                                    <TextField label="Search countries" labelHidden value={countrySearchQuery} onChange={setCountrySearchQuery} placeholder="Search countries..." autoComplete="off" clearButton onClearButtonClick={() => setCountrySearchQuery('')} />
                                  </div>
                                  <ButtonGroup>
                                    <Button size="slim" onClick={() => setSelectedCountries([...countryList])}>Select All</Button>
                                    <Button size="slim" onClick={() => setSelectedCountries([])}>Clear All</Button>
                                  </ButtonGroup>
                                </InlineStack>
                                <div style={{ maxHeight: '250px', overflowY: 'scroll', border: '1px solid #E1E3E5', borderRadius: '8px', padding: '12px' }}>
                                  <BlockStack gap="200">
                                    {countryList.filter((country) => country.toLowerCase().includes(countrySearchQuery.toLowerCase())).map((countryName) => (
                                      <Checkbox key={countryName} label={countryName} checked={selectedCountries.includes(countryName)} onChange={(checked) => setSelectedCountries((prev) => checked ? (prev.includes(countryName) ? prev : [...prev, countryName]) : prev.filter((c) => c !== countryName))} />
                                    ))}
                                  </BlockStack>
                                </div>
                                <Text variant="bodySm" as="p" tone="subdued">Selected: {selectedCountries.length} {selectedCountries.length === 1 ? 'country' : 'countries'}</Text>
                              </BlockStack>
                            </Box>
                          </Collapsible>
                        </BlockStack>
                      </Box>
                    </Card>
                    <Box paddingBlockStart="300" paddingBlockEnd="600">
                      <style>{`.publish-button-black button { background: #000000 !important; color: #ffffff !important; border-radius: 8px !important; }`}</style>
                      <div className="publish-button-black"><Button fullWidth onClick={handlePublish} variant="primary">Publish!</Button></div>
                    </Box>
                  </BlockStack>
                )}
              </div>

              {/* RIGHT - Preview (STICKY BOX) */}
              <div style={{ 
                flex: 1, 
                minWidth: 0, 
                position: 'sticky', 
                top: '20px', 
                alignSelf: 'flex-start',
                zIndex: 10
              }}>
                <LegacyCard title="Real-time Preview" sectioned>
                  <BlockStack gap="400">
                    <InlineStack align="center" blockAlign="center">
                      <ButtonGroup segmented>
                        <Button pressed={previewMode === 'desktop'} icon={DesktopIcon} onClick={() => handleChangePreviewMode('desktop')}>Desktop</Button>
                        <Button pressed={previewMode === 'tablet'} icon={TabletIcon} onClick={() => handleChangePreviewMode('tablet')}>Tablet</Button>
                        <Button pressed={previewMode === 'mobile'} icon={MobileIcon} onClick={() => handleChangePreviewMode('mobile')}>Mobile</Button>
                      </ButtonGroup>
                    </InlineStack>
                      
                    {isLoadingPreview ? (
                      <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text tone="subdued">Loading preview...</Text></div>
                    ) : (
                      <CleanPreviewContainer 
                        content={previewContent} 
                        contents={contents}
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
                        currentIndex={previewIndex}
                        totalContents={contents.length}
                        onPrevContent={handlePrevContent}
                        onNextContent={handleNextContent}
                        slideMode={slideMode}
                        slideDuration={slideDuration}
                        barType={barType}
                        showSliderArrows={showSliderArrows}
                      />
                    )}
                  </BlockStack>
                </LegacyCard>
              </div>
            </div>
          </Layout.Section>
        </Layout>
        
        {/* --- LINK BUILDER MODAL --- */}
        <Modal open={isLinkModalOpen} onClose={handleCloseLinkModal} title="Build a Link" primaryAction={{ content: 'Insert Link', onAction: handleInsertLink }} secondaryActions={[{ content: 'Cancel', onAction: handleCloseLinkModal }]}>
          <Modal.Section>
            <BlockStack gap="400">
              <TextField label="Link Text" value={tempLinkData.linkText} onChange={(v) => setTempLinkData(p => ({...p, linkText: v}))} autoComplete="off" />
              <TextField label="Link Address" value={tempLinkData.linkUrl} onChange={(v) => setTempLinkData(p => ({...p, linkUrl: v}))} autoComplete="off" />
              <ColorPickerButton label={`Link Color ${tempLinkData.linkColor}`} color={tempLinkData.linkColor} onChange={(c) => setTempLinkData(p => ({...p, linkColor: c}))} />
              <BlockStack gap="200">
                <Text as="p" fontWeight="bold">Link Style</Text>
                <RadioButton label="With underline" checked={tempLinkData.linkUnderline === true} id="linkUnderlineYes" name="linkStyle" onChange={() => setTempLinkData(p => ({...p, linkUnderline: true}))} />
                <RadioButton label="Without underline" checked={tempLinkData.linkUnderline === false} id="linkUnderlineNo" name="linkStyle" onChange={() => setTempLinkData(p => ({...p, linkUnderline: false}))} />
              </BlockStack>
              <BlockStack gap="200">
                <Text as="p" fontWeight="bold">Link Open</Text>
                <RadioButton label="In a new tab" checked={tempLinkData.linkNewTab === true} id="linkTabNew" name="linkOpen" onChange={() => setTempLinkData(p => ({...p, linkNewTab: true}))} />
                <RadioButton label="In the same tab" checked={tempLinkData.linkNewTab === false} id="linkTabSame" name="linkOpen" onChange={() => setTempLinkData(p => ({...p, linkNewTab: false}))} />
              </BlockStack>
            </BlockStack>
          </Modal.Section>
        </Modal>
      </Page>
    </>
  );
}

export default CreateBarPage;