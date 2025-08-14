# R3almX Frontend - GitHub Copilot Instructions

## Project Overview

R3almX is transforming from a chat application into a customizable platform where users create interactive "Realms" - think Discord meets CodePen. The architecture supports both a current chat app and future sandboxed user-generated content via iframe plugins.

## Core Architecture Patterns

### Authentication: Split-Brain → Unified Context

- **Current State**: Migrating from Redux + Context "split-brain" auth to pure Context API
- **Pattern**: `AuthContext` uses JWT client-side validation (no network calls on load) + axios interceptors for automatic 401 handling
- **Key Files**: `src/utils/AuthContext.tsx`, `src/utils/axios_instance.ts`, `src/providers/ProtectedRoute.tsx`
- **Rule**: All auth state flows through `useAuth()` hook - never access localStorage directly in components

### State Management: Pure React Context Architecture

- **Pattern**: All global state managed via React Context providers - no Redux
- **Auth State**: `AuthContext` for authentication and JWT handling
- **User State**: `UserProvider` for user data, rooms, and app state
- **Notifications**: `NotificationProvider` for real-time notifications
- **Rule**: Access state via custom hooks (`useAuth()`, `useUserState()`, `useNotifications()`) - never use raw Context
- **Pattern**: `ProtectedRoute` bootstraps all essential data via async functions after auth confirmation

### WebSocket Architecture: Worker + Context Integration

- **Pattern**: Main WebSocket runs in `webSocketWorker.js` to prevent blocking UI
- **Flow**: Worker → Context notifications → Component re-renders
- **Key**: `ClientController` manages global WebSocket, individual chat pages use separate room-specific connections
- **Files**: `src/utils/webSocketWorker.js`, `src/App.tsx`, `src/pages/chat/hooks/useWebSocketConnection.tsx`

### Chat Component Decomposition

- **Pattern**: Chat features split into specialized hooks for maintainability
- **Hooks**: `useWebSocketConnection`, `useMessageHandling`, `useChannelManagement`, `useScrollManagement`
- **Location**: `src/pages/chat/hooks/`
- **Rule**: Each hook handles one concern - avoid "god hooks" that do everything

## Development Workflows

### Build & Dev Commands

```bash
bun dev              # Vite dev server
bun build            # TypeScript + Vite build
bun serve            # Serve built dist on :5273
bun lint             # ESLint check
```

### Backend Integration

- **API Base**: `http://localhost:8080` (FastAPI Python backend)
- **Auth Endpoints**: `/auth/login`, `/auth/register` return JWT tokens
- **Pattern**: All API calls through `src/utils/axios_instance.ts` for automatic token injection

### Testing Auth Flow

1. Token automatically attached via axios interceptor
2. Server 401 → auto-logout via response interceptor
3. Client-side JWT validation prevents unnecessary network calls
4. `ProtectedRoute` bootstraps user data after auth confirmation

## Project-Specific Conventions

### File Organization

- **Pages**: Route components in `src/pages/[domain]/`
- **Providers**: Context providers in `src/providers/`
- **Hooks**: Custom hooks in `src/pages/[domain]/hooks/`
- **Utils**: Pure functions and instances in `src/utils/`

### Component Patterns

- **Route Protection**: Wrap pages in `<ProtectedRoute>` or `<GuestRoute>`
- **Loading States**: Use NextUI `<Spinner>` for async operations
- **Error Boundaries**: Wrap async components in `<Suspense>`

### TypeScript Patterns

- **Auth Types**: `DecodedToken` interface for JWT payload structure
- **Context Types**: Export types from provider files (`UserProvider`, `NotificationProvider`)
- **Hook Returns**: Always type return objects for reusable hooks

## Critical Integration Points

### Future Plugin System (Phase 2+)

- **Vision**: Users inject custom HTML/CSS/JS into sandboxed iframes
- **Communication**: `postMessage` API bridge between host and iframe
- **Security**: Strict CSP and iframe sandbox attributes
- **Reference**: See `Project_R3almX_Vision.md` for full roadmap

### External Dependencies

- **UI**: NextUI + Tailwind CSS (dark theme default)
- **Auth**: JWT decode + localStorage persistence
- **Routing**: React Router v6 with `createBrowserRouter`
- **State**: Pure React Context API architecture
- **Real-time**: Native WebSocket (no Socket.io on frontend)

## Common Gotchas

1. **useCallback Dependencies**: Always include in dep array to prevent infinite loops
2. **React Strict Mode**: Causes double-execution in dev - normal behavior
3. **WebSocket Cleanup**: Always terminate workers in useEffect cleanup
4. **JWT Expiration**: Check `exp * 1000 > Date.now()` for client-side validation
5. **Protected Route Pattern**: Data fetching happens in `ProtectedRoute`, not individual pages

## Key Files for Understanding Codebase

- `src/App.tsx` - Route definitions and WebSocket setup
- `src/utils/AuthContext.tsx` - Authentication source of truth
- `src/providers/ProtectedRoute.tsx` - Data bootstrapping pattern
- `Project_R3almX_Vision.md` - Long-term architectural vision
- `AuthFlow.md` - Authentication state machine diagram
