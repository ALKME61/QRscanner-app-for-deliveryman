<script setup>
import { usePVZStore } from '@/stores/PVZsAndBoxesStore';
import { storeToRefs } from 'pinia';

// Получаем store
const PVZStore = usePVZStore();

// Для реактивности используем storeToRefs
const { pvzList } = storeToRefs(PVZStore);
</script>

<template>
    <div class="pvz-chooser f-c form-container">
        <!-- Проверяем, есть ли ПВЗ -->
        <div v-if="pvzList && pvzList.length > 0">
            <button 
                class="pvz-chooser__button button" 
                v-for="pvz in pvzList" 
                :key="pvz.id"
                @click="handlePvzClick(pvz.id)"
            >
                <p class="pvz-name">ПВЗ: {{ pvz.location }}</p>
                <p class="pvz-stats">Коробок: {{ pvz.boxes.length }}</p>
                <!-- Дополнительная информация -->
                <div class="task-types" v-if="pvz.boxes.length > 0">
                    <span v-for="(count, type) in getTaskTypeCounts(pvz.boxes)" 
                          :key="type"
                          class="task-badge"
                          :class="getTaskClass(type)">  
                        {{ type }}: {{ count }}
                    </span>
                </div>
                <div v-else class="no-boxes">
                    Нет коробок
                </div>
            </button>
        </div>
        
        <!-- Если ПВЗ нет -->
        <div v-else class="no-pvz">
            <p>Нет доступных ПВЗ</p>
        </div>
    </div>
</template>

<script>
// Дополнительная логика
export default {
    methods: {
        handlePvzClick(pvzId) {
            console.log('Выбран ПВЗ с ID:', pvzId);
            // Здесь можно добавить логику перехода или выбора
            // Например: this.$router.push(`/pvz/${pvzId}`)
        },
        
        getTaskTypeCounts(boxes) {
            const counts = {};
            boxes.forEach(box => {
                counts[box.taskType] = (counts[box.taskType] || 0) + 1;
            });
            return counts;
        },
        
        getTaskClass(taskType) {
            return {
                'acceptance': taskType === 'acceptance',
                'issue': taskType === 'issue',
                'storage': taskType === 'storage'
            };
        },
        
        addTestPVZ() {
            const testLocations = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'];
            const randomLocation = testLocations[Math.floor(Math.random() * testLocations.length)];
            
            this.PVZStore.addPVZ(randomLocation);
        }
    }
};
</script>

<style scoped>
.pvz-chooser {
    padding: 2rem;
    gap: 1rem;
}

.pvz-chooser__button {
    width: 100%;
    max-width: 400px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pvz-chooser__button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #4299e1;
}

.pvz-chooser__button:active {
    transform: translateY(0);
}

.pvz-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.pvz-stats {
    font-size: 1rem;
    color: #4a5568;
    margin: 0;
}

.task-types {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
}

.task-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
}

.task-badge.acceptance {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #10b981;
}

.task-badge.issue {
    background-color: #dbeafe;
    color: #1e40af;
    border: 1px solid #3b82f6;
}

.task-badge.storage {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #9ca3af;
}

.no-boxes {
    color: #9ca3af;
    font-style: italic;
    font-size: 0.875rem;
}

.no-pvz {
    text-align: center;
    padding: 3rem;
    color: #718096;
}

.add-pvz-btn {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.add-pvz-btn:hover {
    background-color: #3182ce;
}

/* Для контейнера .f-c (flex column) */
.f-c {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    height: 100vh;
}

/* Если у вас уже есть стили для .button в глобальных стилях */
.button {
    font-family: inherit;
    font-size: inherit;
}
</style>