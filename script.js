const DIALOGUE_COVRD = /^([^-]+?)\s*-\s*([^-]+?)\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/;
const DIALOGUE_EXPR  = /^([^(]+?)\s*\(([^)]+)\)\s*:\s*(.*)$/;
const DIALOGUE       = /^([^:]+?):\s*(.*)$/;

const ALLOWED_SCRIPT_KEYS = [
    'toggle', 'scheme', 'theme', 'title', 'hide title',
    'previous chapters', 'next chapters', 'edit script'
];

function normalizeKey(key) {
    return key.trim().toLowerCase();
}

function isAllowedKey(key) {
    return ALLOWED_SCRIPT_KEYS.includes(normalizeKey(key));
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatDialogue(character, dialogue, extras = {}) {
    const parts = ['{{Script/dialogue', character, dialogue];
    if (extras.expression) parts.push(`Expression=${extras.expression}`);
    if (extras.characterOverride) parts.push(`Character Override=${extras.characterOverride}`);
    return parts.join('|') + '}}';
}

function convertLine(line, isFailedScriptLine) {
    if (isFailedScriptLine) return { out: line, converted: false, blank: false };
    if (line.trim() === '') return { out: '', converted: false, blank: true };

    const typeMatch = line.match(/^\s*<type\/(Radio|Moment|Text\s+Message)>\s*$/i);
    if (typeMatch) {
        let type = typeMatch[1].toLowerCase();
        if (type === 'radio') type = 'Radio';
        else if (type === 'moment') type = 'Moment';
        else if (type === 'text message') type = 'Text Message';
        return { out: `{{Script/type|${type}}}`, converted: true };
    }

    let m = line.match(DIALOGUE_COVRD);
    if (m) {
        const character = m[1].trim();
        const override = m[2].trim();
        const expression = m[3] ? m[3].trim() : null;
        const dialogue = m[4].trim();
        return { out: formatDialogue(character, dialogue, { expression, characterOverride: override }), converted: true };
    }

    m = line.match(DIALOGUE_EXPR);
    if (m) {
        const character = m[1].trim();
        const expression = m[2].trim();
        const dialogue = m[3].trim();
        return { out: formatDialogue(character, dialogue, { expression }), converted: true };
    }

    m = line.match(DIALOGUE);
    if (m) {
        const character = m[1].trim();
        const dialogue = m[2].trim();
        return { out: formatDialogue(character, dialogue, {}), converted: true };
    }

    return { out: line, converted: false };
}

function convert() {
    const raw = document.getElementById('input').value;
    const lines = raw.split('\n');
    const outDiv = document.getElementById('output');

    const isScriptBlockLine = new Array(lines.length).fill(false);
    const isFailedScriptLine = new Array(lines.length).fill(false);
    let scriptParams = null;
    let hasScriptBlock = false;

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        if (/^\s*<Script>\s*$/i.test(line)) {
            hasScriptBlock = true;
            isScriptBlockLine[i] = true;
            i++;
            continue;
        }

        if (/^\s*<Script\b/i.test(line) && !/^\s*<Script>\s*$/i.test(line)) {
            let blockLines = [line];
            let blockStartIdx = i;
            let j = i + 1;
            let foundEnd = false;
            while (j < lines.length) {
                blockLines.push(lines[j]);
                if (/\s*>\s*$/.test(lines[j])) {
                    foundEnd = true;
                    break;
                }
                j++;
            }
            if (foundEnd) {
                let valid = true;
                const params = {};
                for (let k = 1; k < blockLines.length - 1; k++) {
                    const paramLine = blockLines[k].trim();
                    if (paramLine === '') continue;
                    const colonIndex = paramLine.indexOf(':');
                    if (colonIndex !== -1) {
                        let key = paramLine.substring(0, colonIndex).trim();
                        let value = paramLine.substring(colonIndex + 1).trim();
                        if (!isAllowedKey(key)) {
                            valid = false;
                            break;
                        }
                        if (normalizeKey(key) === 'toggle') {
                            const lowerVal = value.toLowerCase();
                            if (lowerVal === 'no toggle') {
                                value = 'false';
                            } else if (lowerVal === 'collapsed') {
                                value = 'Collapsed';
                            } else {
                                valid = false;
                                break;
                            }
                        }
                        params[key] = value;
                    } else {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    let lastLine = blockLines[blockLines.length - 1].trim();
                    let lastContent = lastLine.replace(/\s*>\s*$/, '').trim();
                    if (lastContent !== '') {
                        const colonIndex = lastContent.indexOf(':');
                        if (colonIndex !== -1) {
                            let key = lastContent.substring(0, colonIndex).trim();
                            let value = lastContent.substring(colonIndex + 1).trim();
                            if (!isAllowedKey(key)) {
                                valid = false;
                            }
                            if (valid && normalizeKey(key) === 'toggle') {
                                const lowerVal = value.toLowerCase();
                                if (lowerVal === 'no toggle') {
                                    value = 'false';
                                } else if (lowerVal === 'collapsed') {
                                    value = 'Collapsed';
                                } else {
                                    valid = false;
                                }
                            }
                            if (valid) params[key] = value;
                        } else {
                            valid = false;
                        }
                    }
                }
                if (valid) {
                    for (let idx = blockStartIdx; idx <= j; idx++) {
                        isScriptBlockLine[idx] = true;
                    }
                    scriptParams = params;
                    hasScriptBlock = true;
                    i = j + 1;
                    continue;
                } else {
                    for (let idx = blockStartIdx; idx <= j; idx++) {
                        isFailedScriptLine[idx] = true;
                    }
                    i = j + 1;
                    continue;
                }
            } else {
                i++;
            }
        }
        i++;
    }

    function updateBackdrop() {
        const backdrop = document.getElementById('input-backdrop');
        backdrop.innerHTML = lines.map((line, idx) => {
            const escaped = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            if (isScriptBlockLine[idx]) {
                return escaped + '\n';
            } else if (isFailedScriptLine[idx]) {
                return `<span class="bad">${escaped}</span>\n`;
            } else {
                const result = convertLine(line, false);
                if (!result.converted && !result.blank) {
                    return `<span class="bad">${escaped}</span>\n`;
                } else {
                    return escaped + '\n';
                }
            }
        }).join('');
    }
    updateBackdrop();

    if (!raw) {
        outDiv.innerHTML = '<span class="placeholder">Formatted output will appear here…</span>';
        document.getElementById('status').className = 'status';
        return;
    }

    let convertedCount = 0, skipped = 0;
    const skippedLines = [], outLines = [];

    for (let idx = 0; idx < lines.length; idx++) {
        if (isScriptBlockLine[idx]) {
            convertedCount++;
            continue;
        }
        if (isFailedScriptLine[idx]) {
            outLines.push(lines[idx]);
            skipped++;
            skippedLines.push(lines[idx]);
            continue;
        }
        const line = lines[idx];
        const result = convertLine(line, false);
        outLines.push(result.out);
        if (result.converted) convertedCount++;
        else if (!result.blank) { skipped++; skippedLines.push(line); }
    }

    if (hasScriptBlock) {
        let startTag = '{{Script/start}}';
        if (scriptParams && Object.keys(scriptParams).length > 0) {
            const paramParts = [];
            for (const [key, value] of Object.entries(scriptParams)) {
                paramParts.push(`${key}=${value}`);
            }
            startTag = `{{Script/start|${paramParts.join('|')}}}`;
        }
        outLines.unshift(startTag);
        outLines.push('{{Script/end}}');
    }

    outDiv.innerHTML = outLines.map((line) => {
        const escaped = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<span class="line">${escaped || '&#8203;'}</span>`;
    }).join('');

    const status = document.getElementById('status');
    if (skipped === 0) {
        status.className = 'status show ok';
        status.innerHTML = `${convertedCount} line${convertedCount !== 1 ? 's' : ''} converted successfully.`;
    } else {
        status.className = 'status show warning';
        const preview = skippedLines.slice(0,5).map(l => `  ${escapeHtml(l.slice(0,60))}${l.length>60?'…':''}`).join('<br>');
        status.innerHTML = `${convertedCount} line${convertedCount !== 1 ? 's' : ''} converted successfully &mdash; ${skipped} line${skipped!==1?'s':''} had no recognisable format and were left unchanged:<div class="skipped-list">${preview}</div>`;
    }
}

function copyOutput() {
    const lines = [...document.getElementById('output').querySelectorAll('.line')].map(el => el.textContent === '​' ? '' : el.textContent);
    if (!lines.length) return;
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.textContent = 'Copied!';
        btn.classList.add('success');
        setTimeout(() => { btn.textContent = 'Copy all'; btn.classList.remove('success'); }, 1800);
    });
}

function clearInput() {
    document.getElementById('input').value = '';
    document.getElementById('output').innerHTML = '<span class="placeholder">Formatted output will appear here…</span>';
    document.getElementById('status').className = 'status';
    convert();
}

const inputEl = document.getElementById('input');
inputEl.addEventListener('input', convert);
inputEl.addEventListener('scroll', () => {
    const backdrop = document.getElementById('input-backdrop');
    if (backdrop) backdrop.scrollTop = inputEl.scrollTop;
});
convert();