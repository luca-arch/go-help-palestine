const requestTimeoutSeconds = 15;

export type Message = {
  message: string;
  name: string;
};

export const sendMessage = (message: Message): Promise<void> => {
  return window
    .fetch("/api/contact", {
      body: JSON.stringify(message),
      method: "POST",
      signal: AbortSignal.timeout(requestTimeoutSeconds * 1000),
    })
    .then((response) => {
      if (response.ok) {
        return;
      }

      console.error(response);

      throw new Error(`Error: ${response.statusText}`);
    });
};
