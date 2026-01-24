# 🎨 Design System & Component Guide

Visual reference for Bookshelf's design system.

---

## 🌈 Color Palette

### Primary Colors
- **Amber 500/600**: `#f59e0b` / `#d97706` (Primary actions)
- **Orange 500/600**: `#f97316` / `#ea580c` (Accents)

### Semantic Colors
- **Blue 500/600**: `#3b82f6` / `#2563eb` (Links, secondary)
- **Green 500/600**: `#10b981` / `#059669` (Success, finished)
- **Red 500/600**: `#ef4444` / `#dc2626` (Danger, likes)
- **Pink 500/600**: `#ec4899` / `#be185d` (Highlights)

### Neutral Colors
- **Slate 900**: `#0f172a` (Text dark mode)
- **Slate 800**: `#1e293b` (Cards dark mode)
- **Slate 50**: `#f8fafc` (Light backgrounds)
- **Slate 600**: `#475569` (Secondary text)

### Light Mode
```
Background: Amber 50 (#faf8f3)
Text: Slate 900 (#0f172a)
Cards: White (#ffffff)
Borders: Slate 200 (#e2e8f0)
```

### Dark Mode
```
Background: Slate 900 (#0f172a)
Text: Amber 50 (#faf8f3)
Cards: Slate 800 (#1e293b)
Borders: Slate 700 (#334155)
```

---

## 🔤 Typography

### Font Families
- **Playfair Display**: Serif, for titles & headings
- **Inter**: Sans-serif, for body & UI

### Font Classes

```tsx
// Headings
<h1 className="font-serif-title">
  // Playfair Display
  // 24px, bold, tight tracking
  
<h2 className="font-serif-subtitle">
  // Playfair Display
  // 18px, semibold

// Body Text
<p className="text-slate-700 dark:text-slate-300">
  // Inter, 16px, medium gray

// Small Text
<span className="text-xs text-slate-500">
  // 12px, lighter gray
```

### Typography Sizes
- **Hero**: 56px (landing page)
- **H1**: 32px (page titles)
- **H2**: 24px (section titles)
- **H3**: 18px (subsections)
- **Body**: 16px (default)
- **Small**: 14px (secondary info)
- **Tiny**: 12px (metadata)

---

## 🎨 Components

### Card Component
```tsx
<div className="card-bookish">
  {/* Paper texture background */}
  {/* Soft shadow */}
  {/* White/slate background */}
  {/* Rounded corners */}
</div>
```

**Features:**
- Paper texture overlay
- Soft drop shadow (hover: stronger)
- Dark mode aware
- Rounded corners (xl)

**Usage:**
```tsx
<div className="card-bookish">
  <h3 className="font-serif-subtitle">Title</h3>
  <p>Content here</p>
</div>
```

### Button Variants

#### Primary Button
```tsx
<button className="btn-primary">
  {/* Gradient amber to orange */}
  {/* White text */}
  {/* Shadow with hover effect */}
</button>
```

#### Secondary Button
```tsx
<button className="btn-secondary">
  {/* Border: amber-500 */}
  {/* Text: amber-700 */}
  {/* Light background on hover */}
</button>
```

### Badge Component
```tsx
<span className="badge">
  Fiction
  {/* Amber background */}
  {/* Amber 900 text */}
  {/* Rounded pill shape */}
</span>
```

### Icons
All icons from **Lucide React**:
```tsx
import { BookOpen, Heart, Share2, User } from "lucide-react";

<BookOpen className="w-5 h-5" /> // 20px × 20px
<Heart className="w-4 h-4" />     // 16px × 16px
```

---

## 🎬 Animations

### Slide In
```typescript
className="animate-slideIn"
// Fades in from top (10px)
// Duration: 300ms
// Easing: ease-out
```

**Use for:** Page loads, new content

### Hover Lift
```typescript
className="hover-lift"
// Lifts up on hover (-1px)
// Duration: 300ms
// Transition-based
```

**Use for:** Clickable cards, buttons

### Float
```typescript
className="animate-float"
// Subtle up/down movement
// Duration: 3s
// Infinite loop
```

**Use for:** Decorative elements, icons

### Shimmer
```typescript
className="animate-shimmer"
// Loading skeleton animation
// Duration: 2s
// Infinite
```

**Use for:** Loading states

---

## 🌙 Dark Mode

### Automatic Detection
```tsx
// HTML tag controls dark mode
<html lang="en" suppressHydrationWarning>
  <body className="dark:bg-slate-900">
```

### Manual Toggle
```tsx
// User can toggle theme
onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
```

### Dark Mode Colors
```tsx
// Light mode (default)
<div className="bg-amber-50 text-slate-900">

// Dark mode override
<div className="bg-amber-50 dark:bg-slate-900 
                text-slate-900 dark:text-amber-50">
```

---

## 📐 Spacing & Sizing

### Padding/Margin Scale
```
xs:  2px  (1/2 space)
sm:  4px  (1 space)
md:  8px  (2 spaces)
lg: 16px  (4 spaces)
xl: 24px  (6 spaces)
2xl: 32px (8 spaces)
```

### Common Spacings
```tsx
// Cards
<div className="p-6"> {/* 24px padding */}

// Sections
<div className="py-8"> {/* 32px top/bottom */}

// Gaps
<div className="gap-4"> {/* 16px between items */}
```

### Container Width
```
max-w-4xl  : 56rem (900px)  - Standard content
max-w-7xl  : 80rem (1280px) - Full width
```

---

## 🎯 Layout Patterns

### Hero Section
```tsx
<section className="py-20 bg-gradient-to-br 
                     from-amber-100 to-orange-50">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h1 className="font-serif-title">Hero Title</h1>
    <p>Subtitle</p>
    <button className="btn-primary">CTA</button>
  </div>
</section>
```

### Card Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div className="card-bookish hover-lift">
      {/* Content */}
    </div>
  ))}
</div>
```

### Two-Column Layout
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    {/* Main content */}
  </div>
  <div className="lg:col-span-1">
    {/* Sidebar */}
  </div>
</div>
```

---

## 📱 Responsive Breakpoints

```
sm:  640px   (tablets)
md:  768px   (small desktops)
lg:  1024px  (desktops)
xl:  1280px  (large screens)
2xl: 1536px  (huge screens)
```

### Responsive Classes
```tsx
// Hidden on mobile, shown on desktop
<div className="hidden md:block">
  Desktop only
</div>

// Different grid sizes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## 🎨 Creating New Components

### Template
```tsx
interface ComponentProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  children: React.ReactNode;
}

export function MyComponent({ 
  variant = 'primary', 
  disabled = false,
  children 
}: ComponentProps) {
  return (
    <div className={`
      card-bookish
      ${variant === 'primary' ? 'bg-amber-100' : 'bg-slate-100'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      hover-lift transition-all
    `}>
      {children}
    </div>
  );
}
```

### Using CSS Classes
```tsx
// Always organize classes:
// 1. Layout (flex, grid, display)
// 2. Sizing (w, h, p, m)
// 3. Colors (bg, text)
// 4. Borders (border, rounded)
// 5. Effects (shadow, opacity)
// 6. State (hover, dark)

className="
  flex items-center gap-2
  p-4 w-full
  bg-white text-slate-900
  border border-slate-200 rounded-lg
  hover:shadow-lg dark:bg-slate-800
"
```

---

## 📚 Book Display

### Book Cover
```tsx
<div className="book-cover aspect-[3/4]">
  {/* Background gradient if no image */}
  <img src={url} alt={title} className="w-full h-full object-cover" />
</div>
```

### Book Card
```tsx
<div className="card-bookish">
  {/* Cover Image */}
  <div className="relative mb-4 overflow-hidden rounded-lg 
                   book-shadow aspect-[3/4]">
    <img src={cover} alt={title} />
    <div className="absolute top-2 right-2 badge">
      {status}
    </div>
  </div>
  
  {/* Content */}
  <h3 className="font-serif-subtitle">{title}</h3>
  <p className="text-sm text-slate-600">{author}</p>
  
  {/* Rating */}
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={i < rating ? 'fill-amber-400' : 'text-slate-300'} />
    ))}
  </div>
</div>
```

---

## 💬 Post Card Structure

```tsx
<div className="card-bookish">
  {/* Author Info */}
  <div className="flex gap-3 mb-4">
    <img src={avatar} className="w-10 h-10 rounded-full" />
    <div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-xs text-slate-500">{date}</p>
    </div>
  </div>
  
  {/* Content */}
  {content && <p className="mb-4">{content}</p>}
  
  {/* Interactions */}
  <div className="flex gap-4 pt-4 border-t">
    <button>♥️ {likes}</button>
    <button>💬 {comments}</button>
  </div>
</div>
```

---

## 📸 Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/book-cover.jpg"
  alt="Book Title"
  width={200}
  height={300}
  priority={false}
  className="rounded-lg book-shadow"
/>
```

---

## ♿ Accessibility

### Semantic HTML
```tsx
// Use semantic tags
<nav> Navigation </nav>
<main> Main content </main>
<article> Post </article>
<section> Section </section>

// Use proper headings
<h1> Page title </h1>
<h2> Section title </h2>

// Use proper buttons
<button> Action </button>
<a href="/"> Link </a>
```

### ARIA Labels
```tsx
<button aria-label="Like post">
  <Heart />
</button>

<div role="status" aria-live="polite">
  Loading...
</div>
```

### Keyboard Navigation
```tsx
// Ensure interactive elements are keyboard accessible
// Tab order is logical
// Focus states are visible
<button className="focus:outline-none focus:ring-2 focus:ring-amber-500">
  Click me
</button>
```

---

## 🎭 Theming Example

### Light Theme
```css
background: Amber 50
text: Slate 900
borders: Slate 200
cards: White
shadows: Soft gray
```

### Dark Theme
```css
background: Slate 900
text: Amber 50
borders: Slate 700
cards: Slate 800
shadows: Black 50%
```

### Switching
```typescript
setTheme(theme === 'dark' ? 'light' : 'dark');
// Document responds automatically
// Persists to localStorage
```

---

## ✅ Design Checklist

When building new components:

- [ ] Uses design system colors
- [ ] Uses proper typography
- [ ] Responsive (mobile → desktop)
- [ ] Dark mode compatible
- [ ] Accessible (semantic HTML)
- [ ] Has proper hover states
- [ ] Has focus states
- [ ] Consistent spacing
- [ ] Proper shadows/depth
- [ ] Loading states

---

## 🚀 Performance Tips

```tsx
// Memoize styled components
const StyledCard = memo(({ children }) => (
  <div className="card-bookish">{children}</div>
));

// Use CSS classes over inline styles
// ✅ <div className="btn-primary">
// ❌ <div style={{ background: '#f59e0b' }}>

// Lazy load images
<img src={url} loading="lazy" />

// Use Tailwind's built-in utilities
// ✅ hover:shadow-lg
// ❌ Custom CSS with :hover
```

---

## 📖 Reference Links

- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind Typography](https://tailwindcss.com/docs/font-family)
- [Lucide Icons](https://lucide.dev)
- [WCAG Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Design system completed! Use this guide when building new features.** 🎨
