const SCRIPT_KEY = [
    'toggle', 'scheme', 'theme', 'title', 'hide title',
    'previous chapters', 'next chapters', 'edit script'
];

const SCRIPT_TYPE = {
    'radio': 'Radio',
    'moment': 'Moment',
    'text message': 'Text Message',
    'reset': 'Reset'
};

const PHONE_TYPE = {
    'voice': 'Voice',
    'video': 'Video',
    'text message': 'Text Message'
};

const EMOJI_LIST = [
    "Adorable", "Angry", "Announcer", "Asleep", "Awkward", "Bawling", "Bomb", "Bored",
    "Cake", "Celebrating", "Cheers", "Chuckling", "Claps", "Cocky", "Coffee", "Cursing",
    "Daydreaming", "Disdain", "Dizzy", "Dog Head", "Doubtful", "Epic", "Feeling Wronged",
    "Fist Bump", "Flowers", "Flowers for You", "Genius", "Gift", "Going Crazy", "Grumpy",
    "Hands Up", "Handshake", "Heart‑broken", "Hearteyes", "Hearts", "Huggie", "Hush",
    "It's Locked", "Kneeling", "Knocking", "Laughing", "LMAO", "Miserable", "Music",
    "Mwah!", "OK", "On the Verge of Tears", "Patting the Head", "Pig Head", "Pills",
    "Playful", "Pouting", "Provocative", "Red Packet", "ROFL", "Sad", "Seduction",
    "See Ya", "Shrugs", "Shut Up", "Shy", "Smiling", "Smirking", "Spectating", "Strive",
    "Surprised", "Sweating", "Tearful", "Thankful", "The Moon", "The Sun", "Thumbs Up",
    "Victory", "Waves", "Whistling", "Wicked", "Wide Grin", "Wilting"
];

const ANIMATED_PREFIXES = [
    "Galaxy Kid",
    "Happy Snowman",
    "Artsy Birb",
    "Grumpy Crow",
    "Sunny Apple"
];

const ANIMATED_EMOJI_LIST = {
    "Galaxy Kid": [
        "!", "?", "...", "A Bummer", "Dizzy", "Flower Launch", "G'nite", "Got It",
        "Happy", "Heart", "Hewwo", "I Don't Care", "Lemme See", "Not Sleepy",
        "Okay Now", "Pat Pat", "Plop", "Pretend", "Recharging", "See Ya", "Stare",
        "Sweats", "Thanks", "U Got This", "Wow"
    ],
    "Happy Snowman": [
        "?", "...", "Alert", "Analyze", "Angy", "Awake?", "Busy", "Frosty Flowers",
        "Glasses", "Grumpy", "Hmph", "I Don't Care", "Indifferent", "Later", "No",
        "Nope", "Not Listening", "Observe", "Okay", "Overtime", "Sigh", "Tea",
        "Time for Meds", "Yea", "You Angsty"
    ],
    "Artsy Birb": [
        "!!!", "???", "Angry", "Bloom Tint", "Boring", "Busy", "Bye", "Comfort Me",
        "Cutee", "Dummy", "Genius", "Go Away", "Heartbroken", "Heya", "Huggie",
        "I Don't Care", "I'm Babey", "Knock Knock", "Love Ya", "Morning", "Peep",
        "Popcorns", "Proud", "Tearing", "Thinking"
    ],
    "Grumpy Crow": [
        "!", "?", "Amazing", "Angy", "Annoyed", "Boring", "Comfy", "Coming", "Cuddle",
        "Don't Wanna", "Feather Bloom", "For You", "Gimme Everything", "Good Night",
        "Graceful", "Happy", "Indifferent", "No", "Not Looking", "Pondering", "Proud",
        "Speechless", "Sure", "That It?", "U Doing What Now"
    ],
    "Sunny Apple": [
        "!!", "??", "Angy", "Bye", "Dizzy", "Flower Greeting", "Funny", "G'nite",
        "Happy", "Heartbroken", "Hmm", "Huggie", "Hurt", "Morning", "Never Mind",
        "No", "No No No", "Okay", "On What Basis", "Pat Pat", "Spill It", "Tired",
        "U Got This", "Watcha Doing", "Yay"
    ]
};

const INTERACTION_TYPE_LIST = [
    "Tap", "Tap Multi", "Tap Multi Timed",
    "Arrow", "Arrow Timed", "Arrow Curve", "Arrow Curve Timed",
    "Camera", "Talk", "Talk Timed", "Voice",
    "Touch", "Trace", "Rotate",
    "Swipe", "Swipe Timed", "Breathe",
    "Hold", "Timed"
];

const ANIMATED_EMOJI = new RegExp(`^<(${ANIMATED_PREFIXES.join('|')}):\\s*([^>]+)>$`, 'i');

const DIALOGUE_COVRD = /^([^-]+?)\s*-\s*([^-]+?)\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/;
const DIALOGUE_EXPR  = /^([^(]+?)\s*\(([^)]+)\)\s*:\s*(.*)$/;
const DIALOGUE       = /^([^:]+?):\s*(.*)$/;

const SCRIPT_NOBLOCK = /^\s*<Script>\s*$/i;
const SCRIPT_START = /^\s*<Script\b/i;
const SCRIPT_END = /\s*>\s*$/;

const CHOICE_START = /^\s*<choice>\s*$/i;
const CHOICE_END   = /^\s*<\/choice>\s*$/i;
const CHOICE_TAB   = /^\?\s*(.*)$/;

const PHONE_START = /^\s*@\s*(voice|video|text\s+message)\s*(?:-\s*(.+?))?\s*$/i;
const PHONE_END = /^\s*@@\s*$/;

const HEADING = /^##\s+(.+?)(?:\s*<\s*([^|]+?)\s*>)?$/i;
const INTERACTION = /^!!\s+([A-Za-z\s]+)(?:\s*-\s*([^<]*?))?(?:\s*<([^>]+)>)?$/;
const QUOTE = /^\^\s*(.+?)(?:\s*<\s*(.+?)\s*>)?$/;
const NARRATION = /^>\s*(.+)$/;
const NARRATION_LARGE = /^\s*>>\s+/;
const BREAK = /^\s*---\s*$/;
const CONTEXT = /^\s*<Context(?:\s+([^>]+))?>\s*(.*)$/i;
const TYPE = new RegExp(`^\\s*<type\\/(${Object.keys(SCRIPT_TYPE).join('|')})>\\s*$`, 'i');

function normalizeKey(key) {
    return key.trim().toLowerCase();
}

function isAllowedKey(key) {
    return SCRIPT_KEY.includes(normalizeKey(key));
}

function isValidAnimatedEmoji(prefix, suffix) {
    const prefixNorm = prefix.trim();
    const suffixNorm = suffix.trim();
    if (!ANIMATED_PREFIXES.includes(prefixNorm)) return false;
    const suffixes = ANIMATED_EMOJI_LIST[prefixNorm] || [];
    return suffixes.some(s => s.toLowerCase() === suffixNorm.toLowerCase());
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function processScriptParam(key, value) {
    const normalizedKey = normalizeKey(key);
    let result = { value: value, valid: true };

    if (normalizedKey === 'toggle') {
        const lowerVal = value.trim().toLowerCase();
        if (lowerVal === 'yes') {
            result.value = 'true';
        } else if (lowerVal === 'no') {
            result.value = 'false';
        } else if (lowerVal === 'collapsed') {
            result.value = 'Collapsed';
        } else {
            result.valid = false;
        }
    } else if (normalizedKey === 'hide title') {
        const lowerVal = value.trim().toLowerCase();
        if (lowerVal === 'yes') {
            result.value = 'true';
        } else if (lowerVal === 'no') {
            result.value = 'false';
        } else {
            result.valid = false;
        }
    }
    return result;
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

    if (line.match(CHOICE_START) || line.match(CHOICE_END) || line.match(CHOICE_TAB) ||
        line.match(PHONE_START) || line.match(PHONE_END)) {
        return { out: line, converted: true, blank: false };
    }

    const interactionMatch = line.match(INTERACTION);
    if (interactionMatch) {
        const type = interactionMatch[1].trim();
        if (!INTERACTION_TYPE_LIST.some(t => t.toLowerCase() === type.toLowerCase())) {
            return { out: line, converted: false };
        }
        let text = interactionMatch[2] ? interactionMatch[2].trim() : '';
        const opts = interactionMatch[3] ? interactionMatch[3].trim() : null;
        let rotate = null;
        let flip = false;

        if (opts) {
            const parts = opts.split('//').map(s => s.trim());
            if (parts.length === 2) {
                const num = parseFloat(parts[0]);
                if (Number.isInteger(num) && num >= 1 && num <= 360) {
                    rotate = num;
                } else {
                    return { out: line, converted: false };
                }
                if (parts[1].toLowerCase() === 'flip') {
                    flip = true;
                } else {
                    return { out: line, converted: false };
                }
            } else if (parts.length === 1) {
                const val = parts[0].toLowerCase();
                if (val === 'flip') {
                    flip = true;
                } else {
                    const num = parseFloat(val);
                    if (Number.isInteger(num) && num >= 1 && num <= 360) {
                        rotate = num;
                    } else {
                        return { out: line, converted: false };
                    }
                }
            } else {
                return { out: line, converted: false };
            }
        }

        let out = `{{Script/interaction|${type}`;
        if (text) out += `|${text}`;
        if (rotate !== null) out += `|Rotate=${rotate}`;
        if (flip) out += `|Flip=true`;
        out += '}}';
        return { out: out, converted: true };
    }

    const quoteMatch = line.match(QUOTE);
    if (quoteMatch) {
        const text = quoteMatch[1].trim();
        const sources = quoteMatch[2] ? quoteMatch[2].trim() : null;
        let out = '{{Script/quote|' + text;
        if (sources) {
            out += '|' + sources;
        }
        out += '}}';
        return { out: out, converted: true };
    }

    const narrationMatch = line.match(NARRATION);
    if (narrationMatch) {
        const text = narrationMatch[1].trim();
        return { out: `{{Script/narration|${text}}}`, converted: true };
    }

    const breakMatch = line.match(BREAK);
    if (breakMatch) {
        return { out: '{{Script/break}}', converted: true };
    }

    const contextMatch = line.match(CONTEXT);
    if (contextMatch) {
        const type = contextMatch[1] ? contextMatch[1].trim() : null;
        const text = contextMatch[2].trim();
        if (type) {
            return { out: `{{Script/context|Type=${type}|${text}}}`, converted: true };
        } else {
            return { out: `{{Script/context|${text}}}`, converted: true };
        }
    }

    const headingMatch = line.match(HEADING);
    if (headingMatch) {
        const text = headingMatch[1].trim();
        const subtitle = headingMatch[2] ? headingMatch[2].trim() : null;
        let out = '{{Script/heading|' + text;
        if (subtitle) {
            out += '|Subtitle=' + subtitle;
        }
        out += '}}';
        return { out: out, converted: true };
    }

    const typeMatch = line.match(TYPE);
    if (typeMatch) {
        const raw = typeMatch[1].toLowerCase();
        const type = SCRIPT_TYPE[raw];
        return { out: `{{Script/type|${type}}}`, converted: true };
    }

    let m = line.match(DIALOGUE_COVRD);
    if (m) {
        const character = m[1].trim();
        const override = m[2].trim();
        const expression = m[3] ? m[3].trim() : null;
        let dialogue = m[4].trim();

        const animatedMatch = dialogue.match(ANIMATED_EMOJI);
        if (animatedMatch) {
            const prefix = animatedMatch[1];
            const suffix = animatedMatch[2].trim();
            if (!isValidAnimatedEmoji(prefix, suffix)) {
                return { out: line, converted: false };
            }
            const fullTag = `${prefix}: ${suffix}`;
            return { out: `{{Script/animated emoji|${character}|${fullTag}}}`, converted: true };
        }

        let hasInvalidEmoji = false;
        dialogue = dialogue.replace(/<([^:>]+)>/g, function(match, emojiName) {
            if (EMOJI_LIST.includes(emojiName)) {
                return `{{Emoji|${emojiName}}}`;
            } else {
                hasInvalidEmoji = true;
                return match;
            }
        });
        if (hasInvalidEmoji) {
            return { out: line, converted: false };
        }

        const out = formatDialogue(character, dialogue, { expression, characterOverride: override });
        return { out: out, converted: true };
    }

    m = line.match(DIALOGUE_EXPR);
    if (m) {
        const character = m[1].trim();
        const expression = m[2].trim();
        let dialogue = m[3].trim();

        const animatedMatch = dialogue.match(ANIMATED_EMOJI);
        if (animatedMatch) {
            const prefix = animatedMatch[1];
            const suffix = animatedMatch[2].trim();
            if (!isValidAnimatedEmoji(prefix, suffix)) {
                return { out: line, converted: false };
            }
            const fullTag = `${prefix}: ${suffix}`;
            return { out: `{{Script/animated emoji|${character}|${fullTag}}}`, converted: true };
        }

        let hasInvalidEmoji = false;
        dialogue = dialogue.replace(/<([^:>]+)>/g, function(match, emojiName) {
            if (EMOJI_LIST.includes(emojiName)) {
                return `{{Emoji|${emojiName}}}`;
            } else {
                hasInvalidEmoji = true;
                return match;
            }
        });
        if (hasInvalidEmoji) {
            return { out: line, converted: false };
        }

        const out = formatDialogue(character, dialogue, { expression });
        return { out: out, converted: true };
    }

    m = line.match(DIALOGUE);
    if (m) {
        const character = m[1].trim();
        let dialogue = m[2].trim();

        const animatedMatch = dialogue.match(ANIMATED_EMOJI);
        if (animatedMatch) {
            const prefix = animatedMatch[1];
            const suffix = animatedMatch[2].trim();
            if (!isValidAnimatedEmoji(prefix, suffix)) {
                return { out: line, converted: false };
            }
            const fullTag = `${prefix}: ${suffix}`;
            return { out: `{{Script/animated emoji|${character}|${fullTag}}}`, converted: true };
        }

        let hasInvalidEmoji = false;
        dialogue = dialogue.replace(/<([^:>]+)>/g, function(match, emojiName) {
            if (EMOJI_LIST.includes(emojiName)) {
                return `{{Emoji|${emojiName}}}`;
            } else {
                hasInvalidEmoji = true;
                return match;
            }
        });
        if (hasInvalidEmoji) {
            return { out: line, converted: false };
        }

        const out = formatDialogue(character, dialogue, {});
        return { out: out, converted: true };
    }

    return { out: line, converted: false };
}

function processLines(lines, start = 0) {
    const output = [];
    let i = start;
    while (i < lines.length) {
        const line = lines[i];

        if (line.match(NARRATION_LARGE)) {
            const texts = [];
            while (i < lines.length && lines[i].match(NARRATION_LARGE)) {
                const match = lines[i].match(NARRATION_LARGE);
                if (match) {
                    texts.push(lines[i].replace(NARRATION_LARGE, '').trim());
                }
                i++;
            }
            if (texts.length > 0) {
                output.push(`{{Script/narration large|${texts.join(';;')}}}`);
            }
            continue;
        }

        if (line.match(CHOICE_START)) {
            const result = parseChoice(lines, i);
            output.push(...result.output);
            i = result.nextIndex;
            continue;
        }

        if (line.match(PHONE_START)) {
            const result = parsePhone(lines, i);
            output.push(...result.output);
            i = result.nextIndex;
            continue;
        }

        const converted = convertLine(line, false);
        if (!converted.blank) {
            output.push(converted.out);
        }
        i++;
    }
    return { output, nextIndex: i };
}

function parseChoice(lines, startIdx) {
    let i = startIdx + 1;
    let depth = 1;
    const contentLines = [];

    while (i < lines.length) {
        const line = lines[i];
        if (line.match(CHOICE_START)) {
            depth++;
        } else if (line.match(CHOICE_END)) {
            depth--;
            if (depth === 0) {
                i++;
                break;
            }
        }
        if (depth > 0) {
            contentLines.push(line);
        }
        i++;
    }

    if (depth !== 0) {
        contentLines.length = 0;
        for (let j = startIdx + 1; j < lines.length; j++) {
            contentLines.push(lines[j]);
        }
        i = lines.length;
    }

    const tabs = [];
    let currentTitle = null;
    let currentContent = [];
    let nestedDepth = 0;

    for (let j = 0; j < contentLines.length; j++) {
        const line = contentLines[j];

        if (line.match(CHOICE_START)) nestedDepth++;
        else if (line.match(CHOICE_END)) nestedDepth--;

        if (nestedDepth === 0) {
            const tabMatch = line.match(CHOICE_TAB);
            if (tabMatch) {
                if (currentTitle !== null) {
                    tabs.push({
                        title: currentTitle,
                        content: currentContent.join('\n')
                    });
                }
                currentTitle = tabMatch[1].trim();
                currentContent = [];
                continue;
            }
        }

        if (currentTitle !== null) {
            currentContent.push(line);
        }
    }

    if (currentTitle !== null) {
        tabs.push({
            title: currentTitle,
            content: currentContent.join('\n')
        });
    }

    if (tabs.length === 0) {
        tabs.push({
            title: '',
            content: contentLines.join('\n')
        });
    }

    const tabOutput = ['<tabber>'];
    for (const tab of tabs) {
        const tabLines = tab.content.split('\n');
        const processed = processLines(tabLines, 0);
        const innerOutput = processed.output;
        tabOutput.push(`|-|${tab.title} =`);
        if (innerOutput.length === 0) {
            tabOutput.push('');
        } else {
            tabOutput.push(...innerOutput);
        }
    }
    tabOutput.push('</tabber>');

    return { output: tabOutput, nextIndex: i };
}

function parsePhone(lines, startIdx) {
    const startLine = lines[startIdx];
    const phoneMatch = startLine.match(PHONE_START);
    if (!phoneMatch) {
        return { output: [startLine], nextIndex: startIdx + 1 };
    }

    const typeRaw = phoneMatch[1].toLowerCase();
    const type = PHONE_TYPE[typeRaw];
    let name = phoneMatch[2] ? phoneMatch[2].trim() : '';

    let endIdx = startIdx + 1;
    while (endIdx < lines.length) {
        if (lines[endIdx].match(PHONE_END)) {
            break;
        }
        endIdx++;
    }

    const contentLines = [];
    for (let j = startIdx + 1; j < endIdx; j++) {
        contentLines.push(lines[j]);
    }

    const processed = processLines(contentLines, 0);
    const dialogueContent = processed.output.join('\n');

    let phoneOut = `{{Script/phone|${type}`;
    if (name) {
        phoneOut += `|${name}`;
    }
    if (dialogueContent) {
        phoneOut += `| Dialogue =\n${dialogueContent}\n}}`;
    } else {
        phoneOut += `| Dialogue =}}`;
    }

    const nextIdx = (endIdx < lines.length && lines[endIdx].match(PHONE_END)) ? endIdx + 1 : endIdx;

    return { output: [phoneOut], nextIndex: nextIdx };
}

function convert() {
    const raw = document.getElementById('input').value;
    const lines = raw.split('\n');
    const outDiv = document.getElementById('output');

    const isScriptLine = new Array(lines.length).fill(false);
    const isFailedScriptLine = new Array(lines.length).fill(false);
    let scriptParams = null;
    let hasScriptBlock = false;

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        if (SCRIPT_NOBLOCK.test(line)) {
            hasScriptBlock = true;
            isScriptLine[i] = true;
            i++;
            continue;
        }

        if (SCRIPT_START.test(line) && !SCRIPT_NOBLOCK.test(line)) {
            let blockLines = [line];
            let blockStartIdx = i;
            let j = i + 1;
            let foundEnd = false;
            while (j < lines.length) {
                blockLines.push(lines[j]);
                if (SCRIPT_END.test(lines[j])) {
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
                        const processed = processScriptParam(key, value);
                        if (!processed.valid) {
                            valid = false;
                            break;
                        }
                        params[key] = processed.value;
                    } else {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    let lastLine = blockLines[blockLines.length - 1].trim();
                    let lastContent = lastLine.replace(SCRIPT_END, '').trim();
                    if (lastContent !== '') {
                        const colonIndex = lastContent.indexOf(':');
                        if (colonIndex !== -1) {
                            let key = lastContent.substring(0, colonIndex).trim();
                            let value = lastContent.substring(colonIndex + 1).trim();
                            if (!isAllowedKey(key)) {
                                valid = false;
                            }
                            if (valid) {
                                const processed = processScriptParam(key, value);
                                if (!processed.valid) {
                                    valid = false;
                                } else {
                                    params[key] = processed.value;
                                }
                            }
                        } else {
                            valid = false;
                        }
                    }
                }
                if (valid) {
                    for (let idx = blockStartIdx; idx <= j; idx++) {
                        isScriptLine[idx] = true;
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

    const contentLines = [];
    for (let idx = 0; idx < lines.length; idx++) {
        if (!isScriptLine[idx] && !isFailedScriptLine[idx]) {
            contentLines.push(lines[idx]);
        }
    }

    const result = processLines(contentLines, 0);
    let outLines = result.output;

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

    if (!raw.trim()) {
        outDiv.innerHTML = '<span class="placeholder">Formatted output will appear here…</span>';
        document.getElementById('status').className = 'status';
        return;
    }

    outDiv.innerHTML = outLines.map((line) => {
        const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<span class="line">${escaped || '&#8203;'}</span>`;
    }).join('');

    const status = document.getElementById('status');
    status.className = 'status show ok';
    status.innerHTML = `${outLines.length} line${outLines.length !== 1 ? 's' : ''} generated.`;

    updateBackdrop(lines, isScriptLine, isFailedScriptLine);
}

function updateBackdrop(lines, isScriptLine, isFailedScriptLine) {
    const backdrop = document.getElementById('input-backdrop');
    backdrop.innerHTML = lines.map((line, idx) => {
        const escaped = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        if (isScriptLine[idx] || isFailedScriptLine[idx]) {
            if (isFailedScriptLine[idx]) {
                return `<span class="bad">${escaped}</span>\n`;
            }
            return escaped + '\n';
        }
        const result = convertLine(line, false);
        if (!result.converted && !result.blank) {
            return `<span class="bad">${escaped}</span>\n`;
        } else {
            return escaped + '\n';
        }
    }).join('');
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