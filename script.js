/* ========================================================= */
/* LIBRO */
/* ========================================================= */

const book = document.getElementById("book");

const papers = Array.from(
    document.querySelectorAll(".paper")
);

let currentPage = 0;


/* ========================================================= */
/* ORDEN DE LAS HOJAS */
/* ========================================================= */

function updatePaperOrder() {

    papers.forEach((paper, index) => {

        if (index >= currentPage) {

            paper.style.zIndex =
                papers.length - index + 10;

        } else {

            paper.style.zIndex =
                index + 1;

        }

    });

}


/* ========================================================= */
/* POSICIÓN DEL LIBRO */
/* ========================================================= */

function updateBookPosition() {

    if (currentPage === 0) {

        book.classList.remove("open");

        book.classList.remove("finished");

        return;

    }


    if (currentPage === papers.length) {

        book.classList.remove("open");

        book.classList.add("finished");

        return;

    }


    book.classList.remove("finished");

    book.classList.add("open");

}


/* ========================================================= */
/* SIGUIENTE PÁGINA */
/* ========================================================= */

function nextPage() {

    if (currentPage >= papers.length) {
        return;
    }


    const paper =
        papers[currentPage];


    paper.classList.add("turning");

    paper.style.zIndex = 200;


    if (currentPage === 0) {

        book.classList.add("open");

    }


    paper.classList.add("flipped");


    currentPage++;


    if (currentPage === papers.length) {

        setTimeout(() => {

            updateBookPosition();

        }, 420);

    }


    setTimeout(() => {

        paper.classList.remove("turning");

        updatePaperOrder();


        if (
            currentPage !==
            papers.length
        ) {

            updateBookPosition();

        }

    }, 850);

}


/* ========================================================= */
/* PÁGINA ANTERIOR */
/* ========================================================= */

function previousPage() {

    if (currentPage <= 0) {
        return;
    }


    if (
        currentPage ===
        papers.length
    ) {

        book.classList.remove("finished");

        book.classList.add("open");

    }


    currentPage--;


    const paper =
        papers[currentPage];


    paper.classList.add("turning");

    paper.style.zIndex = 200;

    paper.classList.remove("flipped");


    setTimeout(() => {

        paper.classList.remove("turning");

        updatePaperOrder();

        updateBookPosition();

    }, 850);

}


/* ========================================================= */
/* ARRASTRAR HOJAS */
/* ========================================================= */

let dragging = false;

let dragDirection = null;

let dragPaper = null;

let startX = 0;

let dragProgress = 0;

let hasMoved = false;


book.addEventListener(
    "pointerdown",
    startDrag
);


function startDrag(event) {

    if (
        event.target.closest(
            "audio, video, iframe, button, a, input, textarea"
        )
    ) {
        return;
    }


    const rect =
        book.getBoundingClientRect();


    const clickX =
        event.clientX - rect.left;


    const middle =
        rect.width / 2;


    if (
        clickX >= middle &&
        currentPage < papers.length
    ) {

        dragDirection = "next";

        dragPaper =
            papers[currentPage];

    }


    else if (
        clickX < middle &&
        currentPage > 0
    ) {

        if (
            currentPage ===
            papers.length
        ) {

            book.classList.remove(
                "finished"
            );

            book.classList.add(
                "open"
            );

        }


        dragDirection =
            "previous";


        dragPaper =
            papers[
                currentPage - 1
            ];

    }


    else {

        return;

    }


    dragging = true;

    hasMoved = false;

    dragProgress = 0;

    startX =
        event.clientX;


    dragPaper.classList.add(
        "dragging",
        "turning"
    );


    dragPaper.style.zIndex = 300;


    try {

        book.setPointerCapture(
            event.pointerId
        );

    }

    catch (error) {

        console.log(error);

    }

}


/* ========================================================= */
/* MOVIMIENTO DE HOJA */
/* ========================================================= */

book.addEventListener(
    "pointermove",
    moveDrag
);


function moveDrag(event) {

    if (!dragging) {
        return;
    }


    const rect =
        book.getBoundingClientRect();


    const distance =
        event.clientX - startX;


    if (
        Math.abs(distance) > 4
    ) {

        hasMoved = true;

    }


    if (
        dragDirection === "next"
    ) {

        dragProgress =
            Math.min(
                Math.max(
                    -distance /
                    (rect.width * 0.32),
                    0
                ),
                1
            );


        const angle =
            -180 * dragProgress;


        dragPaper.style.transform =
            `rotateY(${angle}deg)`;


        dragPaper.style.setProperty(
            "--turn-shadow",
            dragProgress
        );

    }


    else if (
        dragDirection ===
        "previous"
    ) {

        dragProgress =
            Math.min(
                Math.max(
                    distance /
                    (rect.width * 0.32),
                    0
                ),
                1
            );


        const angle =
            -180 +
            (180 * dragProgress);


        dragPaper.style.transform =
            `rotateY(${angle}deg)`;


        dragPaper.style.setProperty(
            "--turn-shadow",
            1 - dragProgress
        );

    }

}


/* ========================================================= */
/* SOLTAR HOJA */
/* ========================================================= */

book.addEventListener(
    "pointerup",
    endDrag
);


book.addEventListener(
    "pointercancel",
    endDrag
);


function endDrag() {

    if (!dragging) {
        return;
    }


    dragging = false;


    dragPaper.classList.remove(
        "dragging"
    );


    if (!hasMoved) {

        dragPaper.style.transform =
            "";


        dragPaper.style.removeProperty(
            "--turn-shadow"
        );


        dragPaper.classList.remove(
            "turning"
        );


        if (
            dragDirection === "next"
        ) {

            nextPage();

        } else {

            previousPage();

        }


        resetDrag();

        return;

    }


    const completeTurn =
        dragProgress > 0.28;


    if (completeTurn) {


        if (
            dragDirection === "next"
        ) {

            dragPaper.classList.add(
                "flipped"
            );


            currentPage++;


            if (
                currentPage > 0 &&
                currentPage <
                papers.length
            ) {

                book.classList.add(
                    "open"
                );

            }


            if (
                currentPage ===
                papers.length
            ) {

                setTimeout(() => {

                    updateBookPosition();

                }, 420);

            }

        }


        else {

            dragPaper.classList.remove(
                "flipped"
            );


            currentPage--;


            if (
                currentPage === 0
            ) {

                setTimeout(() => {

                    updateBookPosition();

                }, 550);

            }

            else {

                updateBookPosition();

            }

        }

    }


    requestAnimationFrame(() => {

        dragPaper.style.transform =
            "";


        dragPaper.style.removeProperty(
            "--turn-shadow"
        );

    });


    setTimeout(() => {

        dragPaper.classList.remove(
            "turning"
        );


        updatePaperOrder();


        if (
            currentPage !==
            papers.length
        ) {

            updateBookPosition();

        }

    }, 900);


    resetDrag();

}


/* ========================================================= */
/* RESET DE ARRASTRE */
/* ========================================================= */

function resetDrag() {

    dragDirection = null;

    dragPaper = null;

    dragProgress = 0;

    hasMoved = false;

}


/* ========================================================= */
/* FLECHAS DE TECLADO */
/* ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "ArrowRight"
        ) {

            nextPage();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousPage();

        }

    }
);


/* ========================================================= */
/* MÚSICA */
/* ========================================================= */

const backgroundMusic =
    document.getElementById(
        "backgroundMusic"
    );


const musicButton =
    document.getElementById(
        "musicButton"
    );


const musicDisc =
    document.getElementById(
        "musicDisc"
    );


backgroundMusic.volume = 0.32;


musicButton.addEventListener(
    "click",
    toggleBackgroundMusic
);


function toggleBackgroundMusic() {

    if (
        backgroundMusic.paused
    ) {

        backgroundMusic
            .play()
            .then(() => {

                musicButton.textContent =
                    "❚❚";


                musicDisc.classList.add(
                    "playing"
                );

            })
            .catch(error => {

                console.log(
                    "Audio bloqueado:",
                    error
                );

            });

    }

    else {

        pauseBackgroundMusic();

    }

}


function pauseBackgroundMusic() {

    backgroundMusic.pause();


    musicButton.textContent =
        "▶";


    musicDisc.classList.remove(
        "playing"
    );

}


/* ========================================================= */
/* AUDIO DE VOZ */
/* ========================================================= */

const voiceAudios =
    document.querySelectorAll(
        ".voice-audio"
    );


let resumeBackgroundAfterVoice =
    false;


voiceAudios.forEach(audio => {


    audio.addEventListener(
        "play",
        function () {

            resumeBackgroundAfterVoice =
                !backgroundMusic.paused;


            if (
                resumeBackgroundAfterVoice
            ) {

                pauseBackgroundMusic();

            }

        }
    );


    audio.addEventListener(
        "ended",
        function () {

            if (
                resumeBackgroundAfterVoice
            ) {

                backgroundMusic
                    .play()
                    .then(() => {

                        musicButton.textContent =
                            "❚❚";


                        musicDisc.classList.add(
                            "playing"
                        );

                    });

            }


            resumeBackgroundAfterVoice =
                false;

        }
    );


});


/* ========================================================= */
/* EVITAR ARRASTRAR IMÁGENES */
/* ========================================================= */

document
    .querySelectorAll("img")
    .forEach(image => {

        image.draggable = false;

    });


/* ========================================================= */
/* BOTÓN ¿EL FINAL? */
/* ========================================================= */

const finalButton =
    document.getElementById(
        "finalButton"
    );


const mainScene =
    document.getElementById(
        "mainScene"
    );


const finaleScreen =
    document.getElementById(
        "finaleScreen"
    );


finalButton.addEventListener(
    "click",
    function () {

        mainScene.classList.add(
            "hide-book"
        );


        document
            .querySelectorAll(
                ".carnation-band"
            )
            .forEach(band => {

                band.style.opacity = "0";

            });


        setTimeout(() => {

            finaleScreen.classList.add(
                "active"
            );

        }, 400);

    }
);


/* ========================================================= */
/* BOTONES SÍ / NO */
/* ========================================================= */

const yesButton =
    document.getElementById(
        "yesButton"
    );


const noButton =
    document.getElementById(
        "noButton"
    );


const answerArea =
    document.getElementById(
        "answerArea"
    );


const finalQuestion =
    document.getElementById(
        "finalQuestion"
    );


const loveStage =
    document.getElementById(
        "loveStage"
    );


let noMovementInterval = null;

let noIsRunning = false;


/* ========================================================= */
/* MOVER BOTÓN NO */
/* ========================================================= */

function moveNoButton() {

    const areaRect =
        answerArea.getBoundingClientRect();


    const buttonRect =
        noButton.getBoundingClientRect();


    const maxX =
        areaRect.width -
        buttonRect.width;


    const maxY =
        areaRect.height -
        buttonRect.height;


    const randomX =
        Math.random() *
        Math.max(maxX, 0);


    const randomY =
        Math.random() *
        Math.max(maxY, 0);


    noButton.style.left =
        `${randomX}px`;


    noButton.style.top =
        `${randomY}px`;


    noButton.style.right =
        "auto";

}


/* ========================================================= */
/* AL PRESIONAR NO */
/* ========================================================= */

noButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        moveNoButton();


        if (!noIsRunning) {

            noIsRunning = true;


            noMovementInterval =
                setInterval(
                    moveNoButton,
                    480
                );

        }

    }
);


/*
    Una vez que ella intentó poner NO,
    incluso acercarse con el mouse hará
    que intente escapar.
*/

noButton.addEventListener(
    "pointerenter",
    function () {

        if (noIsRunning) {

            moveNoButton();

        }

    }
);


/* ========================================================= */
/* BASE DE TRADUCCIONES */
/* ========================================================= */

/*
    Esta es una base de idiomas reales.
    Se reutilizan como variantes para
    construir el efecto de 999 mensajes.

    El mensaje número 1000 siempre será
    el español especial del final.
*/

const loveTranslations = [

    ["English", "I love you"],
    ["French", "Je t'aime"],
    ["Italian", "Ti amo"],
    ["Portuguese", "Eu te amo"],
    ["German", "Ich liebe dich"],
    ["Dutch", "Ik hou van jou"],
    ["Afrikaans", "Ek is lief vir jou"],
    ["Swedish", "Jag älskar dig"],
    ["Norwegian", "Jeg elsker deg"],
    ["Danish", "Jeg elsker dig"],
    ["Icelandic", "Ég elska þig"],
    ["Finnish", "Rakastan sinua"],
    ["Estonian", "Ma armastan sind"],
    ["Latvian", "Es tevi mīlu"],
    ["Lithuanian", "Aš tave myliu"],
    ["Polish", "Kocham cię"],
    ["Czech", "Miluji tě"],
    ["Slovak", "Ľúbim ťa"],
    ["Slovenian", "Ljubim te"],
    ["Croatian", "Volim te"],
    ["Bosnian", "Volim te"],
    ["Serbian", "Волим те"],
    ["Macedonian", "Те сакам"],
    ["Bulgarian", "Обичам те"],
    ["Romanian", "Te iubesc"],
    ["Hungarian", "Szeretlek"],
    ["Albanian", "Të dua"],
    ["Greek", "Σ' αγαπώ"],
    ["Turkish", "Seni seviyorum"],
    ["Azerbaijani", "Mən səni sevirəm"],
    ["Georgian", "მიყვარხარ"],
    ["Armenian", "Ես սիրում եմ քեզ"],
    ["Russian", "Я тебя люблю"],
    ["Ukrainian", "Я тебе кохаю"],
    ["Belarusian", "Я цябе кахаю"],
    ["Hebrew", "אני אוהב אותך"],
    ["Arabic", "أحبك"],
    ["Persian", "دوستت دارم"],
    ["Kurdish", "Ez te hez dikim"],
    ["Hindi", "मैं तुमसे प्यार करता हूँ"],
    ["Urdu", "میں تم سے محبت کرتا ہوں"],
    ["Bengali", "আমি তোমাকে ভালোবাসি"],
    ["Punjabi", "ਮੈਂ ਤੈਨੂੰ ਪਿਆਰ ਕਰਦਾ ਹਾਂ"],
    ["Gujarati", "હું તને પ્રેમ કરું છું"],
    ["Marathi", "मी तुझ्यावर प्रेम करतो"],
    ["Nepali", "म तिमीलाई माया गर्छु"],
    ["Sinhala", "මම ඔයාට ආදරෙයි"],
    ["Tamil", "நான் உன்னை காதலிக்கிறேன்"],
    ["Telugu", "నేను నిన్ను ప్రేమిస్తున్నాను"],
    ["Kannada", "ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ"],
    ["Malayalam", "ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു"],
    ["Odia", "ମୁଁ ତୁମକୁ ଭଲ ପାଏ"],
    ["Assamese", "মই তোমাক ভাল পাওঁ"],
    ["Chinese", "我爱你"],
    ["Japanese", "愛してる"],
    ["Korean", "사랑해"],
    ["Mongolian", "Би чамд хайртай"],
    ["Vietnamese", "Anh yêu em"],
    ["Thai", "ฉันรักคุณ"],
    ["Khmer", "ខ្ញុំស្រឡាញ់អ្នក"],
    ["Lao", "ຂ້ອຍຮັກເຈົ້າ"],
    ["Burmese", "မင်းကိုချစ်တယ်"],
    ["Indonesian", "Aku cinta kamu"],
    ["Malay", "Saya cintakan awak"],
    ["Tagalog", "Mahal kita"],
    ["Cebuano", "Gihigugma tika"],
    ["Javanese", "Aku tresna sampeyan"],
    ["Sundanese", "Abdi bogoh ka anjeun"],
    ["Māori", "Aroha ahau ki a koe"],
    ["Hawaiian", "Aloha wau iā ʻoe"],
    ["Samoan", "Ou te alofa ia te oe"],
    ["Tongan", "ʻOku ou ʻofa atu"],
    ["Fijian", "Au domoni iko"],
    ["Swahili", "Nakupenda"],
    ["Zulu", "Ngiyakuthanda"],
    ["Xhosa", "Ndiyakuthanda"],
    ["Sesotho", "Kea u rata"],
    ["Tswana", "Ke a go rata"],
    ["Shona", "Ndinokuda"],
    ["Somali", "Waan ku jeclahay"],
    ["Yoruba", "Mo nifẹ rẹ"],
    ["Igbo", "A hụrụ m gị n'anya"],
    ["Hausa", "Ina son ki"],
    ["Malagasy", "Tiako ianao"],
    ["Kinyarwanda", "Ndagukunda"],
    ["Kirundi", "Ndagukunda"],
    ["Lingala", "Nalingi yo"],
    ["Luganda", "Nkwagala"],
    ["Wolof", "Dama la bëgg"],
    ["Chichewa", "Ndimakukonda"],
    ["Catalan", "T'estimo"],
    ["Galician", "Quérote"],
    ["Basque", "Maite zaitut"],
    ["Welsh", "Rwy'n dy garu di"],
    ["Irish", "Tá grá agam duit"],
    ["Scottish Gaelic", "Tha gaol agam ort"],
    ["Breton", "Me az kar"],
    ["Esperanto", "Mi amas vin"],
    ["Latin", "Te amo"],
    ["Luxembourgish", "Ech hunn dech gär"],
    ["Maltese", "Inħobbok"],
    ["Frisian", "Ik hâld fan dy"],
    ["Yiddish", "איך האָב דיך ליב"],
    ["Faroese", "Eg elski teg"],
    ["Corsican", "Ti tengu caru"],
    ["Occitan", "T'aimi"],
    ["Romansh", "Jau t'aim"],
    ["Haitian Creole", "Mwen renmen ou"],
    ["Papiamento", "Mi stima bo"],
    ["Guaraní", "Rohayhu"],
    ["Nahuatl", "Nimitztlazohtla"],
    ["Kazakh", "Мен сені сүйемін"],
    ["Uzbek", "Men seni sevaman"],
    ["Kyrgyz", "Мен сени сүйөм"],
    ["Tajik", "Ман туро дӯст медорам"],
    ["Turkmen", "Men seni söýýärin"],
    ["Pashto", "زه تا سره مینه لرم"],
    ["Tatar", "Мин сине яратам"],
    ["Bashkir", "Мин һине яратам"],
    ["Uyghur", "مەن سىزنى سۆيىمەن"]

];


/* ========================================================= */
/* CREAR UNA ENTRADA */
/* ========================================================= */

function createLoveItem(
    number,
    language,
    phrase,
    variant
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "love-item";


    const variantText =
        variant > 1
            ? ` · ${variant}`
            : "";


    item.innerHTML = `

        <span class="love-number">
            ${number.toString().padStart(4, "0")}
        </span>

        <span class="love-phrase">
            ${phrase}
        </span>

        <span class="love-language">
            ${language}${variantText}
        </span>

    `;


    return item;

}


/* ========================================================= */
/* ESPERA */
/* ========================================================= */

function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

}


/* ========================================================= */
/* ANIMAR LOS 999 PRIMEROS */
/* ========================================================= */

const loveGrid =
    document.getElementById(
        "loveGrid"
    );


const loveCounter =
    document.getElementById(
        "loveCounter"
    );


const ultimateLove =
    document.getElementById(
        "ultimateLove"
    );


let loveAnimationStarted =
    false;


async function startLoveLanguages() {

    if (loveAnimationStarted) {
        return;
    }


    loveAnimationStarted = true;


    let delay = 215;


    const minimumDelay = 7;


    for (
        let i = 1;
        i <= 999;
        i++
    ) {

        const baseIndex =
            (i - 1) %
            loveTranslations.length;


        const variant =
            Math.floor(
                (i - 1) /
                loveTranslations.length
            ) + 1;


        const [
            language,
            phrase
        ] =
            loveTranslations[
                baseIndex
            ];


        const item =
            createLoveItem(
                i,
                language,
                phrase,
                variant
            );


        loveGrid.appendChild(
            item
        );


        loveCounter.textContent =
            `${i} / 1000`;


        /*
            Cada vez aparecen más rápido.
        */

        delay =
            Math.max(
                minimumDelay,
                delay * 0.982
            );


        /*
            Evitamos hacer scroll
            absolutamente en cada elemento.
        */

        if (
            i % 9 === 0
        ) {

            item.scrollIntoView({

                behavior:
                    delay > 40
                        ? "smooth"
                        : "auto",

                block: "end"

            });

        }


        await wait(delay);

    }


    /*
        El número 1000.
    */

    loveCounter.textContent =
        "1000 / 1000";


    await wait(700);


    ultimateLove.classList.add(
        "show"
    );


    ultimateLove.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/* ========================================================= */
/* BOTÓN SÍ */
/* ========================================================= */

yesButton.addEventListener(
    "click",
    function () {

        if (
            noMovementInterval
        ) {

            clearInterval(
                noMovementInterval
            );

        }


        noButton.style.display =
            "none";


        yesButton.disabled =
            true;


        finalQuestion.classList.add(
            "hide-question"
        );


        setTimeout(() => {

            loveStage.classList.add(
                "active"
            );


            loveStage.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });


            startLoveLanguages();

        }, 500);

    }
);


/* ========================================================= */
/* INICIALIZAR */
/* ========================================================= */

updatePaperOrder();

updateBookPosition();