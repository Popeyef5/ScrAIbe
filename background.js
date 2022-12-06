// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is a request to generate text
  if (message.type === "generate-text") {
    generateText(message.prompt).then((response) => {
      sendResponse(response);
      console.log(response);
    });
    return true;
  }
});

async function generateText(prompt) {
  // Get the user's API key from storage
  const apiKey = await chrome.storage.local.get("apiKey");
  // Check if the user has an API key
  if (apiKey && apiKey.apiKey) {
    // Build the request body for the /completions endpoint
    const requestBody = {
      prompt: prompt,
      model: "text-davinci-003",
      temperature: 0.5,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    // Call the /completions endpoint of the OpenAI API
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    console.log(response);
    // Check if the request was successful
    if (response.ok) {
      // Parse the response body
      const responseBody = await response.json();
      console.log(responseBody);
      // Return the generated text
      return {
        type: "text-generated",
        text: responseBody.choices[0].text,
      };
    } else {
      // Return an error message
      return {
        type: "error",
        error: "Failed to generate text",
      };
    }
  } else {
    // Return an error message
    return {
      type: "error",
      error: "No API key found",
    };
  }
}
