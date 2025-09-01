// src/utils/validation.js

export const validateField = (field, value) => {
  let err = "";

  // Skip read-only fields
  if (field.isfieldEditable === "F") {
    return "";
  }

  // Mandatory check
  if (!value || value.toString().trim() === "") {
    return `${field.fieldName} is required.`;
  }

  switch (field.fieldType) {
    case "NUMBER":
    case "DECIMAL":
      if (isNaN(value)) {
        err = `Please enter a valid number for ${field.fieldName}.`;
      } else {
        if (field.fieldMinVal && Number(value) < Number(field.fieldMinVal)) {
          err = `${field.fieldName} must be ≥ ${field.fieldMinVal}.`;
        }
        if (field.fieldMaxVal && Number(value) > Number(field.fieldMaxVal)) {
          err = `${field.fieldName} must be ≤ ${field.fieldMaxVal}.`;
        }
        if (
          field.fieldLength &&
          value.toString().length !== Number(field.fieldLength)
        ) {
          err = `${field.fieldName} must be exactly ${field.fieldLength} digits.`;
        }
      }
      break;

    case "EMAIL":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        err = `Please enter a valid email address.`;
      }
      break;

    case "TEXT":
      if (field.fieldLength && value.length > Number(field.fieldLength)) {
        err = `${field.fieldName} cannot exceed ${field.fieldLength} characters.`;
      }
      break;

    case "SELECT":
      if (!value || value === "") {
        err = `Please select a value for ${field.fieldName}.`;
      }
      break;

    case "RATING":
      if (
        Number(value) < Number(field.fieldMinVal) ||
        Number(value) > Number(field.fieldMaxVal)
      ) {
        err = `${field.fieldName} must be between ${field.fieldMinVal} and ${field.fieldMaxVal}.`;
      }
      break;
  }

  return err;
};

export const validateForm = (formData) => {
  const errors = {};
  let missingFields = [];

  if (!formData.FSRdetails) return { errors, missingFields };

  formData.FSRdetails.forEach((tab) => {
    tab.fsrFieldDetList.forEach((field) => {
      const val = field.fieldValue; // 👈 use the bound value directly
      const err = validateField(field, val);

      if (err) {
        errors[field.fieldId] = err;
        if (err.includes("required")) {
          missingFields.push(field.fieldName);
        }
      }
    });
  });

  return { errors, missingFields };
};
