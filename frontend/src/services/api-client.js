const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api/v1";

export const apiClient = {
  async get(path) {
    const response = await fetch(`${apiBaseUrl}${path}`);
    return handleResponse(response);
  },

  async post(path, body) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  async put(path, body) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  async delete(path) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "DELETE",
    });

    return handleResponse(response);
  },
};

const handleResponse = async (response) => {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Request failed");
  }

  return payload;
};
