# Design criteria for web apps used by adults 80 and older

Reference for the sketch and prototype phases. Compiled 2026-09-13 from
accessibility standards, gerontology and HCI research, and industry usability
studies. Sources are listed at the end; numbers are quoted from them.

## 1. Who we are designing for

The 80+ group is not "seniors, but more so." Impairments that are minorities
at 65 become majorities after 80, and they stack: most users will have two or
three at once.

| Impairment | 65–74 | 75–84 | 85+ |
|---|---|---|---|
| Some hearing loss | 47% (61–80) | | 93% (81+) |
| Severe/profound hearing loss | 20% (61–80) | | 75% (80+) |
| Significant vision loss | 16% | 19% | 46% |
| Dementia | 1.4% (65–69) | | 24% |
| Mild cognitive impairment | ~20% of 70+ | | |
| Arthritis | ≥50% of 65+ | | |
| Essential tremor | up to 20% of 65+ | | |

Source: W3C WAI literature review (see sources). Assume the typical 80+ user
has reduced contrast sensitivity and near focus, hearing loss, slower and
less precise hand movement, and reduced working memory and processing speed.

Attitudes matter as much as abilities. In AARP's 2025 survey, adults 80+ were
the group most likely to say technology "was not designed with them in mind";
only 45% felt they had sufficient skills to use the internet fully, and most
prefer to be "among the last to try" something new. NN/G observed that 45% of
older participants showed hesitance to explore, and that after a failed
first attempt many would not try an alternate path. Usability declines about
0.8% per year of age; older adults were 43% slower than 21–55 year olds on
the same tasks.

What they do value: staying connected with family and friends (texting,
video), managing health and money, and independence. Technology is welcomed
when it is "intuitive, accessible, and socially embedded."

Device context: adoption is high but not universal (78% of 65+ own a
smartphone, 88% use the internet; both lower again for 80+). Tablets are
popular in the 70+ group. Many will use a shared or family-configured device,
often with system font size increased.

## 2. Design criteria

Ordered roughly by how much failure each causes in testing. The first two
are the "golden rules" that appeared in 15+ studies in the JMIR systematic
review: **simplify everything** and **make targets bigger and further
apart**.

### 2.1 Simplify

- **One task per screen, one primary action.** Reduce the number of elements
  and options visible at once. Single-purpose designs were preferred by every
  group in the cognitive-impairment study, including controls aged 78–81.
- **Direct over indirect.** Buttons that do the thing beat menus you cycle
  through. Indirect navigation took much longer and caused errors for
  MCI/dementia participants. Avoid hamburger menus for primary navigation;
  use a persistent, visible set of a few top-level destinations.
- **Linear flows.** Multi-step procedures fail when a step must be
  remembered. If a flow has steps, show progress, keep each step tiny, and
  never require holding information from a previous screen.
- **No time limits and nothing that moves on its own.** Carousels,
  auto-advancing content, animations and toasts that vanish are distractions
  and get missed (WCAG 2.2.1, 2.2.2).

### 2.2 Targets and input

- **Touch targets at least 48×48 CSS px, with visible spacing between them.**
  Bigger than Apple/Google minimums, to absorb tremor and arthritis. Applies
  to links, checkboxes, form fields and icons, not only buttons.
- **Tap only.** Double-tap, long-press, drag, pinch and multi-finger gestures
  all have higher error rates for older adults; drag in particular has a slow
  "calibration" phase at the target. Provide a tap alternative for every
  gesture and never make a gesture the only way to do something.
- **Make interactive things look interactive.** Clear borders, button-shaped
  buttons, obvious contrast between tappable and non-tappable. Older users
  are less familiar with flat-design affordances and cognitive strain makes
  ambiguity worse.
- **Forgiving input.** Accept phone numbers, dates and codes in any
  reasonable format. Use the right on-screen keyboard. Prefer selection over
  typing; prefer large tappable choices over dropdowns.
- **Keyboard and mouse still matter on the web.** Focus states must be
  visible and large. Radio buttons and small checkboxes are hard to hit; make
  the whole row or label the target (WCAG label technique).

### 2.3 Text and visuals

- **Body text 18–20 px minimum; nothing below 16 px anywhere.** Respect the
  user's system/browser font size and stay usable at 200% zoom (WCAG 1.4.4).
  Research recommendations run as high as 30 pt for critical text.
- **Contrast at 7:1 for text (WCAG AAA), 3:1 minimum for UI elements.**
  Contrast sensitivity drops sharply; light grey on white is unreadable.
  Avoid blue/black and blue/purple distinctions, which merge with yellowing
  lenses. Never rely on colour alone.
- **Plain sans-serif, generous line height (1.5+), left-aligned, short line
  length.** No justified or centred body text (WCAG 1.4.8).
- **Icons always with text labels.** Icon-only controls were widely
  misunderstood. Familiar, literal icons only.
- **Calm, high-contrast layout with lots of whitespace.** Dense pages and
  decorative elements read as noise.

### 2.4 Language

- **Plain words, short sentences, one idea per line.** Define or avoid web
  jargon: "website", "URL", "homepage", "browser", "checkout", "HTML" all
  confused NN/G participants. Say "Go back" not "Cancel", "Send" not
  "Submit".
- **Say what will happen.** Button labels that describe the outcome ("Call
  Anna") beat generic ones ("OK", "Continue").
- **Instructions on the screen where they are needed**, not in a tutorial
  the user must remember. Context-sensitive help (WCAG 3.3.5).

### 2.5 Errors and confidence

Fear of "breaking it" is the single biggest behavioural barrier. Participants
with cognitive impairment feared a wrong press would make the screen
disappear "without easy recovery", and stopped using the device
independently.

- **Make mistakes cheap.** Undo everywhere, no destructive action without a
  clear confirm in plain language, and a way back from every screen.
- **Errors in plain language, next to the field, with the fix.** Never a code,
  never at the top of a long page, never red text alone.
- **Never dead-end.** Every screen has an obvious, consistently placed way
  home and back.
- **Consistency.** Same controls in the same place on every screen. Novelty
  costs far more here than elsewhere.

### 2.6 Sound and multimedia

- Audio is never the only channel: 93% of 81+ have some hearing loss.
  Captions and transcripts for video; visual confirmation for every
  audible event.
- No background music behind speech; avoid high-pitched alerts.
- Voice input and voice control were requested by older and cognitively
  impaired participants as easier than fine motor input; worth a sketch, but
  as an addition to, not a replacement for, tap.

### 2.7 Social and caregiver context

- Many 80+ users get set up and supported by a family member. Design the
  "helper" path: easy configuration by someone else, shareable state, and a
  way for a caregiver to see or assist (the geriatric-care review names
  caregiver integration as one of four effective attributes).
- Social connection is the strongest stated motivation. Features that
  connect to real people land better than features about the technology.

## 3. Checklist for sketches

Use this in every sketch doc's section 5.4. A sketch that fails any of these
is probably not worth building.

- [ ] One primary action per screen; ≤ 5 tappable things visible
- [ ] Every target ≥ 48 px with visible gaps
- [ ] Tap-only; no gesture is the sole path
- [ ] Body text ≥ 18 px, works at 200% browser zoom
- [ ] Text contrast ≥ 7:1; nothing conveyed by colour alone
- [ ] Every icon has a text label
- [ ] No web jargon; labels say what happens
- [ ] Undo or back from every screen; destructive actions confirmed
- [ ] Errors are plain, local, and say how to fix
- [ ] Nothing moves, times out, or disappears on its own
- [ ] Anything audible has a visual equivalent
- [ ] A helper/caregiver can set it up or assist

## 4. Testing with this group

From NN/G's guidance on usability testing with older adults:

- Test where they are (home, community centre); short sessions; two or three
  realistic tasks, not a long script.
- Say explicitly that the product is being tested, not them, and build trust
  before starting.
- Provide tasks in writing; allow time for text-size and device setup.
- Watch for abandonment after a first failure, and for what they say they
  are afraid of touching.
- Don't assume uniform ability: recruit across the range, including people
  who use magnifiers, hearing aids, or a family member's help.

## 5. What is thin in the evidence

- Most studies use participants 60–75; explicit 80+ samples are small (NN/G's
  oldest participant was 89; the cognitive-impairment study's controls were
  78–81). Criteria above extrapolate from prevalence data.
- No consensus on exact font size; recommendations range from 10 pt to 30 pt.
  The 18–20 px floor here is a conservative reading.
- Voice control is frequently requested but rarely tested with this group.

## Sources

- W3C WAI, [Developing Websites for Older People: How WCAG 2.0 Applies](https://www.w3.org/WAI/older-users/developing/)
- W3C WAI, [Web Accessibility for Older Users: A Literature Review](https://www.w3.org/WAI/older-users/literature/)
- W3C WAI, [Older Users and Web Accessibility](https://www.w3.org/WAI/older-users)
- Nielsen Norman Group, [Usability for Older Adults: Challenges and Changes](https://www.nngroup.com/articles/usability-for-senior-citizens/)
- Nielsen Norman Group, [Usability for Senior Citizens: Improved, But Still Lacking](https://www.nngroup.com/articles/usability-seniors-improvements/)
- Nielsen Norman Group, [Usability Testing With Older Adults](https://www.nngroup.com/articles/usability-testing-older-adults/)
- Nielsen Norman Group, [Define Techy Words for Older Users](https://www.nngroup.com/articles/define-techy-words-old-users/)
- Nielsen Norman Group, [UX Design for Seniors (report, 87 guidelines)](https://www.nngroup.com/reports/senior-citizens-on-the-web/)
- JMIR mHealth, [Design Guidelines of Mobile Apps for Older Adults: Systematic Review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10557006/)
- IJERPH, [Interface Design for Products for Users with Advanced Age and Cognitive Impairment](https://pmc.ncbi.nlm.nih.gov/articles/PMC8872458/)
- Ine, [The Digital Divide in Geriatric Care: Why Usability, Not Access, is the Real Problem](https://arxiv.org/abs/2601.17012)
- Kurniawan & Zaphiris, [Research-derived web design guidelines for older people](https://dl.acm.org/doi/10.1145/1090785.1090810)
- NIA/NLM, [Making Your Web Site Senior Friendly: A Checklist](https://repository.arizona.edu/handle/10150/106378)
- AARP, [2025 Tech Trends and Older Adults](https://www.aarp.org/pri/topics/technology/internet-media-devices/2025-technology-trends-older-adults/) and Aging and Health Technology Watch, [AARP's 2025 Tech Survey Shines a Light on the 80+ Segment](https://www.ageinplacetech.com/blog/aarp-s-2025-tech-survey-shines-light-80-age-segment)
- Pew Research, [Internet use, smartphone ownership, digital divides in the US](https://www.pewresearch.org/short-reads/2026/01/08/internet-use-smartphone-ownership-digital-divides-in-u-s/)
- Bentley University UXC, [Designing Mobile Experiences with Seniors in Mind](https://www.bentley.edu/centers/user-experience-center/designing-mobile-experiences-seniors-mind)
- ACM IHM, [Drag-and-drop for older adults using touchscreen devices](https://dl.acm.org/doi/10.1145/2670444.2670460)
