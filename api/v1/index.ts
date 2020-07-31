import { NowRequest, NowResponse } from "@vercel/node";
import { Myhtml } from "../../utils/mjml";

export default function (req: NowRequest, res: NowResponse) {
  // console.log(Myhtml.errors,"MYHTML___ERRORS")
  // res.send(Myhtml.html);
  const { name = "World" } = req.query;
  res.send(`Hello ${name}`);
}
