export const DEFAULT_STYLES = `
.usp-overlay {
  background-color: rgba(0,0,0,0.5);
  /* Positioning styles remain inline in index.js */
  /* display, justify-content, align-items remain inline in index.js */
}
.usp-modal {
  background: white;
  padding: 1.5rem; /* ছিল 1.5rem */
  border-radius: 0.3125rem; /* 5px -> 0.3125rem */
  min-width: 18.75rem; /* 300px -> 18.75rem */
  text-align: center;
  /* display, flex-direction remain inline in index.js */
  gap: 0.75rem; /* ছিল 0.75rem */
}
.usp-input {
  /* display: block; */ /* Controlled by parent flex layout */
  width: calc(100% - 1rem); /* 16px -> 1rem */
  padding: 0.5rem; /* 8px -> 0.5rem */
  border: 1px solid #ccc; /* Keep 1px border */
  border-radius: 0.1875rem; /* 3px -> 0.1875rem */
}
.usp-error-message {
  color: red;
  min-height: 1.2em; /* Relative unit */
  font-size: 0.9em; /* Relative unit */
  margin-top: -0.25rem; /* ছিল -0.25rem */
  margin-bottom: 0.25rem; /* ছিল 0.25rem */
  text-align: left;
  visibility: hidden; /* Hidden by default, but occupies space */
  transition: visibility 0s linear 0.1s;
}
.usp-error-message--visible { /* Class to show the error */
  visibility: visible;
  transition-delay: 0s;
}
.usp-save-button,
.usp-close-button {
  /* display: block; */ /* Controlled by parent flex layout */
  width: 100%;
  padding: 0.625rem; /* 10px -> 0.625rem */
  border: 1px solid #ccc; /* Keep 1px border */
  border-radius: 0.1875rem; /* 3px -> 0.1875rem */
  cursor: pointer;
  background-color: #eee;
  /* visibility controlled by parent state class */
}
.usp-save-button:hover,
.usp-close-button:hover {
  background-color: #ddd;
}
.usp-success-message {
  color: green;
  margin: 0.5rem 0; /* ছিল 0.5rem */
  min-height: 1.2em; /* Relative unit */
  /* visibility controlled by parent state class */
}

/* --- State management via class on .usp-modal --- */

/* Initial state: hide success elements */
.usp-modal .usp-success-message,
.usp-modal .usp-close-button {
  visibility: hidden;
}

/* Success state: --state-success class is added to .usp-modal (or custom class) */
/* Hide input elements */
.usp-modal--state-success .usp-input,
.usp-modal--state-success .usp-save-button {
  visibility: hidden;
}
/* Hide error message, even if it was visible */
.usp-modal--state-success .usp-error-message {
  visibility: hidden;
}
/* Show success elements */
.usp-modal--state-success .usp-success-message,
.usp-modal--state-success .usp-close-button {
  visibility: visible;
}
`;
