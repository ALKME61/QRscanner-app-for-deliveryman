<template>
    <div class="main">
        <div class="qrcode-container">
            <qrcode-stream :constraints="selectedConstraints" :track="paintCenterText" :formats="selectedBarcodeFormats"
                @error="onError" @detect="onDetect" @camera-on="onCameraReady" />

            <!-- Overlay маска -->
            <div class="scanner-overlay">
                <!-- Полупрозрачные области -->
                <div class="overlay-top"></div>
                <div class="overlay-middle">
                    <div class="overlay-left"></div>
                    <div class="scan-window">
                        <!-- Уголки для обозначения области сканирования -->
                        <div class="corner corner-tl"></div>
                        <div class="corner corner-tr"></div>
                        <div class="corner corner-bl"></div>
                        <div class="corner corner-br"></div>
                    </div>
                    <div class="overlay-right"></div>
                </div>
                <div class="overlay-bottom">
                    <div class="scan-instruction">
                        <p>Наведите камеру на QR-код</p>
                        <div v-if="result" class="scan-result">
                            <b>Сканировано: {{ result }}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

/*** detection handling ***/
const result = ref('')

function onDetect(detectedCodes) {
    console.log(detectedCodes)
    if (detectedCodes.length > 0) {
        result.value = detectedCodes[0].rawValue
    }
}

/*** select camera ***/
const selectedConstraints = ref({ facingMode: 'environment' })
const defaultConstraintOptions = [
    { label: 'rear camera', constraints: { facingMode: 'environment' } },
    { label: 'front camera', constraints: { facingMode: 'user' } },
]
const constraintOptions = ref(defaultConstraintOptions)

async function onCameraReady() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(({ kind }) => kind === 'videoinput')

        constraintOptions.value = [
            ...defaultConstraintOptions,
            ...videoDevices.map(({ deviceId, label }) => ({
                label: `${label} (ID: ${deviceId})`,
                constraints: { deviceId },
            })),
        ]
        error.value = ''
    } catch (err) {
        console.error('Error enumerating devices:', err)
    }
}

/*** track functions ***/
function paintCenterText(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode

        const centerX = boundingBox.x + boundingBox.width / 2
        const centerY = boundingBox.y + boundingBox.height / 2

        const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'

        ctx.lineWidth = 3
        ctx.strokeStyle = '#35495e'
        ctx.strokeText(detectedCode.rawValue, centerX, centerY)

        ctx.fillStyle = '#5cb984'
        ctx.fillText(rawValue, centerX, centerY)
    }
}

/*** barcode formats ***/
const barcodeFormats = ref({
    aztec: false,
    code_128: false,
    code_39: false,
    code_93: false,
    codabar: false,
    databar: false,
    databar_expanded: false,
    data_matrix: false,
    dx_film_edge: false,
    ean_13: false,
    ean_8: false,
    itf: false,
    maxi_code: false,
    micro_qr_code: false,
    pdf417: false,
    qr_code: true,
    rm_qr_code: false,
    upc_a: false,
    upc_e: false,
    linear_codes: false,
    matrix_codes: false,
})
const selectedBarcodeFormats = computed(() => {
    return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
})

/*** error handling ***/
const error = ref('')

function onError(err) {
    error.value = `[${err.name}]: `

    if (err.name === 'NotAllowedError') {
        error.value += 'Требуется разрешение на доступ к камере'
    } else if (err.name === 'NotFoundError') {
        error.value += 'Камера не найдена на этом устройстве'
    } else if (err.name === 'NotSupportedError') {
        error.value += 'Требуется безопасное соединение (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
        error.value += 'Камера уже используется'
    } else if (err.name === 'OverconstrainedError') {
        error.value += 'Установленные камеры не подходят'
    } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Stream API не поддерживается в этом браузере'
    } else if (err.name === 'InsecureContextError') {
        error.value += 'Доступ к камере разрешен только в безопасном контексте. Используйте HTTPS или localhost.'
    } else {
        error.value += err.message
    }

    console.error('Camera error:', error.value)
}
</script>

<style scoped>
.main {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.qrcode-container {
    position: relative;
    width: 100%;
    height: 100%;
}

/* Overlay маска */
.scanner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    /* Позволяет клики проходить сквозь overlay */
}

.overlay-top,
.overlay-bottom,
.overlay-left,
.overlay-right {
    background-color: rgba(0, 0, 0, 0.5);
}

.overlay-top {
    height: 25%;
    width: 100%;
}

.overlay-bottom {
    height: 40%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.overlay-middle {
    display: flex;
    height: 35%;
    width: 100%;
}

.overlay-left,
.overlay-right {
    flex: 1;
    height: 100%;
}

.scan-window {
    width: 280px;
    height: 280px;
    position: relative;
    background-color: transparent;
    box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
}

/* Уголки для области сканирования */
.corner {
    position: absolute;
    width: 30px;
    height: 30px;
    border-color: #f8a41e;
    border-style: solid;
}

.corner-tl {
    top: -2px;
    left: -2px;
    border-width: 4px 0 0 4px;
    border-top-left-radius: 8px;
}

.corner-tr {
    top: -2px;
    right: -2px;
    border-width: 4px 4px 0 0;
    border-top-right-radius: 8px;
}

.corner-bl {
    bottom: -2px;
    left: -2px;
    border-width: 0 0 4px 4px;
    border-bottom-left-radius: 8px;
}

.corner-br {
    bottom: -2px;
    right: -2px;
    border-width: 0 4px 4px 0;
    border-bottom-right-radius: 8px;
}

.scan-instruction {
    pointer-events: auto;
    color: white;
    text-align: center;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 10px;
    max-width: 80%;
}

.scan-instruction p {
    margin: 0 0 10px 0;
    font-size: 1.2rem;
    font-weight: 500;
}

.scan-result {
    margin-top: 10px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    font-size: 0.9rem;
    word-break: break-all;
    max-height: 100px;
    overflow-y: auto;
}

.error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    color: red;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    z-index: 100;
    pointer-events: auto;
}

/* Адаптивность */
@media (max-width: 768px) {
    .scan-window {
        width: 250px;
        height: 250px;
    }

    .scan-instruction p {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .scan-window {
        width: 220px;
        height: 220px;
    }

    .overlay-top {
        height: 20%;
    }

    .overlay-middle {
        height: 40%;
    }

    .overlay-bottom {
        height: 40%;
    }

    .scan-instruction p {
        font-size: 1rem;
    }

    .corner {
        width: 20px;
        height: 20px;
    }
}
</style>