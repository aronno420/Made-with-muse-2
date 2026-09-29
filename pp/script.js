/* =====================================
   VARIABLES
===================================== */

let scene;
let camera;
let renderer;

let head;
let leftArm;
let rightArm;

let characterGroup;
let boardMesh;

let isTalking = false;


/* =====================================
   BACKGROUND MUSIC
===================================== */

const backgroundMusic =
    document.getElementById("backgroundMusic");


/*
   Music volume

   0.0 = mute
   0.5 = medium
   1.0 = full volume
*/

backgroundMusic.volume = 0.35;


/* =====================================
   START MUSIC
===================================== */

function startMusic() {

    backgroundMusic.volume = 0.35;

    backgroundMusic.play()
        .then(function () {

            console.log(
                "🎵 Background Music Started!"
            );

        })
        .catch(function (error) {

            console.log(
                "Autoplay blocked:",
                error
            );

        });

}


/* =====================================
   LOADING SCREEN
===================================== */

window.addEventListener(
    "DOMContentLoaded",
    function () {


        const loadingBar =
            document.getElementById(
                "loading-bar"
            );


        const loadingScreen =
            document.getElementById(
                "loading-screen"
            );


        const mainContent =
            document.getElementById(
                "main-content"
            );


        const enterButton =
            document.getElementById(
                "enter-button"
            );


        const splashText =
            document.getElementById(
                "splash-text"
            );


        let progress = 0;


        /*
           Loading Messages
        */

        const messages = [

            "Loading Terrain...",

            "Generating World...",

            "Loading Character...",

            "Preparing Made with Muse...",

            "Almost Ready..."

        ];


        let messageIndex = 0;


        const messageTimer =
            setInterval(function () {


                if (messageIndex <
                    messages.length) {

                    splashText.innerText =
                        messages[messageIndex];

                    messageIndex++;

                }


            }, 600);



        /*
           Loading Bar
        */

        const interval =
            setInterval(function () {


                progress +=
                    Math.floor(
                        Math.random() * 12
                    ) + 5;


                if (progress >= 100) {

                    progress = 100;

                }


                loadingBar.style.width =
                    progress + "%";


                if (progress === 100) {


                    clearInterval(interval);

                    clearInterval(messageTimer);


                    splashText.innerText =
                        "World Ready!";


                    /*
                       Automatically try music
                    */

                    startMusic();


                    /*
                       Show Enter button
                    */

                    enterButton.style.display =
                        "block";


                }


            }, 150);



        /*
           Enter Website
        */

        enterButton.addEventListener(
            "click",
            function () {


                /*
                   User clicked,
                   so browser allows audio
                */

                startMusic();


                /*
                   Hide Loading Screen
                */

                loadingScreen.style.opacity =
                    "0";

                loadingScreen.style.visibility =
                    "hidden";


                /*
                   Show Website
                */

                mainContent.style.opacity =
                    "1";


                /*
                   Character speaks
                */

                setTimeout(
                    function () {

                        speakMessage();

                    },
                    700
                );


            }
        );


    }
);


/* =====================================
   CHARACTER VOICE
===================================== */

function speakMessage() {


    /*
       Make sure music is playing
    */

    startMusic();


    if (
        "speechSynthesis"
        in window
    ) {


        /*
           Stop previous voice
        */

        window.speechSynthesis.cancel();


        /*
           Get character message
        */

        const messageText =
            document
                .getElementById(
                    "speech-bubble"
                )
                .innerText;


        /*
           Create Voice
        */

        const utterance =
            new SpeechSynthesisUtterance(
                messageText
            );


        /*
           Voice Settings
        */

        utterance.lang =
            "en-US";


        utterance.pitch =
            1.3;


        utterance.rate =
            0.95;


        /*
           Find English Voice
        */

        const voices =
            window.speechSynthesis
                .getVoices();


        const femaleVoice =
            voices.find(
                function (voice) {


                    return (
                        voice.lang
                            .startsWith("en")
                        &&
                        (
                            voice.name
                                .includes("Female")

                            ||

                            voice.name
                                .includes(
                                    "Google US English"
                                )

                            ||

                            voice.name
                                .includes(
                                    "Samantha"
                                )

                            ||

                            voice.name
                                .includes(
                                    "Zira"
                                )
                        )
                    );


                }
            )
            ||
            voices.find(
                function (voice) {

                    return voice.lang
                        .startsWith("en");

                }
            );


        if (femaleVoice) {

            utterance.voice =
                femaleVoice;

        }


        /*
           Talking Animation
        */

        utterance.onstart =
            function () {

                isTalking = true;

            };


        utterance.onend =
            function () {

                isTalking = false;

            };


        /*
           Start Character Voice
        */

        window.speechSynthesis
            .speak(utterance);

    }

}


/* =====================================
   VOICES READY
===================================== */

if (
    "speechSynthesis"
    in window
) {


    window.speechSynthesis
        .onvoiceschanged =
        function () {

            window.speechSynthesis
                .getVoices();

        };

}


/* =====================================
   BOARD TEXTURE
===================================== */

function createBoardTexture() {


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 1024;

    canvas.height = 600;


    const ctx =
        canvas.getContext("2d");


    /*
       Wooden Background
    */

    ctx.fillStyle =
        "#4a2c11";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
       Border
    */

    ctx.lineWidth = 20;

    ctx.strokeStyle =
        "#261405";

    ctx.strokeRect(
        15,
        15,
        canvas.width - 30,
        canvas.height - 30
    );


    /*
       Text
    */

    const textLines = [


        {
            text:
                "Thank you for purchasing",

            color:
                "#ffff55",

            font:
                "bold 44px sans-serif"
        },


        {
            text:
                "our product!",

            color:
                "#ffff55",

            font:
                "bold 44px sans-serif"
        },


        {
            text:
                "Scan QR code to connect with",

            color:
                "#ffffff",

            font:
                "bold 36px sans-serif"
        },


        {
            text:
                "Made with Muse! 🌸",

            color:
                "#ff99dd",

            font:
                "bold 42px sans-serif"
        },


        {
            text:
                "Explore handmade floral creations",

            color:
                "#ffffff",

            font:
                "bold 34px sans-serif"
        },


        {
            text:
                "crafted for special moments! ✨",

            color:
                "#55ff55",

            font:
                "bold 34px sans-serif"
        }


    ];


    let startY = 90;

    const lineHeight = 75;


    ctx.textAlign =
        "center";


    textLines.forEach(
        function (lineObj) {


            /*
               Shadow
            */

            ctx.fillStyle =
                "#000000";

            ctx.font =
                lineObj.font;


            ctx.fillText(
                lineObj.text,

                canvas.width / 2 + 4,

                startY + 4
            );


            /*
               Main Text
            */

            ctx.fillStyle =
                lineObj.color;


            ctx.fillText(
                lineObj.text,

                canvas.width / 2,

                startY
            );


            startY +=
                lineHeight;


        }
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.needsUpdate =
        true;


    return texture;

}


/* =====================================
   THREE.JS 3D CHARACTER
===================================== */

function init3D() {


    const container =
        document.getElementById(
            "canvas-container"
        );


    scene =
        new THREE.Scene();


    /*
       Camera
    */

    camera =
        new THREE.PerspectiveCamera(
            45,

            container.clientWidth /
            container.clientHeight,

            0.1,

            1000
        );


    camera.position.set(
        0,
        2.0,
        7.8
    );


    camera.lookAt(
        0,
        0.5,
        0
    );


    /*
       Renderer
    */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );


    renderer.shadowMap.enabled =
        true;


    container.appendChild(
        renderer.domElement
    );


    /*
       Lights
    */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.9
        );


    scene.add(
        ambientLight
    );


    const dirLight =
        new THREE.DirectionalLight(
            0xffffff,
            0.5
        );


    dirLight.position.set(
        5,
        10,
        7
    );


    scene.add(
        dirLight
    );


    /*
       Materials
    */

    const skinMat =
        new THREE.MeshLambertMaterial({
            color: 0xc68642
        });


    const pinkMat =
        new THREE.MeshLambertMaterial({
            color: 0xff66a3
        });


    const darkPantsMat =
        new THREE.MeshLambertMaterial({
            color: 0x333344
        });


    const hairMat =
        new THREE.MeshLambertMaterial({
            color: 0x4a2810
        });


    const grassMat =
        new THREE.MeshLambertMaterial({
            color: 0x55ff55
        });


    const dirtMat =
        new THREE.MeshLambertMaterial({
            color: 0x866043
        });


    const woodSideMat =
        new THREE.MeshLambertMaterial({
            color: 0x261405
        });


    /*
       Board Texture
    */

    const boardTexture =
        createBoardTexture();


    const boardFrontMat =
        new THREE.MeshBasicMaterial({
            map: boardTexture
        });


    const boardMaterials = [

        woodSideMat,

        woodSideMat,

        woodSideMat,

        woodSideMat,

        boardFrontMat,

        woodSideMat

    ];


    /*
       Character
    */

    characterGroup =
        new THREE.Group();


    /*
       Head
    */

    const headGeo =
        new THREE.BoxGeometry(
            1.2,
            1.2,
            1.2
        );


    head =
        new THREE.Mesh(
            headGeo,
            skinMat
        );


    head.position.y =
        2.0;


    /*
       Hair
    */

    const hairGeo =
        new THREE.BoxGeometry(
            1.24,
            0.4,
            1.24
        );


    const hair =
        new THREE.Mesh(
            hairGeo,
            hairMat
        );


    hair.position.y =
        0.48;


    head.add(
        hair
    );


    characterGroup.add(
        head
    );


    /*
       Body
    */

    const bodyGeo =
        new THREE.BoxGeometry(
            1.2,
            1.8,
            0.6
        );


    const body =
        new THREE.Mesh(
            bodyGeo,
            pinkMat
        );


    body.position.y =
        0.5;


    characterGroup.add(
        body
    );


    /*
       Left Arm
    */

    const armGeo =
        new THREE.BoxGeometry(
            0.45,
            1.7,
            0.45
        );


    leftArm =
        new THREE.Mesh(
            armGeo,
            pinkMat
        );


    leftArm.position.set(
        -0.85,
        0.55,
        0.1
    );


    leftArm.rotation.x =
        -Math.PI / 3;


    leftArm.rotation.z =
        Math.PI / 16;


    characterGroup.add(
        leftArm
    );


    /*
       Right Arm
    */

    rightArm =
        new THREE.Mesh(
            armGeo,
            pinkMat
        );


    rightArm.position.set(
        0.85,
        0.55,
        0.1
    );


    rightArm.rotation.x =
        -Math.PI / 3;


    rightArm.rotation.z =
        -Math.PI / 16;


    characterGroup.add(
        rightArm
    );


    /*
       Legs
    */

    const legGeo =
        new THREE.BoxGeometry(
            0.5,
            1.7,
            0.5
        );


    const leftLeg =
        new THREE.Mesh(
            legGeo,
            darkPantsMat
        );


    leftLeg.position.set(
        -0.3,
        -1.25,
        0
    );


    characterGroup.add(
        leftLeg
    );


    const rightLeg =
        new THREE.Mesh(
            legGeo,
            darkPantsMat
        );


    rightLeg.position.set(
        0.3,
        -1.25,
        0
    );


    characterGroup.add(
        rightLeg
    );


    /*
       Board
    */

    const boardGeo =
        new THREE.BoxGeometry(
            3.6,
            2.1,
            0.12
        );


    boardMesh =
        new THREE.Mesh(
            boardGeo,
            boardMaterials
        );


    boardMesh.position.set(
        0,
        0.25,
        1.25
    );


    characterGroup.add(
        boardMesh
    );


    scene.add(
        characterGroup
    );


    /*
       Grass Platform
    */

    const blockGroup =
        new THREE.Group();


    const grassTopGeo =
        new THREE.BoxGeometry(
            5.5,
            0.4,
            5.5
        );


    const grassTop =
        new THREE.Mesh(
            grassTopGeo,
            grassMat
        );


    grassTop.position.y =
        -2.3;


    blockGroup.add(
        grassTop
    );


    const dirtGeo =
        new THREE.BoxGeometry(
            5.5,
            2,
            5.5
        );


    const dirt =
        new THREE.Mesh(
            dirtGeo,
            dirtMat
        );


    dirt.position.y =
        -3.5;


    blockGroup.add(
        dirt
    );


    scene.add(
        blockGroup
    );


    /*
       Animation
    */

    const clock =
        new THREE.Clock();


    function animate() {


        requestAnimationFrame(
            animate
        );


        const elapsedTime =
            clock.getElapsedTime();


        /*
           Idle Movement
        */

        characterGroup.position.y =
            Math.sin(
                elapsedTime * 2
            ) * 0.03;


        /*
           Talking Animation
        */

        if (isTalking) {


            head.rotation.y =
                Math.sin(
                    elapsedTime * 12
                ) * 0.08;


            head.rotation.x =
                Math.abs(
                    Math.sin(
                        elapsedTime * 15
                    )
                ) * 0.05;


            boardMesh.position.y =
                0.25 +
                Math.sin(
                    elapsedTime * 8
                ) * 0.015;


        } else {


            head.rotation.y =
                Math.sin(
                    elapsedTime
                ) * 0.04;


            head.rotation.x =
                0;


            boardMesh.position.y =
                0.25;

        }


        renderer.render(
            scene,
            camera
        );

    }


    animate();


    /*
       Window Resize
    */

    window.addEventListener(
        "resize",
        function () {


            const w =
                container.clientWidth;


            const h =
                container.clientHeight;


            camera.aspect =
                w / h;


            camera.updateProjectionMatrix();


            renderer.setSize(
                w,
                h
            );


        }
    );

}


/* =====================================
   START 3D
===================================== */

window.addEventListener(
    "load",
    init3D
);