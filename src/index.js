// Флаг для отслеживания внедрения стилей
let stylesInjected = false;

// Строка с CSS стилями по умолчанию
const DEFAULT_STYLES = `
.usp-overlay {
  background-color: rgba(0,0,0,0.5);
  /* Стили для позиционирования остаются инлайн */
  /* display, justify-content, align-items остаются инлайн */
}
.usp-modal {
  background: white;
  padding: 1.5rem; /* Немного увеличим паддинг */
  border-radius: 5px;
  min-width: 300px;
  text-align: center;
  /* display, flex-direction остаются инлайн */
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

/**
 * Внедряет строку CSS в head документа, если она еще не была внедрена.
 * @param {string} cssString Строка с CSS правилами.
 * @param {string} styleId ID для создаваемого тега style, чтобы избежать дублирования.
 */
function injectStyles(cssString, styleId) {
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = cssString;
    document.head.appendChild(styleElement);
    return true;
  }
  return false;
}

/**
 * Отображает модальное окно для ввода и сохранения номера телефона.
 * Базовые стили внедряются в <head> при первом вызове.
 * @param {object} [options] - Необязательный объект конфигурации.
 * @param {string} [options.inputPlaceholder='Введите номер телефона'] - Placeholder для поля ввода.
 * @param {string} [options.saveButtonText='Сохранить'] - Текст кнопки сохранения.
 * 'Успех! Номер сохранен: ${phone}'. Функция, принимающая номер телефона и возвращающая строку.
 * @param {(phone: string) => string} [options.successMessageTemplate]
 * @param {string} [options.closeButtonText='Закрыть'] - Текст кнопки закрытия.
 * @param {object} [options.errorMessages] - Тексты сообщений об ошибках.
 * @param {string} [options.errorMessages.empty='Пожалуйста, введите номер телефона.'] - Ошибка пустого ввода.
 * @param {string} [options.errorMessages.storage='Не удалось сохранить номер...'] - Ошибка сохранения в localStorage.
 * @param {string} [options.storageKey='userPhoneNumber'] - Ключ для сохранения номера в localStorage.
 * @param {object} [options.classNames] - CSS классы для элементов модального окна.
 * @param {string} [options.classNames.overlay='usp-overlay'] - Класс для оверлея.
 * @param {string} [options.classNames.modal='usp-modal'] - Класс для контейнера модального окна.
 * @param {string} [options.classNames.input='usp-input'] - Класс для поля ввода.
 * @param {string} [options.classNames.errorDisplay='usp-error-message'] - Класс для блока отображения ошибок.
 * @param {string} [options.classNames.saveButton='usp-save-button'] - Класс для кнопки сохранения.
 * @param {string} [options.classNames.successMessage='usp-success-message'] - Класс для сообщения об успехе.
 * @param {string} [options.classNames.closeButton='usp-close-button'] - Класс для кнопки закрытия.
 * @param {boolean} [options.allowDismissByOverlay=false] - Разрешить закрытие кликом по оверлею.
 * @returns {Promise<string | null>} Промис, который разрешается с введенным номером телефона при успехе,
 * null при закрытии через оверлей (если разрешено и произошло) или через кнопку "Закрыть" после успеха.
 * Промис может быть отклонен (rejected) при ошибке сохранения в localStorage.
 */
function setPhone(options) {
  return new Promise((resolve, reject) => {
    // Внедряем стили один раз
    if (!stylesInjected) {
      stylesInjected = injectStyles(DEFAULT_STYLES, "usp-default-styles");
    }

    // --- Значения по умолчанию ---
    const defaults = {
      inputPlaceholder: "Введите номер телефона",
      saveButtonText: "Сохранить",
      successMessageTemplate: (phone) => `Успех! Номер сохранен: ${phone}`,
      closeButtonText: "Закрыть",
      storageKey: "userPhoneNumber",
      errorMessages: {
        empty: "Пожалуйста, введите номер телефона.",
        storage:
          "Не удалось сохранить номер. Возможно, localStorage недоступен или переполнен.",
      },
      classNames: {
        overlay: "usp-overlay",
        modal: "usp-modal",
        input: "usp-input",
        errorDisplay: "usp-error-message",
        saveButton: "usp-save-button",
        successMessage: "usp-success-message",
        closeButton: "usp-close-button",
      },
      allowDismissByOverlay: false,
    };

    // --- Объединение опций ---
    const config = { ...defaults, ...options };
    config.errorMessages = {
      ...defaults.errorMessages,
      ...(options?.errorMessages || {}),
    };
    config.classNames = {
      ...defaults.classNames,
      ...(options?.classNames || {}),
    };

    // Суффикс класса для состояния успеха
    const successStateSuffix = "--state-success";
    const successStateClass = config.classNames.modal + successStateSuffix;

    // --- Создание элементов модального окна ---
    const modalOverlay = document.createElement("div");
    const modalContent = document.createElement("div");
    const input = document.createElement("input");
    const errorDisplay = document.createElement("div");
    const saveButton = document.createElement("button");
    const successMessage = document.createElement("p");
    const closeButton = document.createElement("button");

    // --- Настройка элементов (Минимум инлайн стилей + Классы + Текст) ---
    // Оверлей (только позиционирование и layout)
    modalOverlay.style.position = "fixed";
    modalOverlay.style.left = "0";
    modalOverlay.style.top = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000";
    modalOverlay.className = config.classNames.overlay;

    // Контейнер модалки (только layout)
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.className = config.classNames.modal; // Базовый класс

    // Поле ввода
    input.type = "tel";
    input.placeholder = config.inputPlaceholder;
    input.className = config.classNames.input;

    // Отображение ошибок
    errorDisplay.className = config.classNames.errorDisplay;
    // Стили для errorDisplay теперь в CSS

    // Кнопка Сохранить
    saveButton.textContent = config.saveButtonText;
    saveButton.className = config.classNames.saveButton;

    // Сообщение об успехе
    successMessage.className = config.classNames.successMessage;
    // display: none управляется через CSS и класс состояния

    // Кнопка Закрыть
    closeButton.textContent = config.closeButtonText;
    closeButton.className = config.classNames.closeButton;
    // display: none управляется через CSS и класс состояния

    // --- Сборка модального окна ---
    modalContent.appendChild(input);
    modalContent.appendChild(errorDisplay);
    modalContent.appendChild(saveButton);
    modalContent.appendChild(successMessage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // --- Логика ---
    let isSettled = false;

    const cleanupAndClose = (resolutionValue = null) => {
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
      if (!isSettled) {
        resolve(resolutionValue);
        isSettled = true;
      }
    };

    if (config.allowDismissByOverlay) {
      modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
          cleanupAndClose(null);
        }
      });
    }

    input.addEventListener("input", () => {
      if (errorDisplay.textContent) {
        errorDisplay.textContent = "";
        // Можно также убирать класс ошибки с инпута, если он добавлялся
        // input.classList.remove('usp-input--error');
      }
    });

    saveButton.addEventListener("click", () => {
      const phoneNumber = input.value.trim();
      errorDisplay.textContent = "";
      // input.classList.remove('usp-input--error'); // Убираем класс ошибки, если был

      if (!phoneNumber) {
        errorDisplay.textContent = config.errorMessages.empty;
        // Можно добавить класс ошибки к инпуту
        // input.classList.add('usp-input--error');
        return;
      }

      try {
        localStorage.setItem(config.storageKey, phoneNumber);

        // Переключаем состояние через CSS класс
        modalContent.classList.add(successStateClass);
        // Обновляем текст сообщения об успехе
        successMessage.textContent = config.successMessageTemplate(phoneNumber);

        if (!isSettled) {
          resolve(phoneNumber);
          isSettled = true;
        }
      } catch (error) {
        console.error(
          `Ошибка сохранения в localStorage (ключ: ${config.storageKey}):`,
          error
        );
        errorDisplay.textContent = config.errorMessages.storage;
        // input.classList.add('usp-input--error'); // Можно добавить класс ошибки

        if (!isSettled) {
          reject(new Error(config.errorMessages.storage));
          isSettled = true;
        }
      }
    });

    closeButton.addEventListener("click", () => cleanupAndClose(null));

    // --- Добавление модального окна в DOM ---
    document.body.appendChild(modalOverlay);
    input.focus();
  });
}

// Экспортируем нашу единственную функцию
export { setPhone };
