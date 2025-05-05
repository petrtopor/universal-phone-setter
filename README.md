# Universal Phone Setter

A framework-agnostic modal service to set and save a user's phone number.

## Overview

The **Universal Phone Setter** is a lightweight, framework-agnostic JavaScript package designed to provide a reusable modal for setting and saving a user's phone number. It is built to be easily integrated into any web project, regardless of the frontend framework being used (e.g., React, Vue, Angular, or plain HTML). The package exposes a single asynchronous method, `setPhone`, which handles the display of a modal, user input, validation, and storage of the phone number in the browser's `localStorage`.

### Key Features

- **Framework-Agnostic**: Works with any JavaScript project, including vanilla JS, React, Vue, and more.
- **Customizable**: Allows customization of text, styles, validation, and behavior through an options object.
- **Validation Support**: Provides default non-empty validation and supports custom validation functions.
- **LocalStorage Integration**: Saves the phone number to `localStorage` for persistence.
- **Promise-Based**: Returns a promise that resolves with the saved phone number or `null` if the modal is closed without saving.
- **Accessible**: Includes focus management and error display for better user experience.

## Installation

To install the package, use npm:

```bash
npm install universal-phone-setter
```

Alternatively, you can include the UMD build directly in your HTML:

```html
<script src="https://unpkg.com/universal-phone-setter@1.4.0/dist/index.umd.js"></script>
```

## Usage

### Basic Usage

To use the `setPhone` method with default settings, simply call it as follows:

```javascript
import { setPhone } from 'universal-phone-setter';

async function handleSetPhone() {
  try {
    const savedPhoneNumber = await setPhone();
    if (savedPhoneNumber) {
      console.log(`Phone number saved: ${savedPhoneNumber}`);
    } else {
      console.log('Modal closed without saving.');
    }
  } catch (error) {
    console.error('Error saving phone number:', error.message);
  }
}
```

### Custom Options

You can customize the behavior and appearance of the modal by passing an options object to the `setPhone` method. Below is an example with custom settings:

```javascript
import { setPhone } from 'universal-phone-setter';

const customOptions = {
  inputPlaceholder: 'Enter your phone number',
  saveButtonText: 'Save Number',
  successMessageTemplate: (phone) => `Success! Your number ${phone} has been saved.`,
  closeButtonText: 'Close',
  storageKey: 'customPhoneNumber',
  validatePhoneNumber: (phone) => {
    if (!phone) return 'Phone number is required.';
    if (!/^\+\d+$/.test(phone)) return 'Invalid format. Use "+" followed by digits.';
    return null;
  },
  errorMessages: {
    storage: 'Failed to save. Please try again.',
  },
  classNames: {
    overlay: 'custom-overlay',
    modal: 'custom-modal',
    input: 'custom-input',
    errorDisplay: 'custom-error',
    saveButton: 'custom-save-button',
    successMessage: 'custom-success',
    closeButton: 'custom-close-button',
  },
  allowDismissByOverlay: true,
};

async function handleSetPhoneCustom() {
  try {
    const savedPhoneNumber = await setPhone(customOptions);
    if (savedPhoneNumber) {
      console.log(`Custom phone number saved: ${savedPhoneNumber}`);
    } else {
      console.log('Custom modal closed without saving.');
    }
  } catch (error) {
    console.error('Error in custom setPhone:', error.message);
  }
}
```

### Options

The `setPhone` method accepts an optional `options` object with the following properties:

- **inputPlaceholder** (`string`): Placeholder text for the phone number input field. Default: `'Enter phone number'`.
- **saveButtonText** (`string`): Text for the save button. Default: `'Save'`.
- **successMessageTemplate** (`(phone: string) => string`): A function that takes the saved phone number and returns the success message. Default: `(phone) => `Success! Number saved: ${phone}``.
- **closeButtonText** (`string`): Text for the close button. Default: `'Close'`.
- **storageKey** (`string`): The key used to save the phone number in `localStorage`. Default: `'userPhoneNumber'`.
- **validatePhoneNumber** (`(phone: string) => string | null | undefined`): A custom validation function. If provided, it should return an error message string if the phone number is invalid, or `null`/`undefined` if valid. If not provided, a default non-empty check is used.
- **errorMessages** (`object`): An object containing error message texts.
  - **empty** (`string`): Error message for an empty input (used only if no custom validator is provided). Default: `'Please enter a phone number.'`.
  - **storage** (`string`): Error message for `localStorage` failure. Default: `'Failed to save number.'`.
- **classNames** (`object`): An object to customize the CSS class names for modal elements.
  - **overlay** (`string`): Class for the overlay. Default: `'usp-overlay'`.
  - **modal** (`string`): Class for the modal container. Default: `'usp-modal'`.
  - **input** (`string`): Class for the input field. Default: `'usp-input'`.
  - **errorDisplay** (`string`): Class for the error message element. Default: `'usp-error-message'`.
  - **saveButton** (`string`): Class for the save button. Default: `'usp-save-button'`.
  - **successMessage** (`string`): Class for the success message element. Default: `'usp-success-message'`.
  - **closeButton** (`string`): Class for the close button. Default: `'usp-close-button'`.
- **allowDismissByOverlay** (`boolean`): If `true`, allows closing the modal by clicking on the overlay. Default: `false`.

### Styling

The modal comes with default styles that are injected into the `<head>` of the document on the first call to `setPhone`. These styles can be overridden by providing custom class names via the `classNames` option and defining your own CSS rules.

For example, to customize the modal's appearance, you can define styles for your custom classes:

```css
.custom-modal {
  background: #f0f4f8;
  border: 1px solid #b0c4de;
  border-radius: 0.5rem;
  padding: 1.5625rem;
  width: 21.875rem;
}
.custom-input {
  border: 1px solid #778899;
  padding: 0.75rem;
  border-radius: 0.25rem;
  font-size: 1em;
  width: calc(100% - 1.625rem);
}
/* Additional custom styles... */
```

### Validation

By default, the modal performs a simple non-empty check on the phone number input. However, you can provide a custom validation function via the `validatePhoneNumber` option. This function should accept the phone number as a string and return an error message string if the input is invalid, or `null`/`undefined` if it is valid.

Example of a custom validation function:

```javascript
function validatePhone(phone) {
  if (!phone) return 'Phone number is required.';
  if (!/^\+\d+$/.test(phone)) return 'Invalid format. Use "+" followed by digits.';
  return null;
}
```

### LocalStorage

The phone number is saved to `localStorage` using the key specified in the `storageKey` option (default: `'userPhoneNumber'`). If `localStorage` is unavailable or an error occurs during saving, the promise will reject with an error message.

## Examples

### Example 1: Default Usage

```html
<button id="set-phone-button">Set Phone Number</button>

<script>
  document.getElementById('set-phone-button').addEventListener('click', async () => {
    try {
      const savedPhoneNumber = await UniversalPhoneSetter.setPhone();
      if (savedPhoneNumber) {
        alert(`Phone number saved: ${savedPhoneNumber}`);
      } else {
        alert('Modal closed without saving.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
</script>
```

### Example 2: Custom Usage with Validation

```html
<button id="set-phone-button-custom">Set Phone Number (Custom)</button>

<script>
  const customOptions = {
    inputPlaceholder: 'Enter phone number like +7999...',
    validatePhoneNumber: (phone) => {
      if (!phone) return 'Phone number is required.';
      if (!/^\+\d+$/.test(phone)) return 'Invalid format. Use "+" followed by digits.';
      return null;
    },
    classNames: {
      modal: 'custom-modal',
      input: 'custom-input',
      // other class names...
    },
  };

  document.getElementById('set-phone-button-custom').addEventListener('click', async () => {
    try {
      const savedPhoneNumber = await UniversalPhoneSetter.setPhone(customOptions);
      if (savedPhoneNumber) {
        alert(`Custom phone number saved: ${savedPhoneNumber}`);
      } else {
        alert('Custom modal closed without saving.');
      }
    } catch (error) {
      alert(`Custom error: ${error.message}`);
    }
  });
</script>
```

## Development

### Project Structure

The project is structured as follows:

```
.
├── README.md
├── dist
│   ├── index.cjs.js
│   ├── index.cjs.js.map
│   ├── index.esm.js
│   ├── index.esm.js.map
│   ├── index.umd.js
│   └── index.umd.js.map
├── package-lock.json
├── package.json
├── rollup.config.mjs
├── sample-custom.css
├── sample-custom.html
├── sample.html
└── src
    ├── default-styles.js
    └── index.js
```

- **`src/index.js`**: Contains the main logic for the `setPhone` method.
- **`src/default-styles.js`**: Contains the default CSS styles for the modal.
- **`rollup.config.mjs`**: Configuration for Rollup to bundle the package into CJS, ESM, and UMD formats.
- **`sample.html`** and **`sample-custom.html`**: Example HTML files demonstrating usage with default and custom settings.

### Building the Project

To build the project, run:

```bash
npm run build
```

This will generate the bundled files in the `dist` directory.

### Testing

Currently, there are no automated tests. Manual testing can be performed using the provided sample HTML files.

## License

This project is licensed under the MIT License.