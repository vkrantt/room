import mongoose from "mongoose";
import chalk from "chalk";

export const mongoConnection = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);

    console.log(chalk.bold.yellow(`Database connected - ${connection.host}`));
  } catch (error) {
    console.log(chalk.bold.red(`Database Error - ${error.message}`));
    process.exit();
  }
};
