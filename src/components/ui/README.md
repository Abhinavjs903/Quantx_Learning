# Reusable UI Components

A small, reusable UI component library built with **React, TypeScript, and Tailwind CSS** for Next.js applications.

The library provides consistent styling and simple, typed APIs for common interface elements. Components support standard HTML attributes and allow additional Tailwind classes through the `className` prop.

## Components

| Component | Description |
|---|---|
| `Button` | Button with primary, secondary, and ghost variants |
| `Card` | Container for grouping related content |
| `Input` | Styled input field supporting native HTML input attributes |
| `Label` | Form label that can be associated with an input |
| `Dialog` | Controlled modal dialog using the native HTML `<dialog>` element |

## Requirements

- React
- TypeScript
- Tailwind CSS configured in the project
- Next.js for the intended application setup

No additional UI component library is required.

## Installation

Copy the `src/components/ui/` directory into your project's `src/components/ui/` directory.

Import components directly from their respective files:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
```

The `@/` alias assumes your TypeScript configuration maps it to `src/`. Adjust the imports if your project uses a different alias.

## Usage

### 1. Button

The `Button` component supports three variants:

- `primary` — default action style
- `secondary` — alternative action style
- `ghost` — minimal visual style



All standard button attributes are supported, including `onClick`, `disabled`, `type`, and `aria-label`. The default button type is `button`.

### 2. Card

Use `Card` to group related content into a consistent container.



The component accepts standard `div` attributes and custom `className` values.

### 3. Input

The `Input` component provides consistent styling while supporting native HTML input attributes.

Supports attributes such as `type`, `value`, `defaultValue`, `onChange`, `required`, `disabled`, and `placeholder`.

### 4. Label

Use `Label` to provide an accessible label for a form control. Associate it with the input using matching `htmlFor` and `id` values.


### 5. Dialog

The `Dialog` component is a controlled modal. The parent component manages its visibility through the `open` and `onClose` props.

Because it uses React hooks, it must be used within a client component in Next.js.


The dialog supports:

- Controlled visibility through `open`
- Closing through the close button
- Closing with the Escape key
- Closing when clicking the backdrop
- A required `title` for its accessible name
- Custom content through `children`

### Customizing styles

All five components accept a `className` prop, allowing additional Tailwind CSS classes to be applied.

```tsx
<Button className="w-full">Continue</Button>

<Card className="max-w-md">Custom card content</Card>

<Input className="mt-2" placeholder="Username" />
```

The supplied classes are appended to each component's default classes. Conflicting Tailwind utilities may depend on CSS ordering and specificity.

## Project structure

```text
src/
└── components/
    └── ui/
        ├── button.tsx
        ├── card.tsx
        ├── dialog.tsx
        ├── input.tsx
        ├── label.tsx
        └── README.md
```

## Development and verification

Run the following commands from the project root:

```bash
npx tsc --noEmit
npm run build
```

These commands check TypeScript errors and attempt a production build. Resolve any errors before submitting changes.

## Design principles

- **Reusable:** components can be shared across pages and features.
- **Consistent:** common controls use consistent default styling.
- **Typed:** TypeScript provides prop checking and editor support.
- **Composable:** components accept children and standard HTML attributes where appropriate.
- **Customizable:** Tailwind classes can be extended through `className`.

This library is intentionally small and can be extended as the application grows.
