<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useChoosenTaskStore } from '@/stores/selectedTaskStore'
import type { TaskType } from '@/stores/selectedTaskStore'

const choosenTask = useChoosenTaskStore()
const router = useRouter()

function navigateToPVZselector(triggeredBy: TaskType) {
    choosenTask.currentTask = triggeredBy
    router.push("/pvz-page/" + triggeredBy)
}

</script>
<template>
    <div id="app">
        <div class="signin f-c">
            <h1 class="signin__header text-xxl">
                ЧиназесАвто
            </h1>
            <div class="signin__form f-c">

                <button class="signin__form__button button" @click="navigateToPVZselector('acceptance')">
                    <p>Приём товара</p>
                </button><button class="signin__form__button button" @click="navigateToPVZselector('issue')">
                    <p>Выдача товара</p>
                </button>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
#app {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-color: #ffffff;
}

.signin {
    gap: 13rem;
    height: 70vh;
    width: 80vw;
    padding-top: 3.5rem;

    .signin__header {}

    .signin__form {
        gap: 1rem;

        .signin__form__input {
            height: 3rem;
            border: solid #cecece 1px;
            border-radius: 8px;
        }


    }
}
</style>