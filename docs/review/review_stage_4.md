# Code Review: Stage 4 (Template Discovery)

## Overview
This stage handles scanning the `rules/` directory to discover available architectures, frameworks, packages, and project-specific overrides.

## Files Reviewed
- `src/discovery/discovery.service.ts`
- `src/discovery/discovery.types.ts`

## Observations & Recommendations

### 1. Path Traversal Security (Security)
**File**: `src/discovery/discovery.service.ts`
**Issue**: The service receives parameters like `projectName` and `name` (framework/package name) and passes them into `path.join(this.rulesDir, ...)`. Because `projectName` is derived strictly from `path.basename(process.cwd())` (in the utils/orchestrator), it is inherently safe from `../` traversal attacks. However, it's good practice to ensure any input that dictates file reading cannot escape the `rulesDir`. 
**Fix**: The current implementation is secure within the context of the application since the inputs are controlled, but if `getTemplateContent` ever accepts user-supplied input, a `path.normalize(filePath).startsWith(rulesDir)` check would be prudent. Currently, no action is strictly required.

### 2. Empty File Handling (Logic)
**File**: `src/discovery/discovery.service.ts`
**Issue**: `readIfNonEmpty` returns `null` if the content is entirely whitespace (`content.trim().length === 0`). This elegantly satisfies the PRD requirement that empty project override files should be ignored.

### 3. Asynchronous Execution (Elegance)
**File**: `src/discovery/discovery.service.ts`
**Issue**: `getAvailableArchitectures` checks the `fs.stat` of all standard architectures (`frontend`, `backend`, `fullstack`). Currently, it does this sequentially in a `for...of` loop.
**Fix**: For slightly better performance, these independent disk I/O operations could be executed concurrently using `Promise.all`.
```typescript
const stats = await Promise.allSettled(ALL_ARCHITECTURES.map(arch => 
  fs.stat(path.join(this.rulesDir, arch)).then(stat => ({ arch, isDir: stat.isDirectory() }))
));
// filter results...
```
This is a micro-optimization and not strictly necessary, but it enhances elegance.

### 4. Code Structure (Professionalism)
**File**: `src/discovery/discovery.service.ts`
**Issue**: Using a class (`DiscoveryService`) with dependency injection for `rulesDir` makes the module highly testable. The separation of `public` discovery methods and `private` file-reading helpers is excellent.

## Conclusion for Stage 4
The discovery mechanism is robust and safely handles missing directories (like `rules/fullstack` missing). The logic cleanly implements the business requirements for file discovery and override fallbacks.
