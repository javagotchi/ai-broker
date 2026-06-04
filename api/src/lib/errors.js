export class AppError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

export const toErrorResponse = (error) => {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: {
        error: {
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  return {
    status: 500,
    body: {
      error: {
        message: "Internal server error",
      },
    },
  };
};

