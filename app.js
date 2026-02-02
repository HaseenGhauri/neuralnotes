    
        // Constants and State
        const STORAGE_KEY = 'neuralnotes_data';
        const SETTINGS_KEY = 'neuralnotes_settings';
        const REMINDERS_KEY = 'neuralnotes_reminders';
        let notes = [];
        let reminders = [];
        let currentNoteId = null;
        let autoSaveTimer = null;
        let reminderCheckInterval = null;
        let recognition = null;
        let isRecording = false;
        let spellCheckEnabled = false;
        let currentSidebarTab = 'notes';
        let settings = {
            theme: 'light',
            defaultColor: 'yellow',
            autoSaveInterval: 3000,
            spellCheck: true,
            autoCorrect: false
        };

        // Color themes for notes
        const noteColors = {
            yellow: '--note-yellow',
            blue: '--note-blue',
            pink: '--note-pink',
            green: '--note-green',
            purple: '--note-purple'
        };

        // Initialize App
        function init() {
            loadSettings();
            loadNotes();
            loadReminders();
            setupEventListeners();
            setupVoiceRecognition();
            renderNotesList();
            startReminderChecker();
            
            // Show welcome guide on first visit
            const hasSeenWelcome = localStorage.getItem('neuralnotes_welcome_seen');
            if (!hasSeenWelcome) {
                setTimeout(() => {
                    document.getElementById('welcomeModal').classList.add('active');
                }, 500);
            }
            
            if (notes.length === 0) {
                showEmptyState();
            } else {
                selectNote(notes[0].id);
            }
        }

        // Close Welcome Modal
        function closeWelcome() {
            localStorage.setItem('neuralnotes_welcome_seen', 'true');
            closeModal('welcomeModal');
        }

        // Show Welcome Modal (from help button)
        function showWelcome() {
            document.getElementById('welcomeModal').classList.add('active');
        }

        // Load Settings
        function loadSettings() {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) {
                settings = { ...settings, ...JSON.parse(saved) };
                document.body.setAttribute('data-theme', settings.theme);
            }
        }

        // Save Settings
        function saveSettings() {
            settings.autoSaveInterval = parseInt(document.getElementById('autoSaveInterval').value);
            settings.spellCheck = document.getElementById('spellCheckSetting').checked;
            settings.autoCorrect = document.getElementById('autoCorrectSetting').checked;
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            closeModal('settingsModal');
            showNotification('Settings saved!', 'success');
        }

        // Load Notes
        function loadNotes() {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                notes = JSON.parse(saved);
            }
        }

        // Save Notes
        function saveNotes() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        }

        // Setup Event Listeners
        function setupEventListeners() {
            document.getElementById('newNoteBtn').addEventListener('click', createNewNote);
            document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);
            document.getElementById('settingsBtn').addEventListener('click', () => openModal('settingsModal'));
            document.getElementById('themeToggle').addEventListener('click', toggleTheme);
            document.getElementById('markdownToggle').addEventListener('click', toggleMarkdownMode);
            document.getElementById('deleteBtn').addEventListener('click', deleteCurrentNote);
            document.getElementById('exportBtn').addEventListener('click', exportNote);
            document.getElementById('lockBtn').addEventListener('click', () => openModal('lockModal'));
            document.getElementById('lockConfirmBtn').addEventListener('click', lockNote);
            document.getElementById('searchInput').addEventListener('input', handleSearch);
            document.getElementById('voiceBtn').addEventListener('click', toggleVoiceRecording);
            document.getElementById('spellCheckBtn').addEventListener('click', toggleSpellCheck);
            document.getElementById('reminderBtn').addEventListener('click', () => openModal('reminderModal'));

            // Setup color options
            const colorOptions = document.getElementById('colorOptions');
            Object.keys(noteColors).forEach(color => {
                const option = document.createElement('div');
                option.className = 'color-option';
                option.style.background = `var(${noteColors[color]})`;
                option.onclick = () => {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                    settings.defaultColor = color;
                };
                if (color === settings.defaultColor) {
                    option.classList.add('selected');
                }
                colorOptions.appendChild(option);
            });
        }

        // Create New Note
        function createNewNote() {
            const note = {
                id: Date.now(),
                title: 'Untitled Note',
                content: '',
                tags: [],
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                color: settings.defaultColor,
                markdown: false,
                locked: false,
                wordCount: 0
            };
            notes.unshift(note);
            saveNotes();
            renderNotesList();
            selectNote(note.id);
            showNotification('New note created!', 'success');
        }

        // Select Note
        function selectNote(noteId) {
            const note = notes.find(n => n.id === noteId);
            if (!note) return;

            if (note.locked) {
                promptUnlock(noteId);
                return;
            }

            currentNoteId = noteId;
            renderEditor(note);
            updateActiveNote();
            
            // Clear any existing auto-save timer
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
        }

        // Render Editor
        function renderEditor(note) {
            const container = document.getElementById('editorContainer');
            const isMarkdown = note.markdown;
            
            container.innerHTML = `
                <input 
                    type="text" 
                    class="note-title-input" 
                    id="noteTitle" 
                    value="${note.title}" 
                    placeholder="Untitled Note"
                />
                
                <div class="note-meta">
                    <span>📅 Created: ${new Date(note.created).toLocaleDateString()}</span>
                    <span>✏️ Modified: ${new Date(note.modified).toLocaleTimeString()}</span>
                </div>

                <div class="tags-input-container">
                    <div class="tags-input" id="tagsInput">
                        ${note.tags.map(tag => `
                            <div class="tag-item">
                                ${tag}
                                <button onclick="removeTag('${tag}')">×</button>
                            </div>
                        `).join('')}
                        <input 
                            type="text" 
                            id="tagInput" 
                            placeholder="Add tags (press Enter)..." 
                        />
                    </div>
                </div>

                ${isMarkdown ? `
                    <div class="editor-tabs">
                        <div class="editor-tab active" onclick="switchTab('edit')">Edit</div>
                        <div class="editor-tab" onclick="switchTab('preview')">Preview</div>
                    </div>
                ` : ''}

                <textarea 
                    class="note-content-input" 
                    id="noteContent" 
                    placeholder="Start writing..."
                    style="display: ${isMarkdown ? 'block' : 'block'};"
                >${note.content}</textarea>

                ${isMarkdown ? `
                    <div class="markdown-preview" id="markdownPreview" style="display: none;">
                        ${marked.parse(note.content || '')}
                    </div>
                ` : ''}
            `;

            // Add event listeners
            document.getElementById('noteTitle').addEventListener('input', handleTitleChange);
            document.getElementById('noteContent').addEventListener('input', handleContentChange);
            document.getElementById('tagInput').addEventListener('keypress', handleTagInput);

            // Show word count
            document.getElementById('wordCount').style.display = 'block';
            updateWordCount(note.content);
        }

        // Handle Title Change
        function handleTitleChange(e) {
            const note = notes.find(n => n.id === currentNoteId);
            if (note) {
                note.title = e.target.value || 'Untitled Note';
                note.modified = new Date().toISOString();
                scheduleAutoSave();
            }
        }

        // Handle Content Change
        function handleContentChange(e) {
            const note = notes.find(n => n.id === currentNoteId);
            if (note) {
                note.content = e.target.value;
                note.modified = new Date().toISOString();
                note.wordCount = countWords(e.target.value);
                updateWordCount(e.target.value);
                scheduleAutoSave();

                // Update markdown preview if in markdown mode
                if (note.markdown) {
                    const preview = document.getElementById('markdownPreview');
                    if (preview && preview.style.display !== 'none') {
                        preview.innerHTML = marked.parse(e.target.value || '');
                    }
                }
            }
        }

        // Handle Tag Input
        function handleTagInput(e) {
            if (e.key === 'Enter' && e.target.value.trim()) {
                const note = notes.find(n => n.id === currentNoteId);
                if (note) {
                    const tag = e.target.value.trim().toLowerCase();
                    if (!note.tags.includes(tag)) {
                        note.tags.push(tag);
                        saveNotes();
                        selectNote(currentNoteId); // Re-render
                        renderNotesList();
                    }
                }
                e.target.value = '';
            }
        }

        // Remove Tag
        function removeTag(tag) {
            const note = notes.find(n => n.id === currentNoteId);
            if (note) {
                note.tags = note.tags.filter(t => t !== tag);
                saveNotes();
                selectNote(currentNoteId);
                renderNotesList();
            }
        }

        // Schedule Auto Save
        function scheduleAutoSave() {
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
            
            autoSaveTimer = setTimeout(() => {
                saveNotes();
                renderNotesList();
                document.getElementById('noteStatus').textContent = 'Saved ✓';
                setTimeout(() => {
                    document.getElementById('noteStatus').textContent = 'Ready';
                }, 2000);
            }, settings.autoSaveInterval);

            document.getElementById('noteStatus').textContent = 'Editing...';
        }

        // Render Notes List
        function renderNotesList() {
            const container = document.getElementById('notesList');
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            
            let filteredNotes = notes;
            if (searchTerm) {
                filteredNotes = notes.filter(note => 
                    note.title.toLowerCase().includes(searchTerm) ||
                    note.content.toLowerCase().includes(searchTerm) ||
                    note.tags.some(tag => tag.includes(searchTerm))
                );
            }

            if (filteredNotes.length === 0) {
                container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-tertiary);">No notes found</div>';
                return;
            }

            container.innerHTML = filteredNotes.map(note => `
                <div class="note-item ${note.id === currentNoteId ? 'active' : ''}" onclick="selectNote(${note.id})" data-id="${note.id}">
                    <div class="note-item-header">
                        <div style="flex: 1;">
                            <div class="note-item-title">${note.locked ? '🔒 ' : ''}${note.title}</div>
                            <div class="note-item-date">${new Date(note.created).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="note-item-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
                    ${note.tags.length > 0 ? `
                        <div class="note-tags">
                            ${note.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('');

            updateStats();
        }

        // Update Active Note
        function updateActiveNote() {
            document.querySelectorAll('.note-item').forEach(item => {
                item.classList.toggle('active', parseInt(item.dataset.id) === currentNoteId);
            });
        }

        // Show Empty State
        function showEmptyState() {
            const container = document.getElementById('editorContainer');
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h2>Welcome to NeuralNotes</h2>
                    <p>Create your first note to get started</p>
                    <button class="btn btn-primary" onclick="createNewNote()">Create Note</button>
                </div>
            `;
        }

        // Toggle Sidebar
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('hidden');
                mainContent.classList.toggle('expanded');
            }
        }

        // Toggle Theme
        function toggleTheme() {
            settings.theme = settings.theme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', settings.theme);
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            showNotification(`${settings.theme === 'light' ? '☀️' : '🌙'} ${settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)} mode activated`, 'success');
        }

        // Toggle Markdown Mode
        function toggleMarkdownMode() {
            const note = notes.find(n => n.id === currentNoteId);
            if (!note) return;

            note.markdown = !note.markdown;
            saveNotes();
            selectNote(currentNoteId);
            
            const btn = document.getElementById('markdownToggle');
            btn.classList.toggle('active', note.markdown);
            showNotification(`Markdown mode ${note.markdown ? 'enabled' : 'disabled'}`, 'success');
        }

        // Switch Tab (Markdown)
        function switchTab(tab) {
            const editTab = document.querySelector('.editor-tab:nth-child(1)');
            const previewTab = document.querySelector('.editor-tab:nth-child(2)');
            const editor = document.getElementById('noteContent');
            const preview = document.getElementById('markdownPreview');

            if (tab === 'edit') {
                editTab.classList.add('active');
                previewTab.classList.remove('active');
                editor.style.display = 'block';
                preview.style.display = 'none';
            } else {
                editTab.classList.remove('active');
                previewTab.classList.add('active');
                editor.style.display = 'none';
                preview.style.display = 'block';
                
                const note = notes.find(n => n.id === currentNoteId);
                if (note) {
                    preview.innerHTML = marked.parse(note.content || '');
                }
            }
        }

        // Delete Current Note
        function deleteCurrentNote() {
            if (!currentNoteId) return;
            
            if (confirm('Are you sure you want to delete this note?')) {
                notes = notes.filter(n => n.id !== currentNoteId);
                saveNotes();
                renderNotesList();
                
                if (notes.length > 0) {
                    selectNote(notes[0].id);
                } else {
                    currentNoteId = null;
                    showEmptyState();
                }
                
                showNotification('Note deleted', 'success');
            }
        }

        // Export Note
        function exportNote() {
            const note = notes.find(n => n.id === currentNoteId);
            if (!note) return;

            const content = note.markdown ? marked.parse(note.content) : note.content;
            const blob = new Blob([content], { type: note.markdown ? 'text/html' : 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${note.title}.${note.markdown ? 'html' : 'txt'}`;
            a.click();
            URL.revokeObjectURL(url);
            
            showNotification('Note exported!', 'success');
        }

        // Lock Note
        function lockNote() {
            const password = document.getElementById('lockPassword').value;
            if (!password) {
                showNotification('Please enter a password', 'error');
                return;
            }

            const note = notes.find(n => n.id === currentNoteId);
            if (note) {
                note.locked = true;
                note.password = CryptoJS.SHA256(password).toString();
                saveNotes();
                renderNotesList();
                closeModal('lockModal');
                showNotification('Note locked successfully', 'success');
                showEmptyState();
            }
        }

        // Prompt Unlock
        function promptUnlock(noteId) {
            const password = prompt('Enter password to unlock:');
            if (!password) return;

            const note = notes.find(n => n.id === noteId);
            if (note && CryptoJS.SHA256(password).toString() === note.password) {
                note.locked = false;
                delete note.password;
                saveNotes();
                renderNotesList();
                selectNote(noteId);
                showNotification('Note unlocked!', 'success');
            } else {
                showNotification('Incorrect password', 'error');
            }
        }

        // Handle Search
        function handleSearch() {
            renderNotesList();
        }

        // Update Word Count
        function updateWordCount(text) {
            const words = countWords(text);
            const chars = text.length;
            document.getElementById('wordCountValue').textContent = words;
            document.getElementById('charCountValue').textContent = chars;
        }

        // Count Words
        function countWords(text) {
            return text.trim().split(/\s+/).filter(word => word.length > 0).length;
        }

        // Update Stats
        function updateStats() {
            const totalWords = notes.reduce((sum, note) => sum + note.wordCount, 0);
            document.getElementById('totalNotes').textContent = notes.length;
            document.getElementById('totalWords').textContent = totalWords;
        }

        // Modal Functions
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
            updateStats();
            
            // Populate settings if opening settings modal
            if (modalId === 'settingsModal') {
                document.getElementById('autoSaveInterval').value = settings.autoSaveInterval;
                document.getElementById('spellCheckSetting').checked = settings.spellCheck;
                document.getElementById('autoCorrectSetting').checked = settings.autoCorrect;
                updatePermissionStatus();
            }
        }

        // Update Permission Status Display
        function updatePermissionStatus() {
            // Check notification permission
            if ('Notification' in window) {
                const notifStatus = Notification.permission;
                const notifEl = document.getElementById('notifPermission');
                if (notifStatus === 'granted') {
                    notifEl.textContent = '✅ Granted';
                    notifEl.style.color = 'var(--success)';
                } else if (notifStatus === 'denied') {
                    notifEl.textContent = '❌ Denied';
                    notifEl.style.color = 'var(--danger)';
                } else {
                    notifEl.textContent = '⏳ Not Set';
                    notifEl.style.color = 'var(--warning)';
                }
            } else {
                document.getElementById('notifPermission').textContent = '❌ Not Supported';
                document.getElementById('notifPermission').style.color = 'var(--text-tertiary)';
            }

            // Check microphone permission
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.permissions.query({ name: 'microphone' }).then(result => {
                    const micEl = document.getElementById('micPermission');
                    if (result.state === 'granted') {
                        micEl.textContent = '✅ Granted';
                        micEl.style.color = 'var(--success)';
                    } else if (result.state === 'denied') {
                        micEl.textContent = '❌ Denied';
                        micEl.style.color = 'var(--danger)';
                    } else {
                        micEl.textContent = '⏳ Not Set';
                        micEl.style.color = 'var(--warning)';
                    }
                }).catch(() => {
                    document.getElementById('micPermission').textContent = '⏳ Not Set';
                    document.getElementById('micPermission').style.color = 'var(--warning)';
                });
            } else {
                document.getElementById('micPermission').textContent = '❌ Not Supported';
                document.getElementById('micPermission').style.color = 'var(--text-tertiary)';
            }
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Show Notification
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--accent-secondary)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // ==================== REMINDER SYSTEM ====================

        // Load Reminders
        function loadReminders() {
            const saved = localStorage.getItem(REMINDERS_KEY);
            if (saved) {
                reminders = JSON.parse(saved);
            }
        }

        // Save Reminders
        function saveReminders() {
            localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
        }

        // Switch Sidebar Tab
        function switchSidebarTab(tab) {
            currentSidebarTab = tab;
            document.getElementById('notesTab').classList.toggle('active', tab === 'notes');
            document.getElementById('remindersTab').classList.toggle('active', tab === 'reminders');
            document.getElementById('notesList').style.display = tab === 'notes' ? 'block' : 'none';
            document.getElementById('remindersList').style.display = tab === 'reminders' ? 'block' : 'none';
            
            if (tab === 'reminders') {
                renderRemindersList();
                document.getElementById('newNoteBtn').textContent = '+ New Reminder';
                document.getElementById('newNoteBtn').onclick = () => openModal('reminderModal');
            } else {
                renderNotesList();
                document.getElementById('newNoteBtn').textContent = '+ New Note';
                document.getElementById('newNoteBtn').onclick = createNewNote;
            }
        }

        // Save Reminder
        function saveReminder() {
            const title = document.getElementById('reminderTitle').value.trim();
            const category = document.getElementById('reminderCategory').value;
            const date = document.getElementById('reminderDate').value;
            const time = document.getElementById('reminderTime').value;
            const notes = document.getElementById('reminderNotes').value.trim();

            if (!title) {
                showNotification('Please enter a reminder title', 'error');
                return;
            }

            if (!date || !time) {
                showNotification('Please select date and time', 'error');
                return;
            }

            const reminder = {
                id: Date.now(),
                title,
                category,
                datetime: `${date}T${time}`,
                notes,
                created: new Date().toISOString(),
                completed: false
            };

            reminders.unshift(reminder);
            saveReminders();
            renderRemindersList();
            closeModal('reminderModal');
            
            // Clear form
            document.getElementById('reminderTitle').value = '';
            document.getElementById('reminderNotes').value = '';
            document.getElementById('reminderDate').value = '';
            document.getElementById('reminderTime').value = '';
            
            showNotification('Reminder added successfully!', 'success');
            
            // Request notification permission when user adds a reminder
            if ('Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            showNotification('Notification permission granted! You will be alerted when reminders are due.', 'success');
                        } else if (permission === 'denied') {
                            showNotification('Notification permission denied. You won\'t receive browser alerts for reminders.', 'warning');
                        }
                    });
                } else if (Notification.permission === 'denied') {
                    showNotification('Reminder saved! Note: Browser notifications are disabled. Enable them in your browser settings to get alerts.', 'warning');
                }
            }
        }

        // Render Reminders List
        function renderRemindersList() {
            const container = document.getElementById('remindersList');
            
            if (reminders.length === 0) {
                container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-tertiary);">No reminders yet<br><br>Click "+ New Reminder" to add one</div>';
                return;
            }

            // Sort reminders by date
            const sortedReminders = [...reminders].sort((a, b) => 
                new Date(a.datetime) - new Date(b.datetime)
            );

            // Group by status
            const now = new Date();
            const active = sortedReminders.filter(r => !r.completed && new Date(r.datetime) > now);
            const overdue = sortedReminders.filter(r => !r.completed && new Date(r.datetime) <= now);
            const completed = sortedReminders.filter(r => r.completed);

            let html = '';

            if (overdue.length > 0) {
                html += `<div class="reminder-section">
                    <div class="reminder-section-title">
                        ⚠️ Overdue <span class="reminder-count">${overdue.length}</span>
                    </div>
                    ${overdue.map(r => renderReminderCard(r, 'overdue')).join('')}
                </div>`;
            }

            if (active.length > 0) {
                html += `<div class="reminder-section">
                    <div class="reminder-section-title">
                        📅 Upcoming <span class="reminder-count">${active.length}</span>
                    </div>
                    ${active.map(r => renderReminderCard(r, 'upcoming')).join('')}
                </div>`;
            }

            if (completed.length > 0) {
                html += `<div class="reminder-section">
                    <div class="reminder-section-title">
                        ✅ Completed <span class="reminder-count">${completed.length}</span>
                    </div>
                    ${completed.map(r => renderReminderCard(r, 'completed')).join('')}
                </div>`;
            }

            container.innerHTML = html;
        }

        // Render Single Reminder Card
        function renderReminderCard(reminder, status) {
            const categoryIcons = {
                work: '🏢',
                personal: '👤',
                health: '💪',
                shopping: '🛒',
                birthday: '🎂',
                recipe: '🍳',
                event: '📅',
                medication: '💊',
                exercise: '🏃',
                other: '📌'
            };

            const datetime = new Date(reminder.datetime);
            const now = new Date();
            const diffMs = datetime - now;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            let timeText = '';
            if (diffDays > 0) {
                timeText = `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
            } else if (diffHours > 0) {
                timeText = `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
            } else if (diffMins > 0) {
                timeText = `In ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
            } else if (diffMins > -60) {
                timeText = 'Overdue!';
            } else {
                timeText = datetime.toLocaleDateString();
            }

            return `
                <div class="reminder-card ${status}">
                    <div class="reminder-header">
                        <div class="reminder-title">
                            <span class="category-icon">${categoryIcons[reminder.category]}</span>
                            ${reminder.title}
                        </div>
                        <div class="reminder-category">${reminder.category}</div>
                    </div>
                    ${reminder.notes ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">${reminder.notes}</div>` : ''}
                    <div class="reminder-time">
                        ⏰ ${datetime.toLocaleString()} ${!reminder.completed ? `(${timeText})` : ''}
                    </div>
                    <div class="reminder-actions">
                        ${!reminder.completed ? `
                            <button class="reminder-btn complete" onclick="completeReminder(${reminder.id})">
                                ✓ Complete
                            </button>
                        ` : ''}
                        <button class="reminder-btn delete" onclick="deleteReminder(${reminder.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
        }

        // Complete Reminder
        function completeReminder(id) {
            const reminder = reminders.find(r => r.id === id);
            if (reminder) {
                reminder.completed = true;
                saveReminders();
                renderRemindersList();
                showNotification('Reminder completed!', 'success');
            }
        }

        // Delete Reminder
        function deleteReminder(id) {
            if (confirm('Delete this reminder?')) {
                reminders = reminders.filter(r => r.id !== id);
                saveReminders();
                renderRemindersList();
                showNotification('Reminder deleted', 'success');
            }
        }

        // Check Reminders (runs every minute)
        function startReminderChecker() {
            // Check immediately
            checkReminders();
            
            // Then check every minute
            reminderCheckInterval = setInterval(checkReminders, 60000);
        }

        // Check for Due Reminders
        function checkReminders() {
            const now = new Date();
            
            reminders.forEach(reminder => {
                if (!reminder.completed && !reminder.notified) {
                    const reminderTime = new Date(reminder.datetime);
                    const diff = reminderTime - now;
                    
                    // Notify if within 1 minute
                    if (diff > 0 && diff < 60000) {
                        notifyReminder(reminder);
                        reminder.notified = true;
                        saveReminders();
                    }
                }
            });
        }

        // Send Notification
        function notifyReminder(reminder) {
            const categoryIcons = {
                work: '🏢', personal: '👤', health: '💪', shopping: '🛒',
                birthday: '🎂', recipe: '🍳', event: '📅', medication: '💊',
                exercise: '🏃', other: '📌'
            };

            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`${categoryIcons[reminder.category]} Reminder: ${reminder.title}`, {
                    body: reminder.notes || new Date(reminder.datetime).toLocaleString(),
                    icon: '⏰',
                    requireInteraction: true
                });
            }

            // In-app notification
            showNotification(`⏰ Reminder: ${reminder.title}`, 'warning');
            
            // Play sound (if browser supports)
            try {
                const audio = new AudioContext();
                const oscillator = audio.createOscillator();
                const gainNode = audio.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audio.destination);
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.3, audio.currentTime);
                oscillator.start(audio.currentTime);
                oscillator.stop(audio.currentTime + 0.2);
            } catch (e) {
                // Audio not supported, that's ok
            }
        }

        // ==================== VOICE RECOGNITION ====================

        // Setup Voice Recognition
        function setupVoiceRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' ';
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    if (finalTranscript) {
                        const contentArea = document.getElementById('noteContent');
                        if (contentArea) {
                            contentArea.value += finalTranscript;
                            handleContentChange({ target: contentArea });
                        }
                    }
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    stopVoiceRecording();
                    if (event.error === 'not-allowed') {
                        showNotification('Microphone permission denied', 'error');
                    }
                };

                recognition.onend = () => {
                    if (isRecording) {
                        recognition.start(); // Restart if still in recording mode
                    }
                };
            }
        }

        // Toggle Voice Recording
        function toggleVoiceRecording() {
            if (!recognition) {
                showNotification('Voice recognition not supported in this browser', 'error');
                return;
            }

            if (!currentNoteId) {
                showNotification('Please create or select a note first', 'error');
                return;
            }

            if (isRecording) {
                stopVoiceRecording();
            } else {
                // Request microphone permission
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        // Permission granted, stop the test stream
                        stream.getTracks().forEach(track => track.stop());
                        // Now start voice recognition
                        startVoiceRecording();
                    })
                    .catch(error => {
                        console.error('Microphone permission error:', error);
                        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                            showNotification('Microphone permission denied. Please allow microphone access to use voice input.', 'error');
                        } else if (error.name === 'NotFoundError') {
                            showNotification('No microphone found. Please connect a microphone.', 'error');
                        } else {
                            showNotification('Could not access microphone. Please check your settings.', 'error');
                        }
                    });
            }
        }

        // Start Voice Recording
        function startVoiceRecording() {
            try {
                recognition.start();
                isRecording = true;
                document.getElementById('voiceRecording').classList.add('active');
                document.getElementById('voiceBtn').classList.add('active');
                
                // Visual feedback in the note status
                document.getElementById('noteStatus').textContent = '🎤 Listening...';
                document.getElementById('noteStatus').style.color = 'var(--danger)';
                
                showNotification('🎤 Voice recording started - speak now!', 'success');
            } catch (e) {
                console.error('Error starting voice recognition:', e);
                showNotification('Could not start voice recording', 'error');
            }
        }

        // Stop Voice Recording
        function stopVoiceRecording() {
            if (recognition && isRecording) {
                recognition.stop();
                isRecording = false;
                document.getElementById('voiceRecording').classList.remove('active');
                document.getElementById('voiceBtn').classList.remove('active');
                
                // Reset note status
                document.getElementById('noteStatus').textContent = 'Ready';
                document.getElementById('noteStatus').style.color = '';
                
                showNotification('Voice recording stopped', 'success');
            }
        }

        // Click to stop recording
        document.addEventListener('DOMContentLoaded', () => {
            const voiceIndicator = document.getElementById('voiceRecording');
            if (voiceIndicator) {
                voiceIndicator.addEventListener('click', stopVoiceRecording);
            }
        });

        // ==================== SPELL CHECKER ====================

        // Common misspellings dictionary
        const commonMisspellings = {
            'teh': 'the', 'recieve': 'receive', 'occured': 'occurred',
            'seperate': 'separate', 'definately': 'definitely', 'goverment': 'government',
            'enviroment': 'environment', 'recomend': 'recommend', 'accomodate': 'accommodate',
            'occassion': 'occasion', 'beleive': 'believe', 'wierd': 'weird',
            'freind': 'friend', 'untill': 'until', 'recieved': 'received',
            'begining': 'beginning', 'wich': 'which', 'alot': 'a lot',
            'thier': 'their', 'sucessful': 'successful', 'adress': 'address',
            'tomarrow': 'tomorrow', 'neccesary': 'necessary', 'congradulations': 'congratulations'
        };

        // Toggle Spell Check
        function toggleSpellCheck() {
            spellCheckEnabled = !spellCheckEnabled;
            const btn = document.getElementById('spellCheckBtn');
            btn.classList.toggle('active', spellCheckEnabled);
            
            if (spellCheckEnabled) {
                performSpellCheck();
                showNotification('Spell check enabled', 'success');
            } else {
                clearSpellCheck();
                showNotification('Spell check disabled', 'success');
            }
        }

        // Perform Spell Check
        function performSpellCheck() {
            const contentArea = document.getElementById('noteContent');
            if (!contentArea || !spellCheckEnabled) return;

            const text = contentArea.value;
            const words = text.split(/\s+/);
            
            words.forEach(word => {
                const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
                if (commonMisspellings[cleanWord]) {
                    // Auto-correct if enabled
                    if (settings.autoCorrect) {
                        contentArea.value = contentArea.value.replace(
                            new RegExp('\\b' + word + '\\b', 'g'),
                            commonMisspellings[cleanWord]
                        );
                        handleContentChange({ target: contentArea });
                    }
                }
            });

            if (settings.autoCorrect) {
                showNotification('Auto-correct applied', 'success');
            }
        }

        // Clear Spell Check
        function clearSpellCheck() {
            // Spell check clearing logic if needed
        }

        // ==================== CONTINUE WITH EXISTING FUNCTIONS ====================

        // Show Notification
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--accent-secondary)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                font-family: 'Syne', sans-serif;
                font-weight: 700;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
