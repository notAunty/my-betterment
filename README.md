# My Betterment

This is a [Next.js](https://nextjs.org/) with vision to boost the Civil Responsibility of the people in Malaysia. 

This is a mobile-first app, use Responsive Design.


## Technology Stack

### Core Framework & Development
- **Next.js 14+** - React framework for web and mobile-first responsive design
- **Bun** - Package manager and runtime
- **TypeScript** - Type safety and developer experience
- **Zustand** - State management

### Database & Backend
- **Drizzle ORM** - Type-safe SQL toolkit for database operations
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - Authentication system with Apple & Google OAuth
- **Cloudflare R2** - S3-compatible object storage

### AI & LLM Integration
- **OpenRouter** - OpenAI-compatible LLM API for image classification
- **AI SDK (Vercel)** - LLM integration toolkit

### Mobile & Native Features
- **Capacitor** - Cross-platform mobile app development
  - **SQLite** - Local database for mobile data caching
  - **Camera Plugin** - Native camera access for problem reporting
- **Platform Support**: Android, iOS

### Deployment & Infrastructure
- **Vercel** - Web app deployment and edge functions
- **Google Play Store** - Android app distribution
- **Apple App Store** - iOS app distribution


## UI/UX Design Specifications

### Modern Instagram-Style UI with Pistachio Colors

**Design Philosophy**: Modern, clean, Instagram-inspired interface using soft pistachio and shell tones for an approachable civic engagement app.

#### Key Design Elements:
- **Card-based layouts** with subtle shadows and rounded corners
- **Minimal, clean typography** with plenty of white space
- **Bottom navigation** with icon + label style (similar to Instagram) with Camera in the middle
- **Feed-style** vertical scrolling for reports and leaderboards (stage 2)

### Pistachio Color Palette

```typescript
// Theme configuration with earthy shell tones and pastel greens
export const PistachioTheme = {
  colors: {
    // Primary pistachio greens (more pastel)
    primary: '#A8D4A0',      // Soft pastel pistachio green
    primaryDark: '#8BB882',  // Muted darker green for headers
    primaryLight: '#C5E4BE', // Very light pastel green for backgrounds
    
    // Earthy shell tones for backgrounds and surfaces
    background: '#F5F2ED',   // Warm shell beige background
    surface: '#FEFCF9',      // Soft cream white for cards
    surfaceVariant: '#EDE8E0', // Light shell tone for secondary surfaces
    
    // Accent colors using green primarily
    accent: '#7FA876',       // Muted green accent for buttons and highlights
    accentLight: '#9BC092',  // Lighter green accent for hover states
    
    // Secondary colors with shell undertones
    secondary: '#E8E3D8',    // Warm light beige for cards and dividers
    secondaryDark: '#D4CFC4', // Slightly darker shell tone
    
    // Text colors with earthy warmth
    text: '#3A4A32',         // Deep forest green for primary text
    textSecondary: '#6B7A5E', // Muted green-brown for secondary text
    textTertiary: '#8A9580',  // Light green-gray for tertiary text
    
    // Status colors (keeping standard but slightly muted)
    success: '#6BA85A',      // Muted success green
    warning: '#E6A555',      // Warm amber warning
    error: '#C85A5A',        // Muted error red
    info: '#7FA8C4',         // Soft blue for info
    
    // Border and divider colors
    border: '#D8D3C8',       // Soft shell-toned border
    divider: '#E5E0D5',      // Light divider with shell undertone
    
    // Interactive states
    hover: '#F0EDE6',        // Light shell tone for hover
    pressed: '#E8E3D8',      // Slightly darker for pressed state
    disabled: '#C4BFB4',     // Muted shell tone for disabled elements
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  shadows: {
    sm: '0 1px 3px rgba(58, 74, 50, 0.1)',
    md: '0 4px 6px rgba(58, 74, 50, 0.1)',
    lg: '0 10px 15px rgba(58, 74, 50, 0.1)',
  }
};
```

#### Component Style Guidelines:
- **Navigation**: Bottom tab bar with subtle shadows, icons in primaryDark
- **Cards**: Use surface color with md shadows, lg border radius
- **Buttons**: Accent color with xl border radius, subtle hover animations
- **Lists**: Alternating background colors (surface/surfaceVariant)
- **Images**: Rounded corners (lg), subtle border in border color
- **Typography**: Clean sans-serif, use text hierarchy colors consistently


## Timeline & Features

### Stage 1

- Basic Login with Apple & Google
- Camera scanning of problems
- Use LLM API to classify the problem
  - Parking: illegal parking, double parking, blocking driveways,
  disabled spots
  - Infrastructure: pothholes, damanged infrastructure, broken streetlights, dangerous walkway
- User profile with submitted images (private)
- Global leaderboard of offending vehicles

### Stage 2

- Feed timeline with post privacy options
- Allow user to comment on posts
- Report image as fake / AI-generated

## Detailed User Stories & Requirements

### Stage 1: Core Problem Reporting (MVP)

#### User Story 1: User Authentication
**As a citizen**, I want to securely sign in using my Apple or Google account so that I can access the app without creating new credentials.

**Acceptance Criteria:**
- [ ] Users can sign in with Apple ID / Google account on iOS devices
- [ ] Users can sign in with Google account on Android/web
- [ ] User session persists across app restarts
- [ ] Secure token storage using Supabase Auth
- [ ] Fetch profile on first login and save into db

#### User Story 2: Problem Documentation
**As a concerned citizen**, I want to take photos of civic problems (illegal parking, infrastructure issues) so that I can report them to improve my community.

**Acceptance Criteria:**
- [ ] Native camera access through Capacitor
- [ ] High-quality image capture with metadata (location, timestamp)
- [ ] Auto-sync when connection is restored NOT NEEDED
- [ ] Image compression for efficient storage
- [ ] Upload image to Cloudflare R2 and save entry into database

#### User Story 3: AI Problem Classification
**As a user**, I want the app to automatically categorize my reported problems so that they're properly organized and routed.

**Acceptance Criteria:**
- [ ] LLM integration via OpenRouter API
- [ ] Automatic classification of problem types (parking violations, infrastructure)
- [ ] Vehicle license plate detection for traffic violations
- [ ] Confidence scoring NOT NEEDED
- [ ] Request for retake instead of allowing manual override option for incorrect classifications
    - Failed detection shall prompt for retake
    - User have options to retake as well
- [ ] Implementation on Vercel api/ route to prevent abuse

#### User Story 4: Personal Activity Dashboard
**As a user**, I want to view my submission history privately so that I can track my civic contributions.

**Acceptance Criteria:**
- [ ] Private user profile with submission count
- [ ] Chronological list of submitted reports
- [ ] Status tracking (pending, reviewed, resolved) NOT NEEDED
- [ ] Personal statistics and contribution metrics gamification with stars
    - One submission = 1 star
- [ ] Export functionality for personal records NOT NEEDED

#### User Story 5: Community Accountability
**As a community member**, I want to see which vehicles/locations have the most violations so that awareness can drive behavioral change.

**Acceptance Criteria:**
- [ ] Anonymous global leaderboard of repeat offenders
  - Implement this on the "Dashboard" which is the homepage
  - Show all 3 time periods simultaneously as a scrollable page:
    - Past 7 days
    - Past 30 days
    - Past 90 days
  - Show the top 10 offenders (by car plate) with the most violations for each period
  - Show the top locations with the most violations (text list) for past 30 days
- [ ] Location-based violation heat maps (Stage 2)
- [ ] Aggregated statistics (no personal data exposed)

### Stage 2: Social Features & Community Engagement

#### User Story 6: Community Feed
**As a user**, I want to share my reports with the community (with privacy controls) so that we can collectively address local issues.

**Acceptance Criteria:**
- [ ] Public/private/friends-only privacy settings
- [ ] Real-time feed of community reports
- [ ] Location-based filtering of nearby reports
- [ ] Report categorization and filtering
- [ ] User blocking and content moderation tools

#### User Story 7: Community Discussion
**As a community member**, I want to comment on and discuss reported problems so that we can collaborate on solutions.

**Acceptance Criteria:**
- [ ] Threaded comments on public reports
- [ ] Like/upvote system for reports and comments
- [ ] User reputation system based on community engagement
- [ ] Constructive discussion guidelines and enforcement
- [ ] Notification system for replies and mentions

#### User Story 8: Content Integrity
**As a user**, I want to report suspicious or fake content so that the platform maintains credibility and trust.

**Acceptance Criteria:**
- [ ] Report button for suspected AI-generated or fake images
- [ ] Community moderation system with voting
- [ ] AI detection tools for generated content
- [ ] Review process for flagged content
- [ ] User penalties for repeated false reports

## Development Setup & Deployment

### Prerequisites
- **Bun** >= 1.0.0
- **Node.js** >= 18.0.0
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Environment Configuration
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter LLM API
OPENROUTER_API_KEY=your_openrouter_api_key

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_APPLE_CLIENT_ID=your_apple_client_id
```

### Development Workflow
1. **Web Development**: `bun dev` - Next.js development server
2. **Mobile Development**: 
   - `bun run build` - Build the web app
   - `bunx cap add ios` / `bunx cap add android` - Add mobile platforms
   - `bunx cap sync` - Sync web assets to mobile
   - `bunx cap open ios` / `bunx cap open android` - Open in native IDEs

### Deployment Strategy
- **Web App**: Vercel automatic deployments from main branch
- **Android**: Google Play Store via GitHub Actions
- **iOS**: Apple App Store via Xcode Cloud or GitHub Actions
- **Database**: Supabase managed PostgreSQL with global CDN

### Key Integrations
- **Drizzle**: Type-safe database schema and migrations
- **Supabase Auth**: Seamless OAuth integration with native mobile support
- **Capacitor**: Web-to-native bridge for camera, storage, and device features
- **OpenRouter**: Cost-effective LLM API with multiple model options
