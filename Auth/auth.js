import jwt from "jsonwebtoken";

const jwtSecretKey =
  "04bd7d3e6feef229e19bc73aeb15c30cba9f89ae4cbf9a05411ada7baefdf18a09cecfc2472243807ea1ed1ef617bf400f3223e12d56eb41942524e59b8bc869";

export const emailAuthCreate = (email) => {
  return jwt.sign({ email }, jwtSecretKey, { expiresIn: "3d" });
};

export const emailAuthVerify = (token) => {
  return jwt.verify(token, jwtSecretKey);
};
