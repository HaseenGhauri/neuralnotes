# NeuralNotes 🧠📝

**Next-Generation Note-Taking Application**

A revolutionary note-taking app that combines elegant design with powerful features including **Voice Writing**, **Smart Reminders**, **Spell Checking**, Markdown support, encryption, real-time search, auto-save, and mind-blowing innovations that set it apart from traditional notepads.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow.svg)

---

## 🚀 Features

### Core Functionality ✅

- ✨ **Create, Edit, Delete Notes** - Full CRUD operations with instant updates
- 💾 **Persistent Storage** - All notes saved to localStorage, survive browser restarts
- 🔍 **Real-Time Search** - Instantly find notes by title, content, or tags
- 📅 **Timestamps** - Automatic creation and modification date tracking
- 🏷️ **Tagging System** - Organize notes with custom tags
- ⚡ **Auto-Save** - Configurable auto-save with visual feedback
- 📊 **Statistics Dashboard** - Track total notes and word count

### Advanced Features 🎯

#### 1. **🎤 Voice Writing (Dictation)**

- Hands-free note-taking with voice recognition
- Real-time speech-to-text conversion
- Continuous recording with visual feedback
- Works with any note in any mode
- Click-to-stop recording indicator

#### 2. **⏰ Smart Reminder System**

- Create reminders with custom categories
- 10 category types: Work, Personal, Health, Shopping, Birthday, Recipe, Event, Medication, Exercise, Other
- Date and time scheduling
- Browser notifications when reminders are due
- Auto-grouping: Overdue, Upcoming, Completed
- Sound alerts for due reminders
- Add optional notes to each reminder
- Track reminder history

#### 3. **✓ Spell Checker with Auto-Correct**

- Built-in spell checking for common errors
- Auto-correct mode for instant fixes
- 30+ common misspellings database
- One-click spell check toggle
- Non-intrusive corrections
- Customizable in settings

#### 4. **Markdown Support with Live Preview**

- Full Markdown rendering with marked.js
- Dual-mode editor (Edit/Preview tabs)
- Syntax highlighting for code blocks
- Beautiful typography for headings, quotes, and links
- One-click toggle between plain text and Markdown

#### 4. **Markdown Support with Live Preview**

- Full Markdown rendering with marked.js
- Dual-mode editor (Edit/Preview tabs)
- Syntax highlighting for code blocks
- Beautiful typography for headings, quotes, and links
- One-click toggle between plain text and Markdown

#### 5. **Note Encryption & Security** 🔒

- Password-protect sensitive notes
- SHA-256 encryption using CryptoJS
- Locked notes hidden from view until authenticated
- Visual lock indicators in note list

#### 6. **Smart Word Counter**

- Real-time word and character count
- Floating widget that follows your editing
- Per-note word count tracking
- Aggregate statistics across all notes

#### 7. **Theme System** 🌓

- Gorgeous light and dark themes
- Smooth theme transitions
- Carefully crafted color palettes
- System preference detection

#### 8. **Color-Coded Notes**

- 5 beautiful color themes per note
- Yellow, Blue, Pink, Green, Purple options
- Visual organization at a glance
- Customizable default color in settings

#### 9. **Advanced Export System** 💾

- Export notes as HTML (Markdown) or TXT (Plain)
- Preserve formatting in exports
- One-click download
- Automatic filename from note title

#### 10. **Responsive Design** 📱

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-optimized controls
- Seamless experience across devices

#### 11. **Rich Text Features**

- Beautiful typography with Syne, IBM Plex Mono, and Literata fonts
- Smooth animations and transitions
- Gradient accents and atmospheric backgrounds
- Custom scrollbars and selection colors

---

## 🎨 Design Philosophy

NeuralNotes breaks away from generic note-taking apps with:

- **Editorial Aesthetic**: Inspired by high-end magazines with refined typography
- **Intentional Color**: Bold gradients and carefully chosen accent colors
- **Atmospheric Depth**: Subtle radial gradients create visual interest
- **Micro-Interactions**: Smooth hover effects and state transitions
- **Information Hierarchy**: Clear visual hierarchy guides the user experience

---

## 🛠️ Technology Stack

- **Pure HTML/CSS/JavaScript** - No frameworks, no build process
- **marked.js** - Markdown to HTML conversion
- **CryptoJS** - Note encryption (SHA-256)
- **Web Speech API** - Voice recognition and dictation
- **Notification API** - Browser reminders
- **localStorage** - Client-side persistence
- **CSS Grid & Flexbox** - Modern, responsive layouts
- **CSS Custom Properties** - Dynamic theming system
- **Google Fonts** - Custom typography

---

## 📦 Installation & Usage

### Quick Start

1. **Download** the `neuralnotes.html` file
2. **Open** it in any modern browser (Chrome, Firefox, Safari, Edge)
3. **Start writing!** No installation, no dependencies, no servers

### For Developers

```bash
# Clone the repository
git clone https://github.com/HaseenGhauri/neuralnotes.git

# Navigate to directory
cd neuralnotes

# Open in browser
open neuralnotes.html
```

---

## 💡 How to Use

### Creating Notes

1. Click **"+ New Note"** in the sidebar
2. Start typing your title and content
3. Notes auto-save every 3 seconds (configurable)

### Adding Tags

1. Click in the tag input field below the title
2. Type a tag name and press **Enter**
3. Tags are automatically added to the note
4. Click **×** on any tag to remove it

### Markdown Mode

1. Click **"📝 Markdown"** in the toolbar
2. Write in Markdown syntax
3. Switch between **Edit** and **Preview** tabs
4. Export as HTML to preserve formatting

### Locking Notes

1. Click **"🔒 Lock"** in the toolbar
2. Enter a secure password
3. Note is encrypted and hidden
4. Click the note to unlock with password

### Searching

1. Type in the search box at the top of sidebar
2. Results filter in real-time
3. Searches titles, content, and tags
4. Clear search to see all notes

### Customization

1. Click **⚙️** settings button
2. View note statistics
3. Change default note color
4. Adjust auto-save interval
5. Enable/disable spell check
6. Enable/disable auto-correct
7. Click **"Save Settings"**

### Voice Writing (Dictation)

1. Create or open a note
2. Click **"🎤 Voice"** in the toolbar
3. Start speaking - your words appear in real-time
4. Click the recording indicator or button again to stop
5. Works in both Markdown and plain text modes

### Creating Reminders

1. Click **"⏰ Reminders"** tab in sidebar
2. Click **"+ New Reminder"**
3. Enter reminder details:
   - Title (what to be reminded about)
   - Category (Work, Health, Birthday, Recipe, etc.)
   - Date and time
   - Optional notes
4. Click **"Add Reminder"**
5. Get browser notifications when it's time!

### Managing Reminders

- **View**: Switch to Reminders tab to see all reminders
- **Complete**: Mark reminders as done when finished
- **Delete**: Remove reminders you no longer need
- **Categories**: Reminders are grouped as Overdue, Upcoming, and Completed

### Spell Checking

1. Click **"✓ Spell"** in the toolbar to enable
2. Common misspellings are automatically detected
3. Enable auto-correct in settings for automatic fixes
4. Click button again to disable spell checking

---

## 🎯 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New Note (coming soon) |
| `Ctrl/Cmd + S` | Manual Save (coming soon) |
| `Ctrl/Cmd + F` | Focus Search (coming soon) |
| `Esc` | Close Modals |
| `Enter` (in tag field) | Add Tag |

---

## 🌟 What Makes NeuralNotes Unique?

### 1. **Zero Dependencies**

Single HTML file, works offline, no installation

### 2. **Privacy-First**

All data stays on your device, no servers, no tracking

### 3. **Beautiful by Default**

No configuration needed - gorgeous out of the box

### 4. **Voice-Powered Writing**

Dictate notes hands-free with speech recognition

### 5. **Smart Reminders Built-In**

Never forget important tasks, birthdays, or events

### 6. **Intelligent Spell Checking**

Auto-correct common mistakes as you type

### 7. **Markdown + Plain Text**

Switch modes per-note, not globally

### 8. **Visual Intelligence**

Color coding, timestamps, word counts at a glance

### 9. **Professional Export**

Export as formatted HTML or clean text

### 10. **Encryption Built-In**

Enterprise-grade SHA-256 encryption for sensitive notes

### 11. **Smart Auto-Save**

Visual feedback, configurable interval, never lose work

### 12. **Real-Time Everything**

Search, word count, stats - all update instantly

### 13. **Designer Touch**

Every pixel crafted with care, not auto-generated

---

## 🔧 Configuration

### Auto-Save Interval

Default: 3 seconds
Options: 1s, 3s, 5s, 10s
Location: Settings → Auto-Save Interval

### Default Note Color

Default: Yellow
Options: Yellow, Blue, Pink, Green, Purple
Location: Settings → Default Note Color

### Theme

Default: Light
Options: Light, Dark
Toggle: Click theme button in toolbar

---

## 📊 Data Storage

NeuralNotes uses browser localStorage:

```javascript
// Notes stored at:
localStorage['neuralnotes_data']

// Settings stored at:
localStorage['neuralnotes_settings']
```

### Data Structure

```json
{
  "id": 1234567890,
  "title": "My Note",
  "content": "Note content here",
  "tags": ["work", "important"],
  "created": "2026-02-01T12:00:00.000Z",
  "modified": "2026-02-01T12:30:00.000Z",
  "color": "yellow",
  "markdown": false,
  "locked": false,
  "wordCount": 42
}
```

---

## 🔐 Security Notes

- **Password Storage**: Passwords are hashed with SHA-256, never stored plain-text
- **Encryption**: Note content encrypted when locked
- **Local Only**: All data stays in your browser's localStorage
- **No Tracking**: Zero analytics, no external calls
- **HTTPS Recommended**: Use on HTTPS sites for added security

⚠️ **Important**: localStorage can be cleared by the user or browser. For critical data, maintain backups.

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

**Mobile Browsers**: Fully responsive on iOS Safari, Chrome Android

---

## 🚧 Roadmap

### Planned Features

- [ ] **Cloud Sync** - Optional sync across devices
- [ ] **Collaborative Editing** - Share and edit with others
- [ ] **Rich Media** - Embed images, videos, links
- [ ] **Templates** - Pre-built note templates
- [ ] **AI Assistant** - Smart suggestions and summaries
- [ ] **Version History** - Track changes over time
- [ ] **Import/Export** - Bulk operations, multiple formats
- [ ] **Keyboard Shortcuts** - Full keyboard navigation
- [ ] **Note Linking** - Wiki-style internal links
- [ ] **Categories/Folders** - Hierarchical organization
- [ ] **OCR** - Extract text from images
- [ ] **LaTeX Support** - Mathematical equations
- [ ] **Code Editor** - Enhanced syntax highlighting
- [ ] **Calendar View** - Visual reminder calendar
- [ ] **Recurring Reminders** - Set repeating tasks

### Recently Added ✨

- [x] **Voice Writing** - Dictation and speech-to-text (v1.1)
- [x] **Reminder System** - Full-featured task reminders (v1.1)
- [x] **Spell Checker** - Auto-correct for common mistakes (v1.1)
- [x] **Multiple Categories** - 10 reminder categories (v1.1)
- [x] **Browser Notifications** - Get alerted on time (v1.1)

### UI Enhancements

- [ ] Drag-and-drop note reordering
- [ ] Custom fonts selection
- [ ] More color themes
- [ ] Note templates gallery
- [ ] Full-screen writing mode
- [ ] Split-screen view for multiple notes
- [ ] Presentation mode

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Maintain the single-file architecture
- Keep dependencies minimal
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Update README for new features

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 NeuralNotes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

- **marked.js** - Markdown parsing
- **CryptoJS** - Encryption library
- **Google Fonts** - Typography (Syne, IBM Plex Mono, Literata)
- The open-source community for inspiration

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/HaseenGhauri/neuralnotes/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HaseenGhauri/neuralnotes/discussions)


---

## 💎 Why NeuralNotes?

> "Most note apps are either too simple or overwhelmingly complex. NeuralNotes strikes the perfect balance - powerful features wrapped in beautiful design. It's the note app you'll actually want to use."

### Perfect For:

- 📚 Students taking lecture notes
- 💼 Professionals managing projects
- ✍️ Writers crafting stories
- 🧑‍💻 Developers documenting code
- 🎨 Creatives collecting ideas
- 🧘 Anyone who values their thoughts

---

## 🔔 Permissions & Privacy

NeuralNotes respects your privacy and only requests permissions when you actually use features that need them:

### Microphone Permission 🎤

- **When requested**: When you click the "🎤 Voice" button for the first time
- **Why needed**: To convert your speech to text
- **What happens**: Browser shows a permission dialog asking for microphone access
- **If denied**: You can still use all other features, just not voice input
- **How to enable later**: Click the Voice button again, or change in browser settings

### Notification Permission 🔔  

- **When requested**: When you add your first reminder
- **Why needed**: To alert you when reminders are due
- **What happens**: Browser shows a permission dialog for notifications
- **If denied**: Reminders still work, but you won't get browser popup alerts
- **How to enable later**: Add another reminder, or change in browser settings

### Check Permission Status

- View current permission status in **Settings** (⚙️ button)
- Status indicators show: ✅ Granted, ❌ Denied, or ⏳ Not Set
- All features work without permissions (with graceful degradation)

### Privacy Guarantees

- ✅ Microphone data is **never recorded or stored**
- ✅ Speech recognition happens **in your browser only**
- ✅ Notifications are **local only**, no data sent anywhere
- ✅ All data stays on **your device** in localStorage
- ✅ **Zero tracking**, no analytics, no servers
- ✅ You can revoke permissions anytime in browser settings

---

## 🎉 Get Started Now!

1. Download `neuralnotes.html`
2. Double-click to open in browser
3. Create your first note
4. Experience the difference

**No account. No installation. No complexity. Just pure, beautiful note-taking.**

---

<div align="center">

**Made with ❤️ and JavaScript**

[⭐ Star this repo](https://github.com/HaseenGhauri/neuralnotes) | [🐛 Report Bug](https://github.com/yourusername/neuralnotes/issues) | [💡 Request Feature](https://github.com/HaseenGhauri/neuralnotes/issues)

</div>