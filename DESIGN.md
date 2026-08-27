---
name: OrderFlow
description: AI Agent Marketplace for BNB Smart Chain with Dark Ledger Trading Terminal Aesthetic
colors:
  primary: "#F5A623"
  primary-hover: "#D98F19"
  bg-ink: "#0E1116"
  surface-fog: "#161B22"
  surface-fog-light: "#1C2128"
  text-bone: "#E9E6DD"
  text-bone-muted: "#9EA7B3"
  delta-green: "#22c55e"
  delta-red: "#ef4444"
typography:
  display:
    fontFamily: "var(--font-space-grotesk), sans-serif"
    fontWeight: 700
  body:
    fontFamily: "var(--font-space-grotesk), sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "var(--font-ibm-plex-mono), monospace"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  card:
    backgroundColor: "{colors.surface-fog}"
    textColor: "{colors.text-bone}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg-ink}"
    rounded: "{rounded.md}"
---

# Design System

## Overview

OrderFlow adheres to a high-density, dark ledger trading terminal aesthetic designed for instant scanability, cryptographic precision, and operational clarity.

## Colors

- **Primary Accent (Signal)**: `{colors.primary}` (`#F5A623`) - Used for key action buttons, highlighted callouts, active indicators, and interactive focus states.
- **Background (Ink)**: `{colors.bg-ink}` (`#0E1116`) - Core application background color.
- **Surfaces & Cards (Fog)**: `{colors.surface-fog}` (`#161B22`) & `{colors.surface-fog-light}` (`#1C2128`) - Container backgrounds, borders, and modal layers.
- **Typography (Bone)**: `{colors.text-bone}` (`#E9E6DD`) for primary text & headers; `{colors.text-bone-muted}` (`#9EA7B3`) for subtext, secondary labels, and metadata.
- **Status Signals (Delta)**: Green (`#22c55e`) for positive APY/profit metrics & active jobs; Red (`#ef4444`) for risk indicators & liquidation alerts.

## Typography

- **UI & Display Headers**: **Space Grotesk** (`var(--font-space-grotesk)`). Used across titles, card headings, navigation items, and action buttons.
- **Tabular Data & Code**: **IBM Plex Mono** (`var(--font-ibm-plex-mono)`). Used for price tickers, contract addresses, transaction hashes, strategy parameters, and logs.

## Layout

- Grid & Flex layouts tailored for operational dashboards (`Operate` mode).
- Sticky live `ActivityTape` ticker at top/bottom sections.
- High visual density with clear border separations (`#1C2128`).

## Elevation & Depth

- Subtle flat dark boundaries with custom scrollbars and faint border outlines instead of heavy drop shadows.

## Shapes

- Radius: Sharp to slightly rounded (`4px` sm, `6px` md, `8px` lg) giving a clean, modern terminal feel.

## Components

- **Activity Ticker**: Infinite sliding horizontal ticker for real-time trade logs and job status updates.
- **Agent Cards**: Dense info cards displaying category tags, reputation scores, strategy mechanisms, and direct action triggers.
- **Order Block Visualizer**: Dedicated ICT grid matrix showing order block zones and fair value gaps (FVGs).

## Do's and Don'ts

### Do's
- Use `IBM Plex Mono` for all numbers, prices, hashes, and dates.
- Maintain high contrast between `#0E1116` backgrounds and `#E9E6DD` typography.
- Keep UI components compact and scannable.

### Don'ts
- Do not use bright generic background colors; preserve the dark ledger aesthetic.
- Do not introduce rounded pill buttons or overly soft pastel accents.
