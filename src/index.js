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
 * @param {object} [options.classNames] - CSS классы для элементов модального окна.
 * @param {string} [options.classNames.overlay='usp-overlay'] - Класс для оверлея.
 * @param {string} [options.classNames.modal='usp-modal'] - Класс для контейнера модального окна.
 * @param {string} [options.classNames.input='usp-input'] - Класс для поля ввода.
 * @param {string} [options.classNames.saveButton='usp-save-button'] - Класс для кнопки сохранения.
 * @param {string} [options.classNames.successMessage='usp-success-message'] - Класс для сообщения об успехе.
 * @param {string} [options.classNames.closeButton='usp-close-button'] - Класс для кнопки закрытия.
 * @param {boolean} [options.allowDismissByOverlay=false] - Разрешить закрытие кликом по оверлею.
 * @returns {Promise<string | null>} Промис, который разрешается с введенным номером телефона при успехе,
 * или null при закрытии через оверлей (если разрешено и произошло).
 */
function setPhone(options) {
  return new Promise((resolve) => {
    // --- Значения по умолчанию ---
    const defaults = {
      inputPlaceholder: "Введите номер телефона",
      saveButtonText: "Сохранить",
      successMessageTemplate: (phone) => `Успех! Номер сохранен: ${phone}`,
      closeButtonText: "Закрыть",
      errorMessages: {
        empty: "Пожалуйста, введите номер телефона.",
        storage:
          "Не удалось сохранить номер. Возможно, localStorage недоступен или переполнен.",
      },
      classNames: {
        overlay: "usp-overlay",
        modal: "usp-modal",
        input: "usp-input",
        saveButton: "usp-save-button",
        successMessage: "usp-success-message",
        closeButton: "usp-close-button",
      },
      allowDismissByOverlay: false,
    };

    // --- Объединение опций ---
    // Простое объединение для верхнего уровня
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
    const saveButton = document.createElement("button");
    const successMessage = document.createElement("p");
    const closeButton = document.createElement("button"); // Кнопка для закрытия после успеха

    // --- Настройка элементов (Стили + Классы + Текст из config) ---
    // Оверлей (для затемнения фона): основные стили для позиционирования + кастомный класс
    modalOverlay.style.position = "fixed";
    modalOverlay.style.left = "0";
    modalOverlay.style.top = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)"; // Можно сделать настраиваемым через класс
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000"; // Поверх других элементов
    modalOverlay.className = config.classNames.overlay;

    // Контейнер модалки: базовые стили + кастомный класс
    modalContent.style.background = "white"; // Можно сделать настраиваемым через класс
    modalContent.style.padding = "1rem"; // Можно сделать настраиваемым через класс
    modalContent.style.borderRadius = "5px"; // Можно сделать настраиваемым через класс
    modalContent.style.minWidth = "300px"; // Можно сделать настраиваемым через класс
    modalContent.style.textAlign = "center";
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.gap = "1rem";
    modalContent.className = config.classNames.modal;

    // Поле ввода
    input.type = "tel"; // Используем тип tel для семантики
    input.placeholder = config.inputPlaceholder;
    input.className = config.classNames.input;
    // Убираем инлайн стили, которые можно задать через CSS
    // input.style.display = "block"; // Показать поле ввода
    // input.style.width = "calc(100% - 16px)"; // Учитываем padding
    // input.style.padding = "8px";
    // input.style.marginBottom = "10px";

    // Кнопка Сохранить
    saveButton.textContent = config.saveButtonText;
    saveButton.className = config.classNames.saveButton;
    // Убираем инлайн стили
    // saveButton.style.display = "block"; // Показать кнопку
    // saveButton.style.width = "100%";
    // saveButton.style.padding = "10px";

    // Сообщение об успехе (изначально скрыто через CSS или JS)
    successMessage.style.display = "none"; // Управляем видимостью через JS
    successMessage.className = config.classNames.successMessage;
    // Убираем инлайн стили
    // successMessage.style.marginTop = "10px";
    // successMessage.style.marginBottom = "10px";
    // successMessage.style.color = "green";

    // Кнопка Закрыть (изначально скрыта через CSS или JS)
    closeButton.textContent = config.closeButtonText;
    closeButton.style.display = "none"; // Скрыть кнопку
    closeButton.className = config.classNames.closeButton;
    // Убираем инлайн стили
    // closeButton.style.width = "100%"";
    // closeButton.style.padding = "10px";
    // closeButton.style.marginTop = "10px";

    // --- Сборка модального окна ---
    modalContent.appendChild(input);
    modalContent.appendChild(saveButton);
    modalContent.appendChild(successMessage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // --- Логика ---
    let isResolved = false; // Флаг, чтобы избежать двойного разрешения промиса

    const closeModal = (resolutionValue = null) => {
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
      if (!isResolved) {
        resolve(resolutionValue); // Разрешаем промис (null при закрытии без сохранения)
        isResolved = true;
      }
    };

    // Закрытие по клику вне модального окна (если разрешено)
    if (config.allowDismissByOverlay) {
      modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
          closeModal(null); // Закрываем и разрешаем промис с null
        }
      });
    }

    saveButton.addEventListener("click", () => {
      const phoneNumber = input.value.trim();
      if (!phoneNumber) {
        alert(config.errorMessages.empty); // Простое уведомление
        return;
      }

      try {
        localStorage.setItem("userPhoneNumber", phoneNumber);

        // Переключаем состояние на "Успех"
        input.style.display = "none"; // Управляем видимостью напрямую
        saveButton.style.display = "none";
        successMessage.textContent = config.successMessageTemplate(phoneNumber);
        successMessage.style.display = "block";
        closeButton.style.display = "block";

        // Резолвим промис с сохраненным номером
        if (!isResolved) {
          resolve(phoneNumber);
          isResolved = true;
        }
      } catch (error) {
        console.error("Ошибка сохранения в localStorage:", error);
        alert(config.errorMessages.storage);
        // Возможно, стоит закрыть модалку и реджектнуть промис
        // closeModal();
        // if (!isResolved) { reject(error); isResolved = true; }
      }
    });

    // Кнопка закрытия в состоянии успеха
    closeButton.addEventListener("click", () => closeModal(null)); // Закрытие после успеха не возвращает номер

    // --- Добавление модального окна в DOM ---
    document.body.appendChild(modalOverlay);
    input.focus(); // Фокус на поле ввода при открытии
  });
}

// Экспортируем нашу единственную функцию
export { setPhone };
