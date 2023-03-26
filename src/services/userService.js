import { apiUrl, apiHeader } from "../config.json";
import axios from "axios";

const apiEndpoint = apiUrl + "/users";

function UserUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export async function getusers() {
  let users = {};
  await axios.get(apiEndpoint, { apiHeader }).then((res) => {
    users = res["data"];
  });
  return users;
}

export async function getuser(id) {
  let user = {};
  await axios.get(UserUrl(id), { apiHeader }).then((res) => {
    user = res["data"];
  });
  return user ? user : {};
}

export async function saveuser(user, userId) {
  let userInDb = { ...user };

  if (!user.username) {
    console.log("Username can not be empty!");
    return;
  }
  if (!user.password) {
    console.log("Password can not be empty!");
    return;
  }
  if (!user.name) {
    console.log("Password can not be empty!");
    return;
  }

  if (userId === "new") {
  } else {
    await getuser(userId).then((dbuser) => {
      userInDb = dbuser;
    });
  }

  userInDb.email = user.username;
  delete userInDb["username"];
  userInDb.password = user.password;
  userInDb.name = user.name;
  delete userInDb["_id"];
  let resp2 = {};
  if (userId === "new") {
    // New User
    await axios.post(apiEndpoint, userInDb, { apiHeader }).then((resp) => {
      // userInDb = resp["data"];
      // return resp;
      resp2 = resp;
    });
  } else {
    // Update  User
    await axios.put(UserUrl(userId), userInDb, { apiHeader }).then((resp) => {
      // userInDb = resp["data"];
      // return resp;
      resp2 = resp;
    });
  }
  // return userInDb;
  // console.log("saveuser:", resp2);
  return resp2;
}

export async function deleteuser(id) {
  let restdel = {};
  await axios.delete(UserUrl(id)).then((res) => {
    restdel = res;
  });
  return restdel;
}
