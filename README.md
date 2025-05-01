# Universal Phone Setter

A simple, framework-agnostic frontend service packaged as an npm module. It provides a modal window to input and save a user's phone number to `localStorage`.

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

### ES Modules (React, Vue, Angular, etc.)

```javascript
import { setPhone } from "universal-phone-setter";

// Example in a button click handler
async function handleSetPhoneClick() {
  try {
    console.log("Opening phone modal...");
    const savedPhoneNumber = await setPhone(); // Shows the modal
    if (savedPhoneNumber) {
      console.log(`Phone number saved successfully: ${savedPhoneNumber}`);
      // You can use the saved number here if needed
    } else {
      // This part might be reached if cancellation is implemented in the future
      console.log("Modal was closed without saving.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Attach handleSetPhoneClick to a button or other UI element
const myButton = document.getElementById("set-phone-button");
myButton.addEventListener("click", handleSetPhoneClick);
```

### Browser (UMD via `<script>` tag)

Include the UMD build in your HTML file:

```html
<script src="node_modules/universal-phone-setter/dist/index.umd.js"></script>
<button id="set-phone-button-html">Set Phone Number</button>
<script>
  document
    .getElementById("set-phone-button-html")
    .addEventListener("click", async () => {
      try {
        // The function is available globally via the name defined in rollup.config.mjs
        const savedPhoneNumber = await UniversalPhoneSetter.setPhone();
        if (savedPhoneNumber) {
          console.log(`Phone number saved from HTML: ${savedPhoneNumber}`);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
</script>
```

## Functionality

- Calling `setPhone()` displays a modal overlay.
- The modal contains an input field for the phone number and a "Save" button.
- Clicking "Save":
  - Validates that the input is not empty.
  - Saves the phone number to `localStorage` under the key `userPhoneNumber`.
  - Shows a success message with the saved number.
  - Shows a "Close" button.
  - Resolves the promise returned by `setPhone()` with the saved number.
- Clicking "Close" (after success) closes the modal.
- Basic styling is applied for functionality; no custom theme is included.

## Development

- Clone the repository.
- Run `npm install`.
- Run `npm run build` to build the dist files.

## License

MIT
