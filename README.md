# Universal Phone Setter

A simple, framework-agnostic frontend service packaged as an npm module. It provides a modal window for inputting and saving a user's phone number to `localStorage`.

## Installation

```bash
npm install universal-phone-setter
```

Or using yarn:

```bash
yarn add universal-phone-setter
```

## Usage

The package exports a single asynchronous function `setPhone`.

### Default Usage

```javascript
import { setPhone } from "universal-phone-setter";

// Example in a button click handler
async function handleSetPhoneClick() {
  try {
    console.log("Opening default modal...");
    const savedPhoneNumber = await setPhone(); // Shows the modal with default settings
    if (savedPhoneNumber) {
      console.log(`Phone number saved successfully: ${savedPhoneNumber}`);
    } else {
      // This block won't be reached with default settings,
      // as closing without saving is not allowed by default
      console.log("Modal was closed without saving.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Attach handleSetPhoneClick to a button or other UI element
const myButton = document.getElementById("set-phone-button");
if (myButton) {
  myButton.addEventListener("click", handleSetPhoneClick);
}
```

### Custom Usage with Options

The `setPhone` function can accept an optional `options` object to customize the modal's appearance and behavior.

```javascript
import { setPhone } from "universal-phone-setter";

// Define custom options
const customOptions = {
  inputPlaceholder: "Your phone number...",
  saveButtonText: "Save Number",
  successMessageTemplate: (phone) =>
    `Great! Your number ${phone} has been saved.`,
  closeButtonText: "Close",
  errorMessages: {
    empty: "Number cannot be empty!",
    storage: "Oops! Saving error.",
  },
  classNames: {
    overlay: "my-custom-overlay",
    modal: "my-custom-modal",
    input: "my-custom-input",
    saveButton: "my-custom-save-button",
    successMessage: "my-custom-success",
  },
  allowDismissByOverlay: true, // Allow closing by clicking the overlay
};

async function handleCustomSetPhoneClick() {
  try {
    console.log("Opening custom modal...");
    const savedPhoneNumber = await setPhone(customOptions);
    if (savedPhoneNumber) {
      console.log(`Phone number saved via custom modal: ${savedPhoneNumber}`);
    } else {
      // This block can be reached if allowDismissByOverlay is true
      // and the user clicks outside the modal
      console.log("Modal was closed without saving (by clicking overlay).");
    }
  } catch (error) {
    console.error("An error occurred while calling setPhone:", error);
  }
}

// Attach handleCustomSetPhoneClick to another button
const myCustomButton = document.getElementById("set-phone-button-custom");
if (myCustomButton) {
  myCustomButton.addEventListener("click", handleCustomSetPhoneClick);
}
```

### Usage in Browser (UMD via `<script>` tag)

Include the UMD build in your HTML file:

```html
<script src="node_modules/universal-phone-setter/dist/index.umd.js"></script>
<button id="set-phone-button-html">Set Phone Number (Default)</button>
<button id="set-phone-button-custom-html">Set Phone Number (Custom)</button>

<script>
  // Default usage
  document
    .getElementById("set-phone-button-html")
    .addEventListener("click", async () => {
      try {
        // The function is available globally via the name defined in rollup.config.mjs
        const savedPhoneNumber = await UniversalPhoneSetter.setPhone();
        if (savedPhoneNumber) {
          console.log(
            `Phone number saved from HTML (default): ${savedPhoneNumber}`
          );
        }
      } catch (error) {
        console.error("Error (default):", error);
      }
    });

  // Custom usage
  document
    .getElementById("set-phone-button-custom-html")
    .addEventListener("click", async () => {
      const myOptions = {
        inputPlaceholder: "Phone for UMD...",
        saveButtonText: "Save (UMD)",
        classNames: {
          modal: "umd-custom-modal" /* Add other classes as needed */,
        },
        // Add CSS for .umd-custom-modal in your <style> or CSS file
      };
      try {
        const savedPhoneNumber = await UniversalPhoneSetter.setPhone(myOptions);
        if (savedPhoneNumber) {
          console.log(
            `Phone number saved from HTML (custom): ${savedPhoneNumber}`
          );
        } else {
          console.log("UMD modal closed without saving.");
        }
      } catch (error) {
        console.error("Error (custom):", error);
      }
    });
</script>
```

## Functionality

- Calling `setPhone(options?)` displays a modal window over the rest of the content.
- The modal contains an input field for the phone number and a "Save" button.
- **Customization:** Behavior and appearance can be customized via the `options` object.
- **Saving:** When "Save" is clicked:
  - Checks that the input is not empty (error message is customizable).
  - Saves the phone number to `localStorage` under the key `userPhoneNumber`.
  - Displays a success message (template is customizable) and a "Close" button (text is customizable).
  - The promise returned by `setPhone()` resolves with the saved phone number.
- **Closing:**
  - The "Close" button (after success) closes the modal. The promise resolves with `null`.
  - If `allowDismissByOverlay: true`, clicking the overlay also closes the modal. The promise resolves with `null`.
- **Styling:** Basic styles are applied for positioning and minimal structure. For detailed styling, use the CSS classes provided via `options.classNames` and override them in your CSS.

## Configuration Options

The `options` object passed to `setPhone(options)` can contain the following properties:

| Property                    | Type                      | Default                                                                                                                                                                     | Description                                                  |
| --------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `inputPlaceholder`          | string                    | `'Enter phone number'`                                                                                                                                                      | Placeholder text for the input field.                        |
| `saveButtonText`            | string                    | `'Save'`                                                                                                                                                                    | Text on the save button.                                     |
| `successMessageTemplate`    | (phone: string) => string | `(phone) => `Success! Phone number saved: ${phone}``                                                                                                                        | Function that generates the success message.                 |
| `closeButtonText`           | string                    | `'Close'`                                                                                                                                                                   | Text on the close button (after success).                    |
| `errorMessages`             | object                    | `{ empty: 'Please enter a phone number.', storage: 'Failed to save the number.' }`                                                                                          | Object with error messages.                                  |
| `errorMessages.empty`       | string                    | `'Please enter a phone number.'`                                                                                                                                            | Message when trying to save an empty number.                 |
| `errorMessages.storage`     | string                    | `'Failed to save the number.'`                                                                                                                                              | Message when there's an error saving to localStorage.        |
| `classNames`                | object                    | `{ overlay: 'usp-overlay', modal: 'usp-modal', input: 'usp-input', saveButton: 'usp-save-button', successMessage: 'usp-success-message', closeButton: 'usp-close-button' }` | Object with CSS class names for modal elements.              |
| `classNames.overlay`        | string                    | `'usp-overlay'`                                                                                                                                                             | Class for the overlay element.                               |
| `classNames.modal`          | string                    | `'usp-modal'`                                                                                                                                                               | Class for the modal content container.                       |
| `classNames.input`          | string                    | `'usp-input'`                                                                                                                                                               | Class for the input field.                                   |
| `classNames.saveButton`     | string                    | `'usp-save-button'`                                                                                                                                                         | Class for the save button.                                   |
| `classNames.successMessage` | string                    | `'usp-success-message'`                                                                                                                                                     | Class for the success message paragraph.                     |
| `classNames.closeButton`    | string                    | `'usp-close-button'`                                                                                                                                                        | Class for the close button.                                  |
| `allowDismissByOverlay`     | boolean                   | `false`                                                                                                                                                                     | If `true`, allows closing the modal by clicking the overlay. |

## Development

- Clone the repository: `git clone <repository-url>`
- Navigate to the directory: `cd universal-phone-setter`
- Install dependencies: `npm install`
- Build the project: `npm run build` (generates files in the `dist` directory)

## Publishing New Versions (Automatic via GitHub Actions)

This project uses GitHub Actions to automatically publish new versions to npm whenever changes are pushed to the `main` branch.

**Important:** The pipeline will only successfully publish if the version in `package.json` has been incremented since the last published version on npm.

To release a new version:

1. Ensure all code changes are committed.
2. Switch to the `main` branch and update it:
   ```bash
   git checkout main
   git pull origin main
   ```
3. (If necessary) Merge your feature branch into `main`:
   ```bash
   git merge your-feature-branch
   ```
4. Increment the package version using `npm`:
   - For a patch release (bug fixes): `npm version patch -m "Upgrade to %s for [reason]"`
   - For a minor release (new features): `npm version minor -m "Upgrade to %s for [reason]"`
   - For a major release (breaking changes): `npm version major -m "Upgrade to %s for [reason]"`
5. Push the changes and the new tag to GitHub:
   ```bash
   git push origin main --follow-tags
   ```

This will trigger the GitHub Actions workflow to build and publish the new version to npm.

## License

MIT
