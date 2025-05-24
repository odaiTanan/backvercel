import mongoose from "mongoose";

export const dbConnection = async () => {
  await mongoose
    .connect(
      "mongodb+srv://odeartanan:odaitanan@cluster0.q65mrun.mongodb.net/",
      {
        dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
      }
    )
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};
