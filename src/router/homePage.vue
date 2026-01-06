<script setup>
import {useRouter} from 'vue-router'
import { onMounted } from 'vue';
import { usePVZStore } from '@/stores/PVZsAndBoxesStore';

const PVZStore = usePVZStore()

onMounted(() => {
  PVZStore.addPVZ(1, "Москва")
  PVZStore.addPVZ(2, "Питер")
  PVZStore.addBoxes(1, 1, "acceptance")
  PVZStore.addBoxes(2, 1, "acceptance")
  PVZStore.addBoxes(3, 1, "acceptance")
  PVZStore.addBoxes(1, 2, "acceptance")
  PVZStore.addBoxes(2, 2, "acceptance")
  PVZStore.addBoxes(3, 2, "acceptance")

  console.log(PVZStore.pvzList)
})

const router = useRouter()

function navigateToSelectTask() {
    router.push('/select-task')
}
</script>
<template>
  <div id="app">
    <div class="signin f-c">
      <h1 class="signin__header text-xxl">
        ЧиназесАвто
      </h1>
      <div class="signin__form f-c">
        <input type="text" class="signin__form__input" placeholder="Логин">
        <input type="text" class="signin__form__input" placeholder="Пароль">
        <button class="signin__form__button button" @click="navigateToSelectTask"><p>Войти в аккаунт</p></button>
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
  gap:13rem;
  height: 70vh;
  width: 80vw;
  padding-top: 3.5rem;

  .signin__header {

  }
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