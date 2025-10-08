// src/utils/validation.js

export const validateField = (field, value) => {
  const mobileFields = new Set([
    "COMPREQ_MOB_NO",
    "GCLREP_MOB_NO",
    "COMPDET_CALLER_NO",
    "COMPDET_CUST_NO",
    "SITEDET_MOB_NO",
    "CUSTREP_MOB",
    "PRECOMM_MOB_NO",
    "CUST_REP_MOB_NO",
    "GCL_REP_MOB_NO",
    "SITE_MOB_NO",
    "REQDET_REP_MOB",
    "REQDET_MOB_NO",
    "REQDET_CALLER_MOB",
    "CUSTREP_MOB_NO",
    "GCLREP_MOB",
    "SITEDET_MOB",
  ]);

  let err = "";

  // Skip read-only fields4\
  console.log(
    `field from validateField field =  ${field.fieldName}, val = ${field.fieldValue}, type = ${field.fieldType}`
  );
  console.log(
    `field from validateField [minVal =  ${field.fieldMinVal}, maxVal = ${field.fieldMaxVal}, length = ${field.fieldLength}]`
  );
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
        console.log(typeof field.fieldId);
        console.log("fieldId: ", field.fieldId);

        console.log("mobileFields has field", mobileFields.has(field.fieldId));
        if (mobileFields.has(field.fieldId)) {
          console.log(typeof value);

          if (Number(field.fieldLength) !== value.toString().length) {
            console.log("field length: ", value.toString().length);

            err = `${field.fieldName} must be exactly 10`;
          }
        } else {
          if (field.fieldMinVal && Number(value) < Number(field.fieldMinVal)) {
            err = `${field.fieldName} must be ≥ ${field.fieldMinVal}.`;
          }
          if (field.fieldMaxVal && Number(value) > Number(field.fieldMaxVal)) {
            console.log(
              "Phone number: ",
              Number(value) > Number(field.fieldMaxVal)
            );

            err = `${field.fieldName} must be ≤ ${field.fieldMaxVal}.`;
          }
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
      console.log(
        `tab = ${tab?.tabName}, field = ${field.fieldName}, val = ${val} from validate form`
      );
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
