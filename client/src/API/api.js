// This file centralizes all API calls to your backend.
// Replace the mock URLs with your actual backend endpoints.

const API_BASE_URL = "https://your-backend-api.com/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
};

// Fetch all available listings from the backend
export const fetchListings = async () => {
  // Replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/listings`);
  return handleResponse(response);
};

// Fetch a single listing by its ID
export const fetchListingById = async (listingId) => {
  // Replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/listings/${listingId}`);
  return handleResponse(response);
};

// Submit a new listing to the backend
export const createListing = async (listingData) => {
  // Replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listingData),
  });
  return handleResponse(response);
};

// Submit a new purchase to the backend
export const submitPurchase = async (purchaseData) => {
  // Replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/purchases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchaseData),
  });
  return handleResponse(response);
};

// Fetch a user's purchase history
export const fetchPurchaseHistory = async (userId) => {
  // Replace with your actual endpoint
  const response = await fetch(`${API_BASE_URL}/users/${userId}/purchases`);
  return handleResponse(response);
};
