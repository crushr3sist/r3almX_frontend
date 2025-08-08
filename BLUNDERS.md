# Auth and Architecture Blunders (Objective, fix-oriented)

Auth architecture

- Dual sources of truth for auth: Context in `src/utils/AuthContext.tsx` and Redux-driven provider in `src/providers/AuthProviders.tsx` coexist. `ProtectedRoute`/`GuestRoute` use the Context, but the Context Provider is not mounted anywhere (not in `main.tsx` or `App.tsx`).
- Side effects in render: `src/providers/ProtectedRoute.tsx` dispatches thunks inside render via an IIFE; this can run on every render and flood the API.

Logic and typing

- Misleading return and bitwise bug: `checkTokenExpired` in `src/utils/AuthContext.tsx` returns numbers (200/401) and uses `400 | 401` (bitwise OR → 401). The calling `if` treats any non-zero as truthy.
- `isAuthenticated` typed as `boolean | null` but computed as a boolean; use `authLoading` for indeterminate state.
- `useAuth()` may return `undefined` because the Context default is `undefined` and there’s no guard; consumers can crash.

Networking / interceptors

- `Authorization` header lacks scheme: `src/utils/axios_instance.ts` sets `Authorization = token` (no `Bearer `). Brittle against typical backends.
- Un-guarded error access: `err.response.status` in the response interceptor can throw on network errors (no `response`).
- Imperative redirect inside HTTP layer: `window.location.href` in the interceptor tightly couples transport to navigation.

Routing / navigation

- Mixed navigation primitives and full reloads: `window.location.href/assign` used in `src/utils/axios_instance.ts`, `src/utils/AuthContext.tsx`, `src/pages/auth/Login.tsx`, `src/components/logOff.ts`. Breaks SPA state and complicates reasoning.
- `AuthProviders.tsx` is imported in `App.tsx` but not rendered. Dead or confusing code path.

Storage and security

- Inconsistent storage keys: `"expire"` vs `"token-expire"` between `src/utils/AuthContext.tsx` and `src/utils/login.ts`. `getTokenExpire` returns nothing.
- Partial cleanup: some failure paths remove only `token` but not `expire`.
- Token in `localStorage` plus logging token-related info (`console.log` of auth state/values) increases exposure.

Login flow correctness

- Shape mismatch: `src/pages/auth/Login.tsx` passes `response.data.access_token` (string) to `handleLoginSuccess`, but that function expects an object with `.access_token` and `.expire_time`.
- Verify-before-persist: `handleLoginSuccess` calls `verifyToken()` before ensuring the token is stored/attached, risking un-authenticated verify requests.
- Unused imports: `axios` imported in `Login.tsx` but unused.

Code organization / DX

- Provider placed under `utils/` (`src/utils/AuthContext.tsx`) instead of `providers/` or `context/`.
- Mixed `.jsx` and TypeScript: icon components under `src/components/icons/*.jsx` in a TS project lead to inconsistent type coverage.
- Magic strings and scattered constants: repeated storage keys and paths across files; easy to mistype and hard to change.

UI/UX behavior and events

- DOM coupling by id: `src/providers/NavbarProvider.tsx` attaches listeners to `#drawer-trigger` directly; brittle if the element isn’t present.
- Cookie clearing in `src/components/logOff.ts` via `document.cookie = ""` doesn’t actually clear cookies; needs `expires`/`max-age`, domain and path matching.

WebSocket considerations

- Worker-based socket in `src/App.tsx` doesn’t include auth semantics in the snippet; ensure token is attached via query string or subprotocol if required by backend.
