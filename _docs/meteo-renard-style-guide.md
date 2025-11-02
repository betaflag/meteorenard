# MeteoRenard Design & Style Guide

**Version 1.0** | Last Updated: October 2025

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Visual Effects](#visual-effects)
7. [Iconography](#iconography)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Design Principles](#design-principles)

---

## Brand Overview

**MeteoRenard** is a mystical weather application featuring a fox-themed design that combines modern functionality with enchanting visual aesthetics. The experience is characterized by dark atmospheric backgrounds, glowing accents, and smooth animations that evoke a sense of magic and mystery.

### Brand Personality

- **Mystical**: Dark, atmospheric ambiance with glowing effects
- **Modern**: Clean, contemporary UI with card-based layouts
- **Trustworthy**: Professional weather data presentation
- **Playful**: Fox mascot adding personality and charm

### Brand Voice

Friendly, knowledgeable, slightly whimsical — like receiving advice from a wise fox companion.

---

## Color Palette

### Primary Colors

| Color Name              | Hex Code  | RGB                | Usage                                                |
| ----------------------- | --------- | ------------------ | ---------------------------------------------------- |
| **Mystic Orange**       | `#ff6b00` | `rgb(255, 107, 0)` | Primary accent, CTAs, highlights, temperature values |
| **Mystic Orange Light** | `#ff8c00` | `rgb(255, 140, 0)` | Gradient endpoints, hover states                     |

### Background Colors

| Color Name          | Hex Code                | RGB               | Usage                              |
| ------------------- | ----------------------- | ----------------- | ---------------------------------- |
| **Deep Space**      | `#0a0a0a`               | `rgb(10, 10, 10)` | Base background                    |
| **Midnight Navy**   | `#1a1a2e`               | `rgb(26, 26, 46)` | Gradient component                 |
| **Steel Blue Dark** | `#16213e`               | `rgb(22, 33, 62)` | Gradient component                 |
| **Card Dark**       | `rgba(26, 26, 46, 0.7)` | —                 | Card backgrounds with transparency |
| **Card Mid**        | `rgba(36, 36, 56, 0.6)` | —                 | Card gradient middle               |
| **Card Light**      | `rgba(46, 46, 66, 0.5)` | —                 | Card gradient end                  |

### Text Colors

| Color Name         | Hex Code  | RGB                  | Usage                 |
| ------------------ | --------- | -------------------- | --------------------- |
| **Primary Text**   | `#e8e8e8` | `rgb(232, 232, 232)` | Body text             |
| **Secondary Text** | `#e5e7eb` | `rgb(229, 231, 235)` | Secondary information |
| **Tertiary Text**  | `#d1d5db` | `rgb(209, 213, 219)` | Labels, captions      |
| **Muted Text**     | `#a8a8a8` | `rgb(168, 168, 168)` | Help text, timestamps |
| **Light Gray**     | `#c8c8c8` | `rgb(200, 200, 200)` | Unit indicators       |

### Semantic Colors

| Color Name           | Hex Code  | Usage                                                |
| -------------------- | --------- | ---------------------------------------------------- |
| **Temperature High** | `#ff6b00` | Maximum temperature indicators                       |
| **Temperature Low**  | `#60a5fa` | `rgb(96, 165, 250)` — Minimum temperature indicators |
| **Feels Like**       | `#fbbf24` | `rgb(251, 191, 36)` — "Feels like" temperature       |
| **Rain Blue**        | `#3b82f6` | `rgb(59, 130, 246)` — Rain/precipitation indicators  |
| **Wind Alert**       | `#f59e0b` | `rgb(245, 158, 11)` — Wind alerts                    |
| **Humidity Blue**    | `#60a5fa` | Humidity indicators                                  |

### Fox Wisdom Theme (Special Cards)

| Color Name            | Value                    | Usage                       |
| --------------------- | ------------------------ | --------------------------- |
| **Earthy Brown Dark** | `rgba(50, 35, 25, 0.85)` | Tips card background start  |
| **Earthy Brown Mid**  | `rgba(65, 45, 30, 0.8)`  | Tips card background middle |

---

## Typography

### Font Families

**Primary Display Font**: `Cinzel` (serif)

- Used for: Main titles, brand name, section headers
- Weights: 400 (Regular), 600 (Semibold)
- Source: Google Fonts

**Primary Body Font**: `Raleway` (sans-serif)

- Used for: Body text, UI elements, data values
- Weights: 300 (Light), 400 (Regular), 600 (Semibold)
- Source: Google Fonts

### Type Scale

| Element                 | Font Family | Size           | Weight | Letter Spacing | Usage                                     |
| ----------------------- | ----------- | -------------- | ------ | -------------- | ----------------------------------------- |
| **Hero Title**          | Cinzel      | 2.4rem (38px)  | 600    | 0.1em          | "MÉTÉO RENARD" main title                 |
| **Section Title**       | Cinzel      | 1.6rem (26px)  | 400    | normal         | Section headers like "Conseils de Renard" |
| **Large Temperature**   | Raleway     | 92px           | 700    | normal         | Current temperature display               |
| **Temperature Unit**    | Raleway     | 46px           | 400    | normal         | Temperature unit symbol (°C)              |
| **Weather Description** | Raleway     | 28px           | 300    | 0.05em         | Weather condition text                    |
| **Detail Value**        | Raleway     | 28px           | 600    | normal         | Metrics (wind, humidity, etc.)            |
| **Body Text**           | Raleway     | 1rem (16px)    | 400    | normal         | Standard text                             |
| **Large Label**         | Raleway     | 1.2rem (19px)  | 500    | normal         | Location names                            |
| **Button Text**         | Raleway     | 1.1rem (18px)  | 500    | normal         | Call-to-action buttons                    |
| **Small Label**         | Raleway     | 0.75rem (12px) | 500    | 0.08em         | Uppercase labels                          |
| **Timestamp**           | Raleway     | 0.85rem (14px) | 400    | normal         | Update times                              |

### Text Treatments

**Uppercase Labels**

- Transform: uppercase
- Letter spacing: 0.05em - 0.08em
- Font weight: 500
- Usage: Metric labels, status indicators

**Text Shadows**

- Primary accent glow: `0 0 20px rgba(255, 107, 0, 0.3)` to `0 0 30px rgba(255, 107, 0, 0.6)`
- Used for: Brand name, temperature values, highlighted text

---

## Spacing & Layout

### Spacing System

MeteoRenard uses an 8px base unit spacing system:

| Token | Value | Usage                           |
| ----- | ----- | ------------------------------- |
| `xs`  | 8px   | Icon gaps, tight spacing        |
| `sm`  | 12px  | Small gaps within components    |
| `md`  | 16px  | Standard padding, moderate gaps |
| `lg`  | 24px  | Section padding, card padding   |
| `xl`  | 32px  | Large padding, section spacing  |
| `2xl` | 48px  | Major section spacing           |
| `3xl` | 64px  | Section margins                 |
| `4xl` | 80px  | Large section breaks            |

### Container & Grid

**Maximum Content Width**: 1200px (main container)

- Extended to 1400px for large cards like current weather
- Centered with auto margins

**Card Layouts**

- Standard card max-width: 1200px
- Wide card max-width: 1400px
- Card padding: 24px - 32px (desktop), 16px (mobile)

**Grid Systems**

- Detail cards: 3-column grid (desktop) → 2-column (tablet) → 1-column (mobile)
- Weather sections: 2-column layout for main display on desktop

---

## Components

### Cards

**Standard Weather Card**

```
Background: Linear gradient
  - Start: rgba(26, 26, 46, 0.7)
  - Middle: rgba(36, 36, 56, 0.6)
  - End: rgba(46, 46, 66, 0.5)
  - Angle: 135deg

Border: 1px solid rgba(255, 107, 0, 0.35)
Border radius: 24px
Backdrop filter: blur(20px)

Box shadow:
  - 0 20px 50px rgba(0, 0, 0, 0.5) — depth shadow
  - 0 0 40px rgba(255, 107, 0, 0.15) — glow
  - inset 0 0 0 1px rgba(255, 255, 255, 0.1) — inner highlight
```

**Floating Glow Effect (::before pseudo-element)**

```
Position: absolute, top -50%, right -50%
Size: 200% × 200%
Background: Radial gradient with orange glow
Animation: float (8s infinite)
Filter: blur(40px)
```

**Tips Card (Fox Wisdom)**

```
Background: Earthy brown gradient (see color palette)
Border: 2px solid rgba(255, 107, 0, 0.4)
Border radius: 20px
Padding: 25px
Multiple shadow layers for depth and glow
```

### Buttons

**Primary Button (CTA)**

```
Background: Linear gradient 135deg, #ff6b00 → #ff8c00
Color: white
Border: none
Padding: 12px 30px
Border radius: 25px (pill shape)
Font size: 1.1rem
Font weight: 500
Box shadow: 0 4px 15px rgba(255, 107, 0, 0.3)

Hover state:
  - Transform: translateY(-2px)
  - Box shadow: 0 6px 20px rgba(255, 107, 0, 0.4)

Active state:
  - Transform: translateY(0)
```

**Icon Button (Clear/Close)**

```
Background: transparent
Border: 1px solid rgba(255, 107, 0, 0.2)
Border radius: 50% (circle)
Size: 28px × 28px
Opacity: 0.6 (default)

Hover state:
  - Opacity: 1
  - Background: rgba(255, 107, 0, 0.1)
  - Border color: rgba(255, 107, 0, 0.4)
  - Transform: scale(1.1)
```

### Detail Boxes

**Metric Detail Box**

```
Background: rgba(255, 255, 255, 0.05)
Border: 1px solid rgba(255, 255, 255, 0.1)
Border radius: 16px
Padding: 26px
Min height: 120px

Hover state:
  - Background: rgba(255, 255, 255, 0.08)
  - Border color: rgba(255, 107, 0, 0.25)
  - Transform: translateY(-2px)
```

**Structure:**

- Header: Icon + uppercase label
- Content: Large value + optional extra info
- Optional: Progress bar for percentage values

### Badges

**Weather Badges (Conditional)**

```
Display: inline-flex
Padding: 5px 12px
Border radius: 14px
Font size: 0.8rem
Font weight: 600
Text transform: uppercase
Letter spacing: 0.05em
Border left: 3px solid (color variant)

Variants:
  - Rain: Blue theme (#60a5fa)
  - Wind: Amber theme (#fbbf24)
  - Humidity: Blue theme (#60a5fa)
```

### Progress Bars

**Humidity Progress Bar**

```
Container:
  - Width: 100%
  - Height: 8px
  - Background: rgba(0, 0, 0, 0.3)
  - Border radius: 10px

Fill:
  - Background: Linear gradient 90deg, #3b82f6 → #60a5fa
  - Border radius: 10px
  - Transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1)
```

### Input Fields

**City Search Input**

```
Background: Semi-transparent dark with gradient
Border: 1px solid rgba(255, 107, 0, 0.3)
Border radius: 20px
Padding: 12px 20px
Font size: 1rem
Color: #e8e8e8

Focus state:
  - Border color: rgba(255, 107, 0, 0.5)
  - Box shadow with orange glow
```

---

## Visual Effects

### Smoke Background Animation

**Layered Effect**

- 3 smoke layers with different timing
- Radial gradient with orange tint (2-3% opacity)
- Animation: drift (20-30s infinite)
- Movement: translate + rotate + scale

**Animation Keyframes:**

```
0%, 100%: Base position, scale(1), rotate(0deg)
33%: Drift pattern with 120deg rotation
66%: Drift pattern with 240deg rotation
```

### Card Animations

**fadeIn** (entry animation)

```
Duration: 0.7s
From: opacity 0, translateY(20px)
To: opacity 1, translateY(0)
```

**fadeInUp** (staggered entry)

```
Duration: 0.7s
From: opacity 0, translateY(30px)
To: opacity 1, translateY(0)
```

**slideInRight** (list items)

```
Duration: 0.5s
From: opacity 0, translateX(-20px)
To: opacity 1, translateX(0)
Stagger delay: +0.1s per item
```

### Icon Animations

**iconPulse** (main weather icon)

```
Duration: 3s infinite
Easing: ease-in-out
Scale: 1 → 1.05 → 1
Glow intensity increases at peak
```

**pulse** (fox icon)

```
Duration: 3s infinite
Box shadow intensity variation: 0.4 → 0.6 → 0.4
```

**titleGlow** (animated text glow)

```
Duration: variable
Text shadow intensity oscillation
Used for brand name and emphasis
```

### Hover Transitions

**Standard Transition**

```
Property: all
Duration: 0.3s
Easing: ease
```

**Elements with hover effects:**

- Cards: slight lift (-2px) + border glow
- Buttons: lift + shadow intensification
- Detail boxes: background lightening + border color change
- Tips: background tint + slide right (5px)

---

## Iconography

### Icon System

**Library**: Lucide Icons (via CDN)

- Consistent stroke-based icon family
- Clean, modern aesthetic
- Scalable and lightweight

**Icon Sizing**
| Context | Size | Stroke Width |
|---------|------|--------------|
| Main weather icon | 260px (desktop) | default |
| Section icons | 48px | default |
| Detail icons | 20px | default |
| Button icons | 20px | default |
| Badge icons | 14px | 2.5 |
| Small icons | 12-16px | default |

**Icon Colors**

- Primary icons: `rgba(255, 107, 0, 0.7)` (orange tint)
- Secondary icons: `rgba(209, 213, 219, 0.7)` (gray)
- Button icons: inherit color (white on primary buttons)

**Icon Effects**

- Drop shadow for emphasis: `drop-shadow(0 0 6px rgba(255, 107, 0, 0.2))`
- Multi-layer glow for main icon (see Visual Effects)

### Weather Icons Mapping

| Condition     | Icon | Lucide Name       |
| ------------- | ---- | ----------------- |
| Clear/Sunny   | ☀️   | `sun`             |
| Partly Cloudy | ⛅   | `cloud-sun`       |
| Cloudy        | ☁️   | `cloud`           |
| Rain          | 🌧️   | `cloud-rain`      |
| Heavy Rain    | ⛈️   | `cloud-drizzle`   |
| Thunderstorm  | ⚡   | `cloud-lightning` |
| Snow          | ❄️   | `cloud-snow`      |
| Fog           | 🌫️   | `cloud-fog`       |

---

## Responsive Design

### Breakpoints

| Breakpoint  | Width         | Target Devices          |
| ----------- | ------------- | ----------------------- |
| **Desktop** | 1200px+       | Large screens, monitors |
| **Tablet**  | 768px - 900px | Tablets, small laptops  |
| **Mobile**  | 320px - 480px | Phones                  |

### Responsive Behavior

**Typography Scaling**

- Hero title: 2.4rem → 1.6rem (mobile)
- Temperature: 92px → 56px (mobile)
- Temperature unit: 46px → 28px (mobile)
- Weather text: 28px → 20px (mobile)

**Layout Changes**

_Desktop (1200px+):_

- Current weather: 2-column grid (info + icon side-by-side)
- Detail cards: 3-column grid
- Maximum widths enforced
- Full padding and spacing

_Tablet (768px - 900px):_

- Current weather: 1-column stack (info above icon)
- Detail cards: 2-column grid
- Centered layouts
- Moderate padding reduction

_Mobile (≤480px):_

- All sections: 1-column stack
- Sun times: vertical stack instead of horizontal
- Detail cards: single column
- Reduced padding (24px → 16px)
- Icon sizes reduced significantly

### Touch Targets

Minimum touch target size: **44px × 44px** (mobile)

- Buttons meet or exceed this standard
- Icon buttons: 28px × 28px (acceptable for non-critical actions)
- Adequate spacing between interactive elements

---

## Accessibility

### Color Contrast

**WCAG 2.1 Compliance** (Level AA)

Primary text on dark background:

- `#e8e8e8` on `#0a0a0a`: ✓ Passes AA (>7:1 ratio)

Orange accent on dark:

- `#ff6b00` on dark backgrounds: ✓ Sufficient contrast for UI elements

Temperature values:

- High contrast with glow for readability

### Semantic HTML

- Proper heading hierarchy (h1, h2)
- Semantic section elements
- Button elements (not divs) for interactive controls
- Alt text for fox mascot image

### Focus States

All interactive elements should receive visible focus indicators:

- Buttons: border glow intensification
- Inputs: border color change + glow
- Links: underline or color change

### Motion & Animation

**Respect User Preferences**

- Consider implementing `prefers-reduced-motion` media query
- Animations are decorative, not essential to functionality
- Page remains fully functional if animations are disabled

### Screen Reader Considerations

- Lucide icons use `data-lucide` attribute which generates proper SVG markup
- Consider adding `aria-label` to icon-only buttons
- Status updates (weather data) could benefit from `aria-live` regions
- Loading states have appropriate text content

---

## Design Principles

### 1. Atmospheric Depth

Create visual depth through:

- Multi-layer backgrounds (gradient + smoke effect)
- Card elevation with multiple shadow layers
- Backdrop blur on cards for glass morphism
- Inset highlights for inner glow

### 2. Mystical Enchantment

Evoke magical feeling through:

- Glowing orange accents (like firelight)
- Subtle continuous animations (drift, pulse, float)
- Radial gradients creating ethereal lighting
- Soft, blurred effects for dreamlike quality

### 3. Modern Clarity

Maintain usability with:

- High contrast text for readability
- Generous white space and padding
- Clear visual hierarchy (size, color, weight)
- Consistent spacing and alignment

### 4. Smooth Interactions

Polish user experience through:

- Thoughtful transitions (0.3s ease)
- Hover feedback on all interactive elements
- Loading states and error messaging
- Staggered animations for list reveals

### 5. Fox Wisdom Branding

Reinforce brand personality:

- Fox mascot as guide/advisor
- Warm earthy tones for tips section
- Friendly, conversational copy
- Personable advice delivery

---

## Implementation Notes

### Glass Morphism Technique

The card designs use modern glass morphism:

- Semi-transparent backgrounds (50-70% opacity)
- `backdrop-filter: blur(15-20px)`
- Multiple border layers (solid + inset highlights)
- Layered shadows for depth

### Performance Considerations

**Optimize animations:**

- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animating expensive properties (width, height, blur when possible)
- Smoke effects are decorative and can be reduced for performance

**Backdrop Filter Support:**

- Provide fallback backgrounds for browsers without backdrop-filter support
- Test appearance in Safari, Firefox, Chrome

### Browser Compatibility

**Target Support:**

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox (widely supported)
- Backdrop filter (check for fallbacks)
- CSS Custom Properties (consider fallbacks for older browsers)
