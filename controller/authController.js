const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter both username and password" });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ msg: "Username already exists" });
  }
  const hashedPwd = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPwd };
  const user = await User.create(newUser);
  if (user) {
    res.status(200).json({ message: `new user ${username} has created` });
  } else {
    res.status(500).json({ message: "invalid user data received" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Please enter both username and password" });
  }
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) {
    return res.status(401).json({ msg: "Invalid username or password" });
  }
  const unhashedPwd = await bcrypt.compare(password, foundUser.password);
  if (!unhashedPwd) {
    return res.status(401).json({ message: "invaild password" });
  }
  const accessToken = jwt.sign(
    {
      userInfo: {
        username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );
  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const userInfo = {
    id: foundUser._id,
    name: foundUser.username,
    roles: foundUser.roles,
  };
  res.json({ accessToken, userInfo });
};

const logOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "cookie cleared" });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "invalid token" });
      }
      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res.json({
        accessToken,
        roles: foundUser.roles,
        name: foundUser.username,
      });
    }
  );
};
module.exports = { register, login, logOut, refresh };
