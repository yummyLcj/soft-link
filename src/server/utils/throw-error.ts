import http from 'http';

export const throwError = (res: http.ServerResponse, message: string) => {
  res.writeHead(500, { 'content-type': 'application/json' }).end(
    JSON.stringify({
      success: false,
      message,
    })
  );
};
