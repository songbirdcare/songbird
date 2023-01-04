import type express from "express";

export const errorLogger: express.ErrorRequestHandler = (err, _, __, next) => {
  console.error(err);
  next(err);
};
