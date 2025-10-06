let users = [
  {
    id: 1,
    name: "John Doe",
  },
];

import supabaseCli from "../services/supabase.service.js";

const getAllUsers = async () => {
  const { data, error } = await supabaseCli.from("users").select();
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

const createUserInDB = async (user) => {
  const { data, error } = await supabaseCli
    .from("users")
    .insert([user])
    .select();

  if (error) {
    console.error(error);
    return error;
  }

  return data;
};

const updateUserInDb = async (newData, userId) => {
  const { data, error } = await supabaseCli
    .from("users")
    .update(newData)
    .eq("id", userId)
    .select();

  if (error) {
    console.error(error);
  }

  return data;
};

const deleteUserInDb = async (userId) => {
  const { data, error } = await supabaseCli
    .from("users")
    .delete()
    .eq("id", userId)
    .select();

  if (error) {
    console.error(error);
  }

  return data;
};

export { getAllUsers, createUserInDB, updateUserInDb, deleteUserInDb };