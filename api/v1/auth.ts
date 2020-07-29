import { NowRequest, NowResponse } from "@vercel/node";
import { mailer } from "../../utils/mailer";
import { getUserByEmail } from "../../data/user";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const defaultAuthMode = "signin";
const forbiddenRequest = 403;

export default async (req: NowRequest, res: NowResponse) => {
  // check the request method
  if (req.method != "POST") {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "invalid request method",
    });
    return;
  }

  // check request header content_type
  if (req.headers["content-type"] != "application/json") {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "invalid request header content-type",
    });
    return;
  }

  // check request body data
  if (!req.body) {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "got empty request body",
    });
    return;
  }

  // check email field in request body
  if (!req.body.email) {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "required data is missing in request body",
    });
    return;
  }

  // deconstruct required data from request body
  const { email, mode = defaultAuthMode } = req.body;

  // check email syntax with regex
  if (!emailRegex.test(email)) {
    res.statusCode = forbiddenRequest;
    res.send({
      message: "invalid email syntax in request body",
    });
    return;
  }

  // check user existence in db
  const user = await getUserByEmail(email);

  if (mode == "signin") {
    if (user.length == 0) {
      res.statusCode = forbiddenRequest;
      res.send({
        message: "user not found, send request for signup first",
      });
      return;
    }

    // check completion of user signup verification
    if (!user[0].is_enabled) {
      res.statusCode = forbiddenRequest;
      res.send({
        message: "user cant signin, complete signup verification first",
      });
      return;
    }
  }

  await mailer(
    email,
    mode,
    `http://localhost:3000/api/v1/confirm?email=${email}&mode=${mode}&token=aadfasdjfa552asdf`,
    "demoauth"
  );

  // if every things goes well
  res.statusCode = 200;
  res.send({
    message: "success",
    data: user[0],
    email: email,
    mode: mode,
  });
  return;
};
