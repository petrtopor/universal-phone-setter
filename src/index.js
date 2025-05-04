// Import styles from the separate file
import { DEFAULT_STYLES } from "./default-styles.js";

// Flag to track style injection
let stylesInjected = false;

/**
 * Injects a CSS string into the document's head if not already injected.
 * @param {string} cssString The string containing CSS rules.
 * @param {string} styleId The ID for the created style tag to prevent duplicates.
 * @returns {boolean} True if styles were injected, false otherwise.
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
 * Displays a modal window for entering and saving a phone number.
 * Base styles are injected into the <head> on the first call.
 *
 * @param {object} [options] - Optional configuration object.
 * @param {string} [options.inputPlaceholder='Enter phone number'] - Placeholder for the input field.
 * @param {string} [options.saveButtonText='Save'] - Text for the save button.
 * @param {(phone: string) => string} [options.successMessageTemplate=(phone) => `Success! Number saved: ${phone}`] - Function that takes the phone number and returns the success message string.
 * @param {string} [options.closeButtonText='Close'] - Text for the close button.
 * @param {object} [options.errorMessages] - Object containing error message texts.
 * @param {string} [options.errorMessages.empty='Please enter a phone number.'] - Default error message for empty input (used if no custom validator).
 * @param {string} [options.errorMessages.storage='Failed to save number.'] - Error message for localStorage failure.
 * @param {string} [options.storageKey='userPhoneNumber'] - Key used to save the number in localStorage.
 * @param {(phone: string) => string | null | undefined} [options.validatePhoneNumber=null] - Custom function to validate the phone number. Should return an error message string if invalid, or null/undefined if valid. If provided, overrides the default empty check.
 * @param {object} [options.classNames] - CSS class names for modal elements.
 * @param {string} [options.classNames.overlay='usp-overlay'] - Class for the overlay element.
 * @param {string} [options.classNames.modal='usp-modal'] - Class for the modal container element.
 * @param {string} [options.classNames.input='usp-input'] - Class for the input field.
 * @param {string} [options.classNames.errorDisplay='usp-error-message'] - Class for the error display element.
 * @param {string} [options.classNames.saveButton='usp-save-button'] - Class for the save button.
 * @param {string} [options.classNames.successMessage='usp-success-message'] - Class for the success message element.
 * @param {string} [options.classNames.closeButton='usp-close-button'] - Class for the close button.
 * @param {boolean} [options.allowDismissByOverlay=false] - Allow closing the modal by clicking the overlay.
 * @returns {Promise<string | null>} A promise that resolves with the saved phone number (string) on success,
 * or resolves with null if closed via overlay (if allowed) or the 'Close' button after success.
 * The promise rejects with an Error on localStorage failure.
 */
function setPhone(options) {
  return new Promise((resolve, reject) => {
    // Inject styles once
    if (!stylesInjected) {
      stylesInjected = injectStyles(DEFAULT_STYLES, "usp-default-styles");
    }

    // --- Default Values ---
    const defaults = {
      inputPlaceholder: "Enter phone number",
      saveButtonText: "Save",
      successMessageTemplate: (phone) => `Success! Number saved: ${phone}`,
      closeButtonText: "Close",
      storageKey: "userPhoneNumber",
      validatePhoneNumber: null, // Default: no custom validation
      errorMessages: {
        empty: "Please enter a phone number.", // Default non-empty check message
        storage:
          "Failed to save number. LocalStorage might be unavailable or full.",
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

    // --- Merge Options ---
    const config = { ...defaults, ...options };
    // Deep merge for nested objects
    config.errorMessages = {
      ...defaults.errorMessages,
      ...(options?.errorMessages || {}),
    };
    config.classNames = {
      ...defaults.classNames,
      ...(options?.classNames || {}),
    };

    // State class suffixes and full class names
    const successStateSuffix = "--state-success";
    const successStateClass = config.classNames.modal + successStateSuffix;
    const errorVisibleSuffix = "--visible";
    const errorVisibleClass =
      config.classNames.errorDisplay + errorVisibleSuffix;

    // --- Create Modal Elements ---
    const modalOverlay = document.createElement("div");
    const modalContent = document.createElement("div");
    const input = document.createElement("input");
    const errorDisplay = document.createElement("div");
    const saveButton = document.createElement("button");
    const successMessage = document.createElement("p");
    const closeButton = document.createElement("button");

    // --- Configure Elements ---
    // Overlay
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

    // Modal container
    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.className = config.classNames.modal; // Base class

    // Input field
    input.type = "tel";
    input.placeholder = config.inputPlaceholder;
    input.className = config.classNames.input;

    // Error display element
    errorDisplay.className = config.classNames.errorDisplay;

    // Save button
    saveButton.textContent = config.saveButtonText;
    saveButton.className = config.classNames.saveButton;

    // Success message element
    successMessage.className = config.classNames.successMessage;

    // Close button
    closeButton.textContent = config.closeButtonText;
    closeButton.className = config.classNames.closeButton;

    // --- Assemble Modal ---
    modalContent.appendChild(input);
    modalContent.appendChild(errorDisplay);
    modalContent.appendChild(saveButton);
    modalContent.appendChild(successMessage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // --- Logic ---
    let isSettled = false;

    // Function to hide the error
    const hideError = () => {
      errorDisplay.textContent = "";
      errorDisplay.classList.remove(errorVisibleClass);
    };

    // Function to show the error
    const showError = (message) => {
      errorDisplay.textContent = message;
      errorDisplay.classList.add(errorVisibleClass);
    };

    // Function to remove the modal and resolve the promise
    const cleanupAndClose = (resolutionValue = null) => {
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
      if (!isSettled) {
        resolve(resolutionValue);
        isSettled = true;
      }
    };

    // Add listener for closing via overlay click
    if (config.allowDismissByOverlay) {
      modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
          cleanupAndClose(null);
        }
      });
    }

    // Add listener to clear error on input
    input.addEventListener("input", hideError);

    // Add listener for the save button
    saveButton.addEventListener("click", () => {
      const phoneNumber = input.value.trim();
      hideError(); // Hide previous error first

      // --- Input Validation ---
      let validationError = null;
      if (typeof config.validatePhoneNumber === "function") {
        // Use custom validator if provided
        validationError = config.validatePhoneNumber(phoneNumber);
      } else {
        // Use default non-empty check if no custom validator
        if (!phoneNumber) {
          validationError = config.errorMessages.empty;
        }
      }

      // If validation failed (returned a non-empty string)
      if (validationError && typeof validationError === "string") {
        showError(validationError);
        return; // Stop processing
      }
      // --- End Input Validation ---

      // Attempt to save (only if validation passed)
      try {
        localStorage.setItem(config.storageKey, phoneNumber);

        // Switch to success state
        modalContent.classList.add(successStateClass);
        // Update success message text
        successMessage.textContent = config.successMessageTemplate(phoneNumber);

        // Resolve the promise
        if (!isSettled) {
          resolve(phoneNumber);
          isSettled = true;
        }
      } catch (error) {
        // Handle storage error
        console.error(
          `Error saving to localStorage (key: ${config.storageKey}):`,
          error
        );
        showError(config.errorMessages.storage); // Show storage error

        // Reject the promise
        if (!isSettled) {
          reject(new Error(config.errorMessages.storage));
          isSettled = true;
        }
      }
    });

    // Add listener for the close button
    closeButton.addEventListener("click", () => cleanupAndClose(null));

    // --- Add Modal to DOM ---
    document.body.appendChild(modalOverlay);
    input.focus(); // Set focus to input on open
  });
}

// Export the main function
export { setPhone };
