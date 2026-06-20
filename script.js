const input = document.getElementById('inputText');
const output = document.getElementById('outputText');
const historyList = document.getElementById('historyList');
const loader = document.getElementById('loader');
if(
localStorage.getItem(
'theme'
)==='true'
){

document.body.classList.add(
'dark'
);

}

const loadHistory = () => {
    const items = JSON.parse(localStorage.getItem('history') || '[]');
    historyList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
};

loadHistory();

input.addEventListener('input', () => {

    document.getElementById('count').textContent =
        input.value.length;

    const words = input.value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    document.getElementById('wordCount')
        .textContent = words + ' words';

});

document.getElementById('translateBtn').addEventListener('click', translateText);

async function translateText() {
    const source =
document.getElementById('sourceLang').value;

const target =
document.getElementById('targetLang').value;

if(source === target){

alert(
'Please select different languages'
);

return;

}


    const text = input.value.trim();

    if (!text) {
        alert("Please enter some text");
        return;
    }

    loader.classList.remove('hidden');

    try {

        const source = document.getElementById('sourceLang').value;
        const target = document.getElementById('targetLang').value;

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
        );

        const data = await response.json();

        output.value = data.responseData.translatedText;
        let total =
    localStorage.getItem('translationCount') || 0;

total++;

localStorage.setItem(
    'translationCount',
    total
);

document.getElementById(
    'totalTranslations'
).textContent = total;
        
        const history = JSON.parse(localStorage.getItem('history') || '[]');

        const time =
    new Date().toLocaleTimeString();

history.unshift(
`${text}
→
${data.responseData.translatedText}
(${time})`
);

        localStorage.setItem(
            'history',
            JSON.stringify(history.slice(0, 10))
        );

        loadHistory();
        document.getElementById(
    'totalTranslations'
).textContent =
localStorage.getItem(
    'translationCount'
) || 0;

    } catch (error) {

        console.error(error);

        output.value =
            "Translation failed. Check internet connection.";

    }

    loader.classList.add('hidden');
}

document.getElementById('copyBtn').addEventListener('click', () => {

    navigator.clipboard.writeText(output.value);

    alert('Copied Successfully!');

});

document.getElementById('speakBtn').addEventListener('click', () => {

    const speech = new SpeechSynthesisUtterance(output.value);

    speech.lang =
        document.getElementById('targetLang').value;

    speechSynthesis.speak(speech);

});

document.getElementById('downloadBtn').addEventListener('click', () => {

    const blob = new Blob(
        [output.value],
        { type: 'text/plain' }
    );

    const a = document.createElement('a');

    a.href = URL.createObjectURL(blob);

    a.download = 'translation.txt';

    a.click();

});

document.getElementById('swapBtn').addEventListener('click', () => {

    const source =
        document.getElementById('sourceLang');

    const target =
        document.getElementById('targetLang');

    const temp = source.value;

    source.value = target.value;

    target.value = temp;

});

document.getElementById('themeBtn').addEventListener('click', () => {

    document.body.classList.toggle('dark');

localStorage.setItem(
'theme',
document.body.classList.contains(
'dark'
)
);
    document.getElementById(
'clearBtn'
).addEventListener(
'click',
()=>{

input.value='';

output.value='';

document.getElementById(
'count'
).textContent='0';

document.getElementById(
'wordCount'
).textContent='0 words';

});
const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition =
new SpeechRecognition();

recognition.lang='en-US';

document
.getElementById('voiceBtn')
.addEventListener(
'click',
()=>{

recognition.start();

});

recognition.onresult=
(event)=>{

input.value=
event.results[0][0]
.transcript;

document.getElementById(
'count'
).textContent=
input.value.length;

};

}

});
