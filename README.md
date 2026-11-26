# Astrolabe

A Chrome extension for birth charts and relationship astrology. You keep profiles for the people in your life, see each person's tropical and sidereal natal chart, compare any two people by life area, and ask Claude about placements and compatibility.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and pick this `astrolabe` folder.
3. Click the Astrolabe toolbar icon. The app opens in its own tab.

## Screens

- **☀ Today:**
  - The Moon's phase and mood, and your personal day number.
  - The Human Design "weather": the gates the Sun is activating today.
  - The planets touching your chart now, split into this week and the bigger chapter, with exact dates.
  - Retrograde alerts, upcoming new and full moons, retrograde stations, and your big dates for the next 12 months.
  - A one-line forecast for everyone in your list.
- **Morning notification:** optional. Turn it on and pick a time and people in Settings. The journal reminder is set up in the same place. The app prepares 14 days of forecasts whenever it's open.
- **⟶ Life timeline:** numerology chapters, Vedic dasha periods, and turning points such as Jupiter and Saturn returns, Saturn and Uranus oppositions, the Neptune square and nodal returns. A "now" marker shows where you are.
- **⁂ Group & family:** a color grid of compatibility for every pair (all systems combined, or astrology, numerology or Human Design alone), the easiest and hardest pairs, each person's role in the group, the group's element balance and Human Design mix, and an AI group reading.
- **✎ Journal:** a mood diary in the style of the Daylio app.
  - **Logging:** two-tap entries with five colored moods (rad to awful), activity tags in groups, your own custom activities and an optional note. Several entries per day are allowed, and entries can be edited.
  - **Sky context:** the app records the Moon's sign and phase, your strongest transit and your numerology day with each entry.
  - **Tabs:** an entries timeline; a month calendar plus "Year in Pixels"; and stats. The stats show your mood over 30 days, a count of each mood, your streaks, how much each activity lifts or lowers your mood, and your mood by Moon sign, Moon phase and personal day.
  - **Daily reminder:** optional, and skipped on days you've already logged.
  - **AI:** Claude reads the entries and stats, and the **Find patterns** button asks it to connect them.
- **☾ Dreams:** a dream journal with interpretation.
  - **Recording:** a title, the dream itself, how it felt (14 feelings), lucid / nightmare / recurring flags, clarity, and an optional note on what's going on in your life.
  - **Symbols:** about 60 common dream symbols (water, falling, teeth, a house, being chased…) are spotted as you type. Each comes with its usual meaning in dream psychology and its link in astrology. A searchable dictionary sits in the Symbols tab, with your most frequent symbols on top.
  - **The sky that night:** each dream records the Moon's sign, phase and the house of your chart it was in around 3 a.m., whether it was near your lunar return, your strongest transits and your numerology day.
  - **Your dream chart:** a dream-sensitivity score and the placements behind it (the Moon, Neptune, the 12th house, Pisces and the water element), plus how your Moon sign tends to dream.
  - **Dreams & the Moon:** how many dreams you remember by Moon phase and sign, and the mix of lucid dreams and nightmares.
  - **AI:** **Interpret this dream** streams a personal reading from Claude that uses the dream, your feelings, your life context, your birth chart and the sky that night. It's saved with the dream, can be read aloud, and **Keep talking about it** continues it in the chat. **Find dream patterns** looks across all your dreams. Claude also sees your recent dreams in every chat.
- **🔊 Read aloud:**
  - **Where:** a **Read this page** button at the top of every screen, plus **Listen** on every Claude answer and saved reading.
  - **Player:** a bar with pause, previous/next, stop and voice. The part being read is highlighted and scrolled into view.
  - **Voice settings:** the ⚙ next to "Read this page", or "Voice settings" in the player, tunes speed (0.5–2×), pitch, volume and voice, with a test button. The same controls are under Settings → Voice & reading.
  - **Auto-read:** an optional toggle in the chat reads Claude's answers as soon as they finish.
  - **Voices:** Chrome's and macOS's own voices, so it's free, private and works offline. Esc stops it.
- **🎤 Voice typing:** every text box (journal notes, dreams, the chat, person notes) has a mic button. Tap it and speak; the words appear as you talk. It keeps listening through pauses until you tap it again or press Esc. If Chrome refuses the microphone, a message says why.
  - **Punctuation:** say "period", "comma", "question mark", "exclamation mark", "new line" or "new paragraph".
  - **Language:** Settings → Voice & reading → Voice typing (defaults to the browser's language).
  - **Privacy:** when the browser offers on-device recognition (newer Chrome), speech stays on your computer; otherwise Chrome uses Google's speech service, which needs internet. The first time, the browser asks to allow the microphone.
  - **Brave and other Chromium browsers** don't include Google's speech service. The 🎤 button then explains how to use the Mac's own dictation instead (press the 🌐 fn key twice in any text box), or to load Astrolabe in Chrome.
- **⇩ Reports:** on Birth chart, Compatibility and Group, prints a clean light-theme report. Choose "Save as PDF" in the print dialog to keep it.
- **Extras:**
  - **Chinese zodiac:** the animal and element based on the exact lunar new year date, plus Chinese compatibility for couples.
  - **Gene Keys:** your four prime gifts, each shown as shadow → gift → siddhi.
  - **Unknown birth time:** the possible rising sign for each time of day, whether the Moon changed sign that day, and which parts of the Human Design chart are certain.

## Made for beginners

Every screen assumes the reader knows nothing about astrology, numerology or Human Design:
- **A "New to this?" guide** at the top of each screen. You can collapse it, and the app remembers.
- **Plain-language summaries:** the big three in everyday words, a short version of each compatibility reading, and your Human Design in five simple points.
- **Plain explanations** for every planet, link, center and number, plus **?** tooltips on any remaining jargon.
- **Visuals:** a diagram of how a birth chart works, an element donut, a radar chart of life areas, numerology math worked step by step, a 9-year cycle ring, a map of the five Human Design types, and a bodygraph legend.
- **Technical details** such as exact degrees and full aspect tables sit in collapsible sections.

## Numerology

The **№ Numerology** view has a toggle at the top between **Pythagorean** and **Chaldean**. It shows:
- **Core numbers:** Life Path, Expression, Soul Urge, Personality, Birthday and Maturity. Each comes with its meaning, master numbers (11, 22, 33) and any karmic debt (13, 14, 16, 19).
- **Current cycles:** your Personal Year, Month and Day.
- **Pinnacles and challenges,** with the age range for each and the one you're in now.
- **A name chart:** each letter's value, the hidden passion and the karmic lessons.

For accurate name numbers, add each person's **full birth name** when you edit them. Without it, the app falls back to their display name.

The Compatibility screen compares two people's Life Path, Soul Urge, Expression and Personality numbers and their current personal years. Claude sees everyone's numerology, so you can ask about it in chat.

## Human Design

The **⬡ Human Design** view shows a full bodygraph. It covers all 9 centers, all 36 channels and all 64 gates, with activated gates highlighted. Beside the bodygraph are the Design activations (unconscious, red) and the Personality activations (conscious).

The view lists:
- **The essentials:** type, strategy, inner authority, profile, definition, signature, not-self theme, aura and incarnation cross.
- **A card for each center,** saying whether it's defined or open and what that means.
- **Each defined channel,** with its meaning.
- **Every activated gate,** with its name and the planets that activate it.

The chart uses the tropical zodiac and the true node. The Design moment is when the Sun was exactly 88° of arc before its birth position. Human Design needs an accurate birth time.

The Compatibility screen adds a **connection chart**: a combined bodygraph and the composite (for example 7-2). It also lists the electromagnetic (attraction), companionship, compromise and dominance channels between the two people. Claude sees all of this in chat.

## Settings and config

You can open the settings page three ways:
- **⚙ Settings & config** at the bottom of the app's sidebar.
- Right-click the toolbar icon and choose **Options**.
- Open `chrome://extensions`, then go to Astrolabe → Details → Extension options.

The settings page is where you save:
- **Your Anthropic API key**, the model and the reading depth.
- **Chart defaults:** zodiac, ayanamsa, the house systems for tropical and sidereal, and the numerology system.
- **A config file.** **Save config to file…** downloads a JSON backup. The API key and your data (people, conversations, journal, dreams and saved readings) are each optional in that file. **Load config from file…** restores a backup. It merges the data without duplicates, and it keeps your current API key if the file doesn't include one.

Everything is stored locally in Chrome's extension storage. The API key is only ever sent to api.anthropic.com.

## Files

- `manifest.json`: the extension manifest (MV3).
- `background.js`: opens the app tab when you click the icon. It also makes API requests look like a plain client rather than a browser.
- `app.html`, `styles.css`, `app.js`: the app. `app.js` is one readable bundle that holds the chart engine, synastry, the Claude chat and the UI.
- `options.html`, `options.js`: the settings and config page.
- `icons/`: the extension icons.

Planet positions are computed with astronomy-engine, which is bundled into `app.js` and accurate to the arcsecond. Place search uses Open-Meteo's free geocoding API, and only the city name you type is sent to it.
