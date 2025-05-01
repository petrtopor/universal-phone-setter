/**
 * Функция для отображения модального окна и сохранения номера телефона.
 * @returns {Promise<string | null>} Промис, который разрешается с введенным номером телефона при успешном сохранении, или null при закрытии без сохранения (если будет добавлено).
 */
function setPhone() {
  return new Promise((resolve) => {
    // --- Создание элементов модального окна ---
    const modalOverlay = document.createElement("div");
    const modalContent = document.createElement("div");
    const input = document.createElement("input");
    const saveButton = document.createElement("button");
    const successMessage = document.createElement("p");
    const closeButton = document.createElement("button"); // Кнопка для закрытия после успеха

    // --- Настройка элементов ---
    // Оверлей (для затемнения фона)
    modalOverlay.style.position = "fixed";
    modalOverlay.style.left = "0";
    modalOverlay.style.top = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000"; // Поверх других элементов

    // Контейнер модалки
    modalContent.style.background = "white";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "5px";
    modalContent.style.minWidth = "300px";
    modalContent.style.textAlign = "center";

    // Поле ввода
    input.type = "tel"; // Используем тип tel для семантики
    input.placeholder = "Введите номер телефона";
    input.style.display = "block"; // Показать поле ввода
    input.style.width = "calc(100% - 16px)"; // Учитываем padding
    input.style.padding = "8px";
    input.style.marginBottom = "10px";

    // Кнопка Сохранить
    saveButton.textContent = "Сохранить";
    saveButton.style.display = "block"; // Показать кнопку
    saveButton.style.width = "100%";
    saveButton.style.padding = "10px";

    // Сообщение об успехе (изначально скрыто)
    successMessage.style.display = "none";
    successMessage.style.marginTop = "10px";
    successMessage.style.marginBottom = "10px";
    successMessage.style.color = "green";

    // Кнопка Закрыть (изначально скрыта)
    closeButton.textContent = "Закрыть";
    closeButton.style.display = "none"; // Скрыть кнопку
    closeButton.style.width = "100%";
    closeButton.style.padding = "10px";
    closeButton.style.marginTop = "10px";

    // --- Сборка модального окна ---
    modalContent.appendChild(input);
    modalContent.appendChild(saveButton);
    modalContent.appendChild(successMessage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // --- Логика ---
    const closeModal = () => {
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
      // Если промис еще не разрешен (т.е. не сохранили), можно его реджектить или резолвить с null
      // В текущей реализации закрытие происходит только после успеха или кликом вне окна
    };

    // Закрытие по клику вне модального окна
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        // Не закрываем и не реджектим, т.к. нет явного требования отмены
        // closeModal();
        // resolve(null); // Или reject(new Error('Modal closed by user'));
      }
    });

    saveButton.addEventListener("click", () => {
      const phoneNumber = input.value.trim();
      if (!phoneNumber) {
        alert("Пожалуйста, введите номер телефона."); // Простое уведомление
        return;
      }

      try {
        localStorage.setItem("userPhoneNumber", phoneNumber);

        // Переключаем состояние на "Успех"
        input.style.display = "none";
        saveButton.style.display = "none";
        successMessage.textContent = `Успех! Номер сохранен: ${phoneNumber}`;
        successMessage.style.display = "block";
        closeButton.style.display = "block";

        // Резолвим промис с сохраненным номером
        resolve(phoneNumber);
      } catch (error) {
        console.error("Ошибка сохранения в localStorage:", error);
        alert(
          "Не удалось сохранить номер. Возможно, localStorage недоступен или переполнен."
        );
        // Можно реджектить промис в случае ошибки
        // reject(error);
        // closeModal(); // Закрыть окно при ошибке
      }
    });

    closeButton.addEventListener("click", closeModal);

    // --- Добавление модального окна в DOM ---
    document.body.appendChild(modalOverlay);
    input.focus(); // Фокус на поле ввода при открытии
  });
}

// Экспортируем нашу единственную функцию
export { setPhone };
