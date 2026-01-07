<template>
    <div class="main">
        <div class="qrcode-container">
            <div class="go-back">
                <img src="../../public/weui_back-filled.svg" class="go-back__button" @click="onArrowClick" alt="">
            </div>
            <qrcode-stream 
                :constraints="selectedConstraints" 
                :track="paintCenterText" 
                @error="onError"
                @detect="onDetect" 
                @camera-on="onCameraReady" 
                style="position: absolute;" 
            />
            <div class="scan-overlay">
                <!-- CustomSelect с обработкой выбора -->
                <CustomSelect 
                    :options="options" 
                    @select="handleTaskSelect"
                    :modelValue="selectedTask"
                    placeholder=""
                />
                
                <div class="scan-window">
                    <div class="corner corner-tl"></div>
                    <div class="corner corner-tr"></div>
                    <div class="corner corner-bl"></div>
                    <div class="corner corner-br"></div>
                </div>
                
                <div class="task-container">
                    Отсканировано {{ boxCounter.scannedBoxes }}/{{ boxCounter.allBoxes }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useRouter, useRoute } from 'vue-router'
import { usePVZStore } from '@/stores/pvz.store'
import CustomSelect from '../components/CustomSelect.vue'

const router = useRouter()
const route = useRoute()
const pvzStore = usePVZStore()

// Выбранный тип задачи
const selectedTask = ref<string>('')

// Обработчик выбора из CustomSelect
const handleTaskSelect = (taskValue: string) => {
    selectedTask.value = taskValue
    console.log('Выбранный тип задачи в QRscanner:', taskValue)
    
    // Можно обновить expectedBoxes на основе выбранной задачи
    updateExpectedBoxes(taskValue)
}

// Опции для CustomSelect
const options = computed(() => {
    const pvzId = Number(route.params.id)
    const pvz = pvzStore.pvzList.find(pvz => pvz.id === pvzId)
    
    if (!pvz) return []
    
    // Получаем уникальные типы задач
    const uniqueTaskTypes = [...new Set(pvz.boxes.map(box => box.taskType))]
    
    // Преобразуем в нужный формат для CustomSelect
    return uniqueTaskTypes.map(taskType => ({
        value: taskType,
        label: taskType === 'acceptance' ? 'Приёмка' : 
               taskType === 'issue' ? 'Выдача' : taskType
    }))
})

// Обновляем expectedBoxes на основе выбранной задачи
const updateExpectedBoxes = (taskType: string) => {
    const pvzId = Number(route.params.id)
    const pvz = pvzStore.pvzList.find(pvz => pvz.id === pvzId)
    
    if (pvz && taskType) {
        // Фильтруем боксы по выбранному типу задачи
        const filteredBoxes = pvz.boxes.filter(box => box.taskType === taskType)
        
        expectedBoxes.value = filteredBoxes.map(box => ({
            id: box.id,
            taskType: box.taskType
        }))
        
        // Обновляем счетчик
        boxCounter.value.allBoxes = filteredBoxes.length
        boxCounter.value.scannedBoxes = 0
        
        console.log('Ожидаемые боксы для задачи', taskType, ':', expectedBoxes.value)
    }
}

// Следим за изменением selectedTask
watch(selectedTask, (newTask) => {
    if (newTask) {
        updateExpectedBoxes(newTask)
    }
})

const boxFingerPrint = {
    token: "helloworld",
}

// Ожидаемые боксы (теперь зависят от выбранной задачи)
const expectedBoxes = ref<Array<{id: number, taskType?: string}>>([])

const boxCounter = ref({
    allBoxes: 0,
    scannedBoxes: 0
})

const onArrowClick = () => {
    router.back()
}

const result = ref('')

function onDetect(detectedCodes: any[]) {
    console.log('Обнаружены коды:', detectedCodes)
    
    if (detectedCodes.length > 0 && selectedTask.value) {
        const detectedId = detectedCodes[0].rawValue
        console.log('Обнаружен ID:', detectedId)
        
        const numericId = Number(detectedId)
        
        // Ищем бокс в expectedBoxes
        const foundBox = expectedBoxes.value.find(box => box.id === numericId)
        
        if (foundBox) {
            console.log('Найден бокс:', foundBox)
            console.log('Тип задачи бокса:', foundBox.taskType)
            console.log('Выбранная задача:', selectedTask.value)
            
            result.value = JSON.stringify(detectedCodes.map(code => code.rawValue))
            boxCounter.value.scannedBoxes++
            
            // Убираем отсканированный бокс из ожидаемых
            expectedBoxes.value = expectedBoxes.value.filter(box => box.id !== numericId)
            
            // Показываем сообщение
            alert(`Отсканирован бокс #${numericId} для задачи "${selectedTask.value === 'acceptance' ? 'Приёмка' : 'Выдача'}"`)
            
        } else {
            console.log('Бокс с ID', numericId, 'не найден или уже отсканирован')
            alert(`Бокс #${numericId} не найден для выбранной задачи`)
        }
    } else if (!selectedTask.value) {
        alert('Сначала выберите тип задачи!')
    }
    
    // Проверяем завершение
    if (boxCounter.value.scannedBoxes === boxCounter.value.allBoxes && boxCounter.value.allBoxes > 0) {
        alert('Все боксы отсканированы!')
        setTimeout(() => {
            router.back()
        }, 1000)
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
}

/*** track functions ***/
function paintOutline(detectedCodes: any[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

        ctx.strokeStyle = 'red'

        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const { x, y } of otherPoints) {
            ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()
    }
}

function paintBoundingBox(detectedCodes: any[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height },
        } = detectedCode

        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
    }
}

function paintCenterText(detectedCodes: any[], ctx: CanvasRenderingContext2D) {
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

const trackFunctionOptions = [
    { text: 'nothing (default)', value: undefined },
    { text: 'outline', value: paintOutline },
    { text: 'centered text', value: paintCenterText },
    { text: 'bounding box', value: paintBoundingBox },
]
const trackFunctionSelected = ref(trackFunctionOptions[1])

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

function onError(err: any) {
    error.value = `[${err.name}]: `

    if (err.name === 'NotAllowedError') {
        error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
        error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
        error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
        error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
        error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
        error.value += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
        error.value += err.message
    }
}
</script>

<style scoped lang="scss">
.go-back {
    position: absolute;
    top: 12%;
    left: 10%;
    z-index: 111;

    .go-back__button {
        width: 16px;
    }

    .go-back__button:hover {
        cursor: pointer;
    }
}

.task-container {
    background-color: #fff;
    padding: 1rem 1.75rem;
    border-radius: 8px;
    text-align: center;
    margin-top: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.scan-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    gap: 100px;
    top: 10%;
    width: 100%;
}

.scan-window {
    position: relative;
    width: 300px;
    height: 300px;
}

.corner {
    position: absolute;
    width: 40px;
    height: 40px;
    border-color: #ffffff;
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

.error {
    font-weight: bold;
    color: red;
}

.barcode-format-checkbox {
    margin-right: 10px;
    white-space: nowrap;
    display: inline-block;
}

.qrcode-container {
    width: 100vw;
    height: 100vh;
}

.main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>