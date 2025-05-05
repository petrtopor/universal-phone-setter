export const DEFAULT_STYLES = `
.usp-overlay {
  background-color: rgba(0,0,0,0.5);
}
.usp-modal {
  background: white;
  padding: 1.5rem;
  border-radius: 0.3125rem;
  min-width: 18.75rem;
  text-align: center;
  gap: 0.75rem;
}
.usp-input {
  width: calc(100% - 1rem);
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.1875rem;
}
.usp-error-message {
  color: red;
  min-height: 1.2em;
  font-size: 0.9em;
  margin-top: -0.25rem;
  margin-bottom: 0.25rem;
  text-align: left;
  visibility: hidden;
  transition: visibility 0s linear 0.1s;
}
.usp-error-message--visible {
  visibility: visible;
  transition-delay: 0s;
}
.usp-save-button,
.usp-close-button {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #ccc;
  border-radius: 0.1875rem;
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
  min-height: 1.2em;
}

.usp-modal .usp-success-message,
.usp-modal .usp-close-button {
  visibility: hidden;
}

.usp-modal--state-success .usp-input,
.usp-modal--state-success .usp-save-button {
  visibility: hidden;
}

.usp-modal--state-success .usp-error-message {
  visibility: hidden;
}

.usp-modal--state-success .usp-success-message,
.usp-modal--state-success .usp-close-button {
  visibility: visible;
}
`;
