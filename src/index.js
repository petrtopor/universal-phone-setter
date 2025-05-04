/**
 * Отображает модальное окно для ввода и сохранения номера телефона.
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
  // Обертка в Promise теперь принимает resolve и reject
  return new Promise((resolve, reject) => {
    // --- Значения по умолчанию ---
    const defaults = {
      inputPlaceholder: "Введите номер телефона",
      saveButtonText: "Сохранить",
      successMessageTemplate: (phone) => `Успех! Номер сохранен: ${phone}`,
      closeButtonText: "Закрыть",
      storageKey: "userPhoneNumber", // Ключ по умолчанию для localStorage
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
    // Простое объединение для верхнего уровня (включая storageKey)
    const config = { ...defaults, ...options };
    // Глубокое объединение для вложенных объектов (чтобы не перезатирать весь объект, если передана только часть)
    config.errorMessages = {
      ...defaults.errorMessages,
      ...(options?.errorMessages || {}),
    };
    config.classNames = {
      ...defaults.classNames,
      ...(options?.classNames || {}),
    };

    // --- Создание элементов модального окна ---
    const modalOverlay = document.createElement("div");
    const modalContent = document.createElement("div");
    const input = document.createElement("input");
    const errorDisplay = document.createElement("div");
    const saveButton = document.createElement("button");
    const successMessage = document.createElement("p");
    const closeButton = document.createElement("button");

    // --- Настройка элементов (Стили + Классы + Текст из config) ---
    // Оверлей
    modalOverlay.style.position = "fixed";
    modalOverlay.style.left = "0";
    modalOverlay.style.top = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000";
    modalOverlay.className = config.classNames.overlay;

    // Контейнер модалки
    modalContent.style.background = "white";
    modalContent.style.padding = "1rem";
    modalContent.style.borderRadius = "5px";
    modalContent.style.minWidth = "300px";
    modalContent.style.textAlign = "center";
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.gap = "0.5rem";
    modalContent.className = config.classNames.modal;

    // Поле ввода
    input.type = "tel";
    input.placeholder = config.inputPlaceholder;
    input.className = config.classNames.input;

    // Отображение ошибок
    errorDisplay.className = config.classNames.errorDisplay;
    errorDisplay.style.color = "red";
    errorDisplay.style.minHeight = "1.2em";
    errorDisplay.style.fontSize = "0.9em";
    errorDisplay.style.marginTop = "0px";

    // Кнопка Сохранить
    saveButton.textContent = config.saveButtonText;
    saveButton.className = config.classNames.saveButton;

    // Сообщение об успехе
    successMessage.style.display = "none";
    successMessage.className = config.classNames.successMessage;

    // Кнопка Закрыть
    closeButton.textContent = config.closeButtonText;
    closeButton.style.display = "none";
    closeButton.className = config.classNames.closeButton;

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
      }
    });

    saveButton.addEventListener("click", () => {
      const phoneNumber = input.value.trim();
      errorDisplay.textContent = "";

      if (!phoneNumber) {
        errorDisplay.textContent = config.errorMessages.empty;
        return;
      }

      try {
        // Используем настроенный ключ для сохранения
        localStorage.setItem(config.storageKey, phoneNumber);

        input.style.display = "none";
        saveButton.style.display = "none";
        errorDisplay.style.display = "none";
        successMessage.textContent = config.successMessageTemplate(phoneNumber);
        successMessage.style.display = "block";
        closeButton.style.display = "block";

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
