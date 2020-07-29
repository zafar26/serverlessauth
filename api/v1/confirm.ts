import { NowRequest, NowResponse } from "@vercel/node";

const forbiddenRequest = 403;

export default async (req: NowRequest, res: NowResponse) => {
  // check the request method
  if (req.method != "GET") {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "invalid request method",
    });
    return;
  }

  // check request query data
  if (!req.query) {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "got empty request query",
    });
    return;
  }

  //
  if (!req.query.email || !req.query.token || !req.query.mode) {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "required data is missing in request query",
    });
    return;
  }

  const { email, mode, token } = req.query;

  res.statusCode = 200;
  res.send({
    message: "success",
    email: email,
    mode: mode,
    token: token,
  });
  return;
};
