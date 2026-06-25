export const validateCreatePool = (data) => {
  const {
    cropName,
    targetQuantity,
    price,
    latitude,
    longitude,
    initialQuantity,
    pickupLocation
  } = data;

  if (!cropName) {
    return { field: "cropName", message: "Crop is required" };
  }

  if (!targetQuantity || Number(targetQuantity) <= 0) {
    return { field: "targetQuantity", message: "Invalid target quantity" };
  }

  if (!price || Number(price) <= 0) {
    return { field: "price", message: "Invalid price" };
  }

  if (!latitude || !longitude) {
    return { field: "location", message: "Location required" };
  }

  if (!pickupLocation) {
    return { field: "pickupLocation", message: "Pickup location is required" };
  }

  if (initialQuantity !== undefined && initialQuantity !== null && initialQuantity !== "") {
    const numInitial = Number(initialQuantity);
    const numTarget = Number(targetQuantity);
    if (isNaN(numInitial) || numInitial <= 0) {
      return { field: "initialQuantity", message: "Initial quantity must be positive" };
    }
    if (numInitial > numTarget) {
      return { field: "initialQuantity", message: "Initial quantity cannot exceed target quantity" };
    }
  }

  return null;
};