export const DEFAULT_STYLES = `
.usp-overlay {
  background-color: rgba(0,0,0,0.5);
  /* Стили для позиционирования остаются инлайн в index.js */
  /* display, justify-content, align-items остаются инлайн в index.js */
}
.usp-modal {
  background: white;
  padding: 1.5rem; /* Немного увеличим паддинг */
  border-radius: 5px;
  min-width: 300px;
  text-align: center;
  /* display, flex-direction остаются инлайн в index.js */
  gap: 0.75rem; /* Немного увеличим gap */
}
.usp-input {
  display: block;
  width: calc(100% - 16px); /* Примерный расчет ширины */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.usp-error-message {
  color: red;
  min-height: 1.2em;
  font-size: 0.9em;
  margin-top: -0.25rem; /* Подвинем чуть ближе к инпуту */
  margin-bottom: 0.25rem;
  text-align: left; /* Выровняем по левому краю */
  /* Изначально пустой, не скрываем */
}
.usp-save-button,
.usp-close-button {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  background-color: #eee;
}
.usp-save-button:hover,
.usp-close-button:hover {
  background-color: #ddd;
}
.usp-success-message {
  color: green;
  margin: 0.5rem 0;
}

/* --- Управление состояниями через класс на .usp-modal --- */

/* Начальное состояние: скрываем элементы успеха */
.usp-modal .usp-success-message,
.usp-modal .usp-close-button {
  display: none;
}

/* Состояние успеха: добавляется класс --state-success к .usp-modal (или кастомному классу) */
.usp-modal--state-success .usp-input,
.usp-modal--state-success .usp-save-button,
.usp-modal--state-success .usp-error-message {
  display: none;
}
.usp-modal--state-success .usp-success-message,
.usp-modal--state-success .usp-close-button {
  display: block; /* Или другой нужный display */
}
`;
