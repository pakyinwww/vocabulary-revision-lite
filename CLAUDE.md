# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run build` - Clean and build the extension (production mode)
- `npm run clean` - Remove build directory
- `npm run lint` - Run TSLint on all TypeScript files
- `npm run lint-fix` - Run TSLint with auto-fix

### Testing
- `npm test` - Run Jest tests
- `npm run test-coverage` - Run Jest with coverage reporting

## Architecture Overview

This is a Chrome extension (Manifest V3) for vocabulary learning that integrates with Google Translate. The extension has a multi-component architecture:

### Core Components
- **Background Service Worker** (`background.ts`): Handles extension lifecycle and initializes context menu
- **Context Menu** (`components/menu.ts`): Creates right-click translation menu for selected text
- **Popup Interface** (`components/popup.ts`): Main UI for managing vocabulary lists, import/export functionality
- **Common Library** (`lib/common.ts`): Shared utilities for Chrome storage operations and data management

### Data Flow
1. User selects text and uses context menu to translate
2. Text is saved to Chrome local storage with timestamp, source URL, and language settings
3. Google Translate opens in new tab with selected text
4. Popup interface displays saved vocabulary with management options (delete, export CSV)

### Storage Structure
Chrome local storage contains:
- `config`: Language settings (from/to languages, defaults to en/zh-TW)
- `vocabs`: Object keyed by timestamp containing vocab entries with {vocab, from, to, url}

### Build Process
- TypeScript files compiled via ts-loader
- Webpack bundles `background.ts` and `script.ts` as separate entry points
- Static assets from `src/public/` copied to build directory
- Output directory: `build/`

### Key Extension Permissions
- `contextMenus`: Right-click menu functionality
- `storage`: Local data persistence
- `tabs`: URL access and new tab creation
- `activeTab`: Current page URL retrieval

## Development Notes

### Testing Setup
- Jest with jsdom environment for DOM testing
- Chrome extension APIs mocked via jest-chrome
- Tests located in `src/__tests__/`

### Language Configuration
- Default translation: English to Traditional Chinese (zh-TW)
- Configuration persisted in Chrome storage
- Language selection available in popup interface