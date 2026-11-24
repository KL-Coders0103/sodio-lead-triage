# Design System — SODIO Lead Triage

## Visual direction
A crisp, calm operations console: warm off-white backgrounds, deep ink typography, teal brand actions, and indigo AI accents. Semantic priority colors communicate urgency and are not decorative.

## Light theme palette
| Token | Hex | Use |
|---|---|---|
| Ink 950 | `#17212B` | Main text |
| Slate 800 | `#344451` | Secondary headings |
| Teal 700 | `#087E80` | Primary brand/action |
| Teal 600 | `#0B9694` | Hover/active |
| Indigo 600 | `#5365D8` | AI/insight accents |
| Canvas | `#F4F7F6` | App background |
| Surface | `#FFFFFF` | Cards/panels |
| Muted surface | `#EAF1F0` | Quiet areas |
| Border | `#DCE5E3` | Dividers/outlines |
| Muted text | `#65747D` | Secondary labels |

### Semantic colors
| Token | Hex | Meaning |
|---|---|---|
| Hot | `#D94B45` | Urgent lead tier |
| Warm | `#C17A18` | Nurture tier |
| Cold | `#287B9A` | Low urgency tier |
| Success | `#16835D` | Completed/qualified |
| Warning | `#A86C12` | Attention |
| Danger | `#B93832` | Destructive/failed |
| Info | `#3D66B8` | Informational |

Verify foreground/background contrast before release. Always pair color with a text label or icon.

## Typography
Use Inter or Geist-style sans serif. Use tabular numerals for metrics. Suggested scale: display 32–40px, page title 24–30px, section 18–20px, body 14–16px, helper 12–13px.

## Shape and spacing
4px base scale. Controls 36–44px high. Panel radius 12px; control radius 8px; subtle borders and minimal shadow. Maintain readable table density.

## Priority and AI distinctions
HOT/WARM/COLD/UNSCORED are explicit labeled tiers. Priority is not extraction confidence. Use indigo for machine-generated suggestions and teal for human-confirmed values. Show provenance and confidence as accessible text/meter. Unknown confidence is "Not available".

## Components and motion
Buttons/inputs/cards/tables need default, hover, focus-visible, pressed, disabled, loading, invalid, empty, and error states as applicable. Use short transitions and respect reduced motion. Charts require labels, units, non-color differentiation, and a data-table alternative.

## Theme policy
MVP is light theme. A separate dark theme is out of scope until validated as a product requirement.
