export const DEFAULT_STYLES = `
.usp-overlay {
  background-color: rgba(0,0,0,0.5);
  /* Стили для позиционирования остаются инлайн в index.js */
  /* display, justify-content, align-items остаются инлайн в index.js */
}
.usp-modal {
  background: white;
  padding: 1.5rem;
  border-radius: 5px;
  min-width: 300px;
  text-align: center;
  /* display, flex-direction остаются инлайн в index.js */
  gap: 0.75rem;
}
.usp-input {
  /* display: block; */ /* Управляется компоновкой flex родителя */
  width: calc(100% - 16px); /* Примерный расчет ширины */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.usp-error-message {
  color: red;
  min-height: 1.2em; /* Резервируем место */
  font-size: 0.9em;
  margin-top: -0.25rem;
  margin-bottom: 0.25rem;
  text-align: left;
  visibility: hidden; /* Скрыто по умолчанию, но занимает место */
  transition: visibility 0s linear 0.1s; /* Небольшая задержка перед скрытием */
}
.usp-error-message--visible { /* Класс для показа ошибки */
  visibility: visible;
  transition-delay: 0s;
}
.usp-save-button,
.usp-close-button {
  /* display: block; */ /* Управляется компоновкой flex родителя */
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  background-color: #eee;
  /* visibility управляется классом состояния родителя */
}
.usp-save-button:hover,
.usp-close-button:hover {
  background-color: #ddd;
}
.usp-success-message {
  color: green;
  margin: 0.5rem 0;
  min-height: 1.2em; /* Резервируем место как у ошибки для стабильности */
  /* visibility управляется классом состояния родителя */
}

/* --- Управление состояниями через класс на .usp-modal --- */

/* Начальное состояние: все элементы видимы, кроме явно скрытых ниже */
/* Скрываем элементы успеха и кнопку закрытия по умолчанию */
.usp-modal .usp-success-message,
.usp-modal .usp-close-button {
  visibility: hidden;
}

/* Состояние успеха: добавляется класс --state-success к .usp-modal (или кастомному классу) */
/* Скрываем элементы ввода */
.usp-modal--state-success .usp-input,
.usp-modal--state-success .usp-save-button {
  visibility: hidden;
}
/* Скрываем ошибку, даже если она была видима */
.usp-modal--state-success .usp-error-message {
  visibility: hidden;
}
/* Показываем элементы успеха */
.usp-modal--state-success .usp-success-message,
.usp-modal--state-success .usp-close-button {
  visibility: visible;
}
`;
