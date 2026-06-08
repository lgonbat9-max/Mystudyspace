// ============================================
// MYSTUDYSPACE - APLICACIÓN DE ESTUDIO
// ============================================

// Estado global de la aplicación
const state = {
    subjects: [],
    currentSubject: null,
    flashcards: {},
    notes: {},
    files: {},
    timerSettings: {
        backgroundImage: null,
        backgroundColor: '#6366f1',
        backgroundOpacity: 100,
        notes: '',
    },
    timerInterval: null,
    timerRunning: false,
    timerTime: 0,
    alarmAudio: null,
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    initializeEventListeners();
    renderSubjects();
    updateFlashcardSelects();
    loadTheme();
    createAudioContext();
    loadTimerSettings();
});

// ============================================
// ALMACENAMIENTO LOCAL
// ============================================

function saveToStorage() {
    localStorage.setItem('mystudyspace_data', JSON.stringify({
        subjects: state.subjects,
        notes: state.notes,
        files: state.files,
        flashcards: state.flashcards
    }));
}

function loadFromStorage() {
    const saved = localStorage.getItem('mystudyspace_data');
    if (saved) {
        const data = JSON.parse(saved);
        state.subjects = data.subjects || [];
        state.notes = data.notes || {};
        state.files = data.files || {};
        state.flashcards = data.flashcards || {};
    } else {
        state.subjects = [];
    }
}

function saveTimerSettings() {
    localStorage.setItem('mystudyspace_timer', JSON.stringify(state.timerSettings));
}

function loadTimerSettings() {
    const saved = localStorage.getItem('mystudyspace_timer');
    if (saved) {
        state.timerSettings = JSON.parse(saved);
    }
    applyTimerSettings();
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Navegación de Tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // TAB 1: APUNTES
    document.getElementById('addSubjectBtn').addEventListener('click', addSubject);
    document.getElementById('newSubjectInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addSubject();
    });

    // TAB 2: FLASHCARDS
    document.getElementById('fcSubjectSelect').addEventListener('change', function() {
        showFlashcardsForSubject(this.value);
    });
    document.getElementById('addFlashcardBtn').addEventListener('click', showFlashcardForm);
    document.getElementById('saveFlashcardBtn').addEventListener('click', saveFlashcard);
    document.getElementById('cancelFlashcardBtn').addEventListener('click', hideFlashcardForm);

    // TAB 3: TEMPORIZADOR
    document.getElementById('startTimerBtn').addEventListener('click', startTimer);
    document.getElementById('pauseTimerBtn').addEventListener('click', pauseTimer);
    document.getElementById('resetTimerBtn').addEventListener('click', resetTimer);
    document.getElementById('timerMinutes').addEventListener('change', updateTimerDisplay);
    document.getElementById('timerSeconds').addEventListener('change', updateTimerDisplay);
    document.getElementById('alarmVolume').addEventListener('change', function() {
        document.getElementById('volumeValue').textContent = this.value + '%';
    });

    // Personalización del Temporizador
    const timerBgUploadArea = document.getElementById('timerBgUploadArea');
    const timerBgInput = document.getElementById('timerBgInput');

    timerBgUploadArea.addEventListener('dragover', handleTimerDragOver);
    timerBgUploadArea.addEventListener('drop', handleTimerFileDrop);
    timerBgUploadArea.addEventListener('dragleave', handleTimerDragLeave);
    timerBgUploadArea.addEventListener('click', () => timerBgInput.click());
    timerBgInput.addEventListener('change', handleTimerFileSelect);

    document.getElementById('timerBgOpacity').addEventListener('change', function() {
        document.getElementById('opacityValue').textContent = this.value + '%';
        state.timerSettings.backgroundOpacity = this.value;
        applyTimerSettings();
        saveTimerSettings();
    });

    document.getElementById('removeTimerBgBtn').addEventListener('click', removeTimerBackground);

    // TAB 4: CONFIGURACIÓN
    document.getElementById('themeSelect').addEventListener('change', changeTheme);
    document.getElementById('bgColor').addEventListener('change', changeBackgroundColor);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
}

// ============================================
// NAVEGACIÓN DE TABS
// ============================================

function switchTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar el tab seleccionado
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Pausar temporizador si cambiamos de tab
    if (tabName !== 'temporizador' && state.timerRunning) {
        pauseTimer();
    }
}

// ============================================
// TAB 1: APUNTES Y ARCHIVOS
// ============================================

function addSubject() {
    const input = document.getElementById('newSubjectInput');
    const name = input.value.trim();

    if (!name) {
        alert('Por favor ingresa el nombre de una asignatura');
        return;
    }

    if (state.subjects.includes(name)) {
        alert('Esta asignatura ya existe');
        return;
    }

    state.subjects.push(name);
    state.notes[name] = '';
    state.files[name] = [];
    state.flashcards[name] = [];

    input.value = '';
    renderSubjects();
    saveToStorage();
}

function renderSubjects() {
    const container = document.getElementById('subjectTabs');
    container.innerHTML = '';

    state.subjects.forEach(subject => {
        const tab = document.createElement('div');
        tab.className = 'subject-tab';
        if (subject === state.currentSubject) {
            tab.classList.add('active');
        }

        tab.innerHTML = `
            <span>${subject}</span>
            <button class="delete-subject-btn" title="Eliminar asignatura">×</button>
        `;

        tab.querySelector('span').addEventListener('click', () => {
            selectSubject(subject);
        });

        tab.querySelector('.delete-subject-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSubject(subject);
        });

        container.appendChild(tab);
    });
}

function selectSubject(name) {
    state.currentSubject = name;
    renderSubjects();
    renderSubjectContent();
    updateFlashcardSelects();
    saveToStorage();
}

function deleteSubject(name) {
    if (confirm(`¿Estás seguro de que deseas eliminar la asignatura "${name}"?`)) {
        state.subjects = state.subjects.filter(s => s !== name);
        if (state.currentSubject === name) {
            state.currentSubject = state.subjects[0] || null;
        }
        delete state.notes[name];
        delete state.files[name];
        delete state.flashcards[name];
        renderSubjects();
        renderSubjectContent();
        saveToStorage();
    }
}

function renderSubjectContent() {
    const content = document.getElementById('subjectContent');

    if (!state.currentSubject) {
        content.innerHTML = '<p class="empty-state">Selecciona o crea una asignatura para comenzar</p>';
        return;
    }

    const notes = state.notes[state.currentSubject] || '';
    const files = state.files[state.currentSubject] || [];

    content.innerHTML = `
        <div class="notes-editor">
            <h3>Mis Apuntes de ${state.currentSubject}</h3>
            <div class="notes-toolbar">
                <button onclick="formatText('bold')" title="Negrita"><strong>B</strong></button>
                <button onclick="formatText('italic')" title="Cursiva"><em>I</em></button>
                <button onclick="formatText('underline')" title="Subrayado"><u>U</u></button>
                <button onclick="insertTemplate()" title="Insertar plantilla">📋</button>
            </div>
            <textarea id="notesTextarea" class="notes-textarea" placeholder="Escribe tus apuntes aquí...">${notes}</textarea>
            <button class="btn btn-primary save-notes-btn" onclick="saveNotes()">💾 Guardar Apuntes</button>
        </div>

        <div class="files-section">
            <h3>Archivos de ${state.currentSubject}</h3>
            <div class="file-upload-area" id="uploadArea" ondrop="handleFileDrop(event)" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)">
                <label class="file-upload-label">
                    <input type="file" id="fileInput" multiple onchange="handleFileSelect(event)">
                    📁 <strong>Arrastra archivos aquí</strong> o haz clic para seleccionar
                    <br><small>Máximo 10MB por archivo</small>
                </label>
            </div>
            <div class="files-list" id="filesList">
                ${renderFilesList(files)}
            </div>
        </div>
    `;

    // Actualizar evento del área de upload
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleFileDrop);
    uploadArea.addEventListener('dragleave', handleDragLeave);
}

function renderFilesList(files) {
    if (files.length === 0) {
        return '<p class="empty-state">No hay archivos cargados aún</p>';
    }

    return files.map((file, index) => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-icon">${getFileIcon(file.name)}</div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="file-actions">
                <button class="file-action-btn" onclick="downloadFile(${index})">📥 Descargar</button>
                <button class="file-action-btn" onclick="deleteFile(${index})" style="color: var(--danger-color);">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function saveNotes() {
    const textarea = document.getElementById('notesTextarea');
    if (textarea) {
        state.notes[state.currentSubject] = textarea.value;
        saveToStorage();
        alert('✅ Apuntes guardados correctamente');
    }
}

function formatText(format) {
    const textarea = document.getElementById('notesTextarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let before = '';
    let after = '';

    if (format === 'bold') {
        before = '**';
        after = '**';
    } else if (format === 'italic') {
        before = '*';
        after = '*';
    } else if (format === 'underline') {
        before = '__';
        after = '__';
    }

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    textarea.value = newText;
}

function insertTemplate() {
    const template = `
## Tema: 

### Conceptos principales:
- 
- 
- 

### Definiciones:


### Ejemplos:


### Notas importantes:
⭐ 
⭐ 

### Preguntas para repasar:
1. 
2. 
3. 
`;
    const textarea = document.getElementById('notesTextarea');
    if (textarea) {
        textarea.value += template;
    }
}

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.add('dragover');
}

function handleDragLeave(e) {
    document.getElementById('uploadArea').classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    document.getElementById('uploadArea').classList.remove('dragover');
    const files = e.dataTransfer.files;
    uploadFiles(files);
}

function handleFileSelect(e) {
    uploadFiles(e.target.files);
}

function uploadFiles(fileList) {
    if (!state.currentSubject) {
        alert('Por favor selecciona una asignatura primero');
        return;
    }

    const files = state.files[state.currentSubject] || [];

    Array.from(fileList).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`El archivo ${file.name} es muy grande (máximo 10MB)`);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            files.push({
                name: file.name,
                size: file.size,
                data: e.target.result,
                date: new Date().toLocaleString()
            });
            state.files[state.currentSubject] = files;
            renderSubjectContent();
            saveToStorage();
        };
        reader.readAsDataURL(file);
    });
}

function downloadFile(index) {
    const file = state.files[state.currentSubject][index];
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
}

function deleteFile(index) {
    if (confirm('¿Eliminar este archivo?')) {
        state.files[state.currentSubject].splice(index, 1);
        renderSubjectContent();
        saveToStorage();
    }
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'xls': '📊',
        'xlsx': '📊',
        'ppt': '🎯',
        'pptx': '🎯',
        'txt': '📋',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'zip': '📦',
        'rar': '📦',
    };
    return icons[ext] || '📎';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// TAB 2: FLASHCARDS
// ============================================

function updateFlashcardSelects() {
    const select = document.getElementById('fcSubjectSelect');
    const currentValue = select.value;
    select.innerHTML = '<option value="">Selecciona una asignatura</option>';

    state.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
    });

    select.value = currentValue;
}

function showFlashcardsForSubject(subject) {
    if (!subject) {
        document.getElementById('flashcardArea').innerHTML = '<p class="empty-state">Selecciona una asignatura para ver flashcards</p>';
        document.getElementById('addFlashcardBtn').style.display = 'none';
        document.getElementById('flashcardForm').style.display = 'none';
        return;
    }

    const flashcards = state.flashcards[subject] || [];

    if (flashcards.length === 0) {
        document.getElementById('flashcardArea').innerHTML = '<p class="empty-state">No hay flashcards aún. ¡Crea una para comenzar!</p>';
    } else {
        displayFlashcard(subject, 0);
    }

    document.getElementById('addFlashcardBtn').style.display = 'inline-block';
}

let currentFlashcardIndex = 0;
let currentFlashcardSubject = '';

function displayFlashcard(subject, index) {
    const flashcards = state.flashcards[subject] || [];

    if (flashcards.length === 0) return;

    currentFlashcardIndex = index;
    currentFlashcardSubject = subject;

    const card = flashcards[index];
    const isFlipped = card.flipped || false;

    const area = document.getElementById('flashcardArea');
    area.innerHTML = `
        <div class="flashcard-nav">
            <button class="btn btn-secondary" onclick="previousFlashcard()" ${index === 0 ? 'disabled' : ''}>← Anterior</button>
            <span class="flashcard-counter">${index + 1} / ${flashcards.length}</span>
            <button class="btn btn-secondary" onclick="nextFlashcard()" ${index === flashcards.length - 1 ? 'disabled' : ''}>Siguiente →</button>
        </div>

        <div class="flashcard ${isFlipped ? 'flipped' : ''}" onclick="toggleFlashcard()">
            <div class="flashcard-content">
                <div class="flashcard-label">${isFlipped ? 'Respuesta' : 'Pregunta'}</div>
                <div>${isFlipped ? card.answer : card.question}</div>
            </div>
        </div>

        <div class="flashcard-controls">
            <button class="btn btn-primary" onclick="toggleFlashcard()">🔄 Voltear</button>
            <button class="btn btn-danger" onclick="deleteFlashcard(${index})">🗑️ Eliminar</button>
        </div>
    `;
}

function toggleFlashcard() {
    const flashcards = state.flashcards[currentFlashcardSubject];
    flashcards[currentFlashcardIndex].flipped = !flashcards[currentFlashcardIndex].flipped;
    displayFlashcard(currentFlashcardSubject, currentFlashcardIndex);
    saveToStorage();
}

function nextFlashcard() {
    if (currentFlashcardIndex < state.flashcards[currentFlashcardSubject].length - 1) {
        displayFlashcard(currentFlashcardSubject, currentFlashcardIndex + 1);
    }
}

function previousFlashcard() {
    if (currentFlashcardIndex > 0) {
        displayFlashcard(currentFlashcardSubject, currentFlashcardIndex - 1);
    }
}

function deleteFlashcard(index) {
    if (confirm('¿Eliminar esta flashcard?')) {
        state.flashcards[currentFlashcardSubject].splice(index, 1);
        if (currentFlashcardIndex >= state.flashcards[currentFlashcardSubject].length) {
            currentFlashcardIndex = Math.max(0, currentFlashcardIndex - 1);
        }
        showFlashcardsForSubject(currentFlashcardSubject);
        saveToStorage();
    }
}

function showFlashcardForm() {
    document.getElementById('flashcardForm').style.display = 'block';
    document.getElementById('fcQuestion').focus();
}

function hideFlashcardForm() {
    document.getElementById('flashcardForm').style.display = 'none';
    document.getElementById('fcQuestion').value = '';
    document.getElementById('fcAnswer').value = '';
}

function saveFlashcard() {
    const question = document.getElementById('fcQuestion').value.trim();
    const answer = document.getElementById('fcAnswer').value.trim();

    if (!question || !answer) {
        alert('Por favor completa pregunta y respuesta');
        return;
    }

    const subject = document.getElementById('fcSubjectSelect').value;
    if (!subject) {
        alert('Por favor selecciona una asignatura');
        return;
    }

    if (!state.flashcards[subject]) {
        state.flashcards[subject] = [];
    }

    state.flashcards[subject].push({
        question: question,
        answer: answer,
        flipped: false
    });

    hideFlashcardForm();
    showFlashcardsForSubject(subject);
    saveToStorage();
    alert('✅ Flashcard creada');
}

// ============================================
// TAB 3: TEMPORIZADOR MEJORADO
// ============================================

function updateTimerDisplay() {
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    state.timerTime = minutes * 60 + seconds;
    displayTimer();
}

function displayTimer() {
    const minutes = Math.floor(state.timerTime / 60);
    const seconds = state.timerTime % 60;
    document.getElementById('timerValue').textContent = 
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

function startTimer() {
    if (state.timerRunning) return;

    if (state.timerTime === 0) {
        updateTimerDisplay();
    }

    state.timerRunning = true;
    document.getElementById('startTimerBtn').style.display = 'none';
    document.getElementById('pauseTimerBtn').style.display = 'inline-block';

    state.timerInterval = setInterval(() => {
        if (state.timerTime > 0) {
            state.timerTime--;
            displayTimer();
        } else {
            finishTimer();
        }
    }, 1000);
}

function pauseTimer() {
    state.timerRunning = false;
    clearInterval(state.timerInterval);
    document.getElementById('startTimerBtn').style.display = 'inline-block';
    document.getElementById('pauseTimerBtn').style.display = 'none';
}

function resetTimer() {
    pauseTimer();
    state.timerTime = 0;
    updateTimerDisplay();
}

function finishTimer() {
    pauseTimer();
    playAlarm();
    alert('⏰ ¡Se acabó el tiempo!');
}

function createAudioContext() {
    // Se crea cuando sea necesario
}

function playAlarm() {
    if (!document.getElementById('alarmEnabled').checked) return;

    const volume = parseInt(document.getElementById('alarmVolume').value) / 100;

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            osc2.connect(gainNode);
            osc2.frequency.setValueAtTime(600, audioContext.currentTime);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.5);
        }, 500);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// ============================================
// PERSONALIZACIÓN DEL TEMPORIZADOR
// ============================================

function handleTimerDragOver(e) {
    e.preventDefault();
    document.getElementById('timerBgUploadArea').classList.add('dragover');
}

function handleTimerDragLeave(e) {
    document.getElementById('timerBgUploadArea').classList.remove('dragover');
}

function handleTimerFileDrop(e) {
    e.preventDefault();
    document.getElementById('timerBgUploadArea').classList.remove('dragover');
    const files = e.dataTransfer.files;
    uploadTimerBackground(files[0]);
}

function handleTimerFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        uploadTimerBackground(files[0]);
    }
}

function uploadTimerBackground(file) {
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande (máximo 5MB)');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        state.timerSettings.backgroundImage = e.target.result;
        document.getElementById('removeTimerBgBtn').style.display = 'inline-block';
        applyTimerSettings();
        saveTimerSettings();
        alert('✅ Imagen de fondo aplicada');
    };
    reader.readAsDataURL(file);
}

function removeTimerBackground() {
    state.timerSettings.backgroundImage = null;
    document.getElementById('timerBgInput').value = '';
    document.getElementById('removeTimerBgBtn').style.display = 'none';
    applyTimerSettings();
    saveTimerSettings();
    alert('✅ Imagen eliminada');
}

function applyTimerBgColor() {
    const color = document.getElementById('timerBgColor').value;
    state.timerSettings.backgroundColor = color;
    state.timerSettings.backgroundImage = null;
    document.getElementById('timerBgInput').value = '';
    document.getElementById('removeTimerBgBtn').style.display = 'none';
    applyTimerSettings();
    saveTimerSettings();
    alert('✅ Color de fondo aplicado');
}

function applyTimerSettings() {
    const preview = document.getElementById('timerBgPreview');
    
    if (state.timerSettings.backgroundImage) {
        preview.style.backgroundImage = `url('${state.timerSettings.backgroundImage}')`;
        preview.style.backgroundColor = 'transparent';
    } else {
        preview.style.backgroundImage = 'none';
        preview.style.backgroundColor = state.timerSettings.backgroundColor;
    }
    
    const opacity = state.timerSettings.backgroundOpacity / 100;
    preview.style.opacity = opacity;
    
    // Cargar notas guardadas
    const notesTextarea = document.getElementById('timerNotes');
    if (notesTextarea) {
        notesTextarea.value = state.timerSettings.notes || '';
    }
    document.getElementById('timerBgOpacity').value = state.timerSettings.backgroundOpacity;
    document.getElementById('opacityValue').textContent = state.timerSettings.backgroundOpacity + '%';
    document.getElementById('timerBgColor').value = state.timerSettings.backgroundColor;
    
    if (state.timerSettings.backgroundImage) {
        document.getElementById('removeTimerBgBtn').style.display = 'inline-block';
    }
}

function saveTimerNotes() {
    const notes = document.getElementById('timerNotes').value;
    state.timerSettings.notes = notes;
    saveTimerSettings();
    alert('✅ Notas guardadas');
}

// ============================================
// TAB 4: CONFIGURACIÓN
// ============================================

function changeTheme(e) {
    const theme = e.target.value;
    localStorage.setItem('mystudyspace_theme', theme);
    applyTheme(theme);
}

function loadTheme() {
    const theme = localStorage.getItem('mystudyspace_theme') || 'light';
    document.getElementById('themeSelect').value = theme;
    applyTheme(theme);
}

function applyTheme(theme) {
    const html = document.documentElement;

    if (theme === 'dark') {
        html.style.colorScheme = 'dark';
        document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
        html.style.colorScheme = 'light';
        document.body.classList.remove('dark-theme');
    } else if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.style.colorScheme = prefersDark ? 'dark' : 'light';
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

function changeBackgroundColor(e) {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    localStorage.setItem('mystudyspace_bgcolor', color);
}

function exportData() {
    const data = {
        subjects: state.subjects,
        notes: state.notes,
        files: state.files,
        flashcards: state.flashcards,
        timerSettings: state.timerSettings,
        exportDate: new Date().toLocaleString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mystudyspace-backup-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('✅ Datos exportados correctamente');
}

function clearAllData() {
    if (confirm('⚠️ ¿Estás seguro? Esto eliminará TODOS tus datos y NO se puede deshacer.')) {
        if (confirm('Confirma de nuevo: ¿Deseas eliminar TODOS los datos?')) {
            state.subjects = [];
            state.notes = {};
            state.files = {};
            state.flashcards = {};
            state.currentSubject = null;
            state.timerSettings = {
                backgroundImage: null,
                backgroundColor: '#6366f1',
                backgroundOpacity: 100,
                notes: '',
            };
            localStorage.removeItem('mystudyspace_data');
            localStorage.removeItem('mystudyspace_timer');
            location.reload();
        }
    }
}