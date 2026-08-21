/**
 * Colour and size, as DATA.
 *
 * A tone is named once here and consumed by name everywhere else, so a component never
 * hand-writes a colour. The alternative is what this repository had until now: the same
 * hover treatment spelled out at eight call sites, one of which had quietly lost its
 * `transition-colors`.
 *
 * Every table is a TOTAL `Record` over its union on purpose. Adding a member to `Tone` is a
 * compile error until every table has an entry for it, which is the point - a tone that
 * exists in one table and not another is a control that renders untinted in one place.
 *
 * The values are token names, never a hex. Landing carries three complete themes
 * (`dark`, `light`, `contrast`) and a literal colour would be right in at most one of them.
 */

/** What a label or a control MEANS. Four, because Landing has four token colours to say it with. */
export type Tone = 'neutral' | 'accent' | 'warning' | 'danger';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

/**
 * Two fills per tone, because a badge needs both and they are not interchangeable.
 *
 * `SOLID` reads as a state the row is IN (published, live, failed); `OUTLINE` reads as a
 * label attached to it (a tag, a language). The dashboard's status badge already used both
 * shapes before either had a name - filled for published, outlined for draft.
 */
export const TONE_SOLID: Record<Tone, string> = {
    neutral: 'bg-elevated text-muted',
    accent: 'bg-accent-soft text-accent',
    warning: 'bg-warm/15 text-warm',
    danger: 'bg-danger/15 text-danger'
};

export const TONE_OUTLINE: Record<Tone, string> = {
    neutral: 'border border-line text-muted',
    accent: 'border border-accent/50 text-accent',
    warning: 'border border-warm/50 text-warm',
    danger: 'border border-danger/50 text-danger'
};

export const BUTTON_VARIANT: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
    secondary: 'border border-line text-ink hover:border-line-strong hover:bg-elevated',
    ghost: 'text-muted hover:bg-elevated hover:text-ink'
};

export const BUTTON_SIZE: Record<ButtonSize, string> = { md: 'h-10 px-4 text-sm', lg: 'h-12 px-6' };

/**
 * The square icon control, by side length.
 *
 * Sizes rather than a free number: the eight hand-written copies this replaces used four
 * different ones (6, 9, 10, 11) and five different radii between them, which is how a header
 * ends up with two buttons that are almost the same shape.
 *
 * `sm` is the in-text affordance (an info toggle beside a label), `md` the standard bar
 * control, `lg` the one a thumb reaches for first - the drawer's close button already used
 * 44px for exactly that reason.
 */
export type IconButtonSize = 'sm' | 'md' | 'lg';

export const ICON_BUTTON_SIZE: Record<IconButtonSize, string> = {
    sm: 'size-6 rounded-md',
    md: 'size-9 rounded-lg',
    lg: 'size-11 rounded-lg'
};
