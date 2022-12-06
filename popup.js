// Add an event listener to the save button
document.querySelector("#save-button").addEventListener("click", function () {
  // Get the API key from the input field
  var apiKey = document.querySelector("#api-key-input").value;
  // Save the API key to storage
  chrome.storage.local.set({ apiKey: apiKey }, function () {
    // Notify the user that the API key was saved
    document.querySelector("#status").innerText = "Saved";
  });
});

// Get the current API key from storage
chrome.storage.local.get("apiKey", function (data) {
  // Show the current API key in the input field
  document.querySelector("#api-key-input").value = data.apiKey;
});
