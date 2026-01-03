<template>
  <div id="app">
    <div class="signin f-c">
      <h1 class="signin__header text-xxl">
        ЧиназесАвто
      </h1>
      <div class="signin__form f-c">
        <input type="text" class="signin__form__input" placeholder="Логин">
        <input type="text" class="signin__form__input" placeholder="Пароль">
        <button class="signin__form__button"><router-link to="/qr-scanner"><p>Войти в аккаунт</p></router-link></button>
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
    .signin__form__button{
      height: 3rem;
      background-color: #f8a41e;
      border-radius: 8px;
      transition-duration: 0.3s;
      p {
        color: #ffffff;
        font-weight: 300;
      }
    }
    .signin__form__button:active{
      transition-duration: 0.3s;
      background-color: #f19a0e;
    }
  }
}
</style>