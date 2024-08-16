import { NextRequest } from "next/server";
import prisma from "../../libs/prisma";
var bcrypt = require("bcryptjs");

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { password, email, name, account } = data;
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT!));
    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw new Error("Unable to hash password");
    

    const saveData = {
      email,
      hasehedpassword: hash,
      name,
      account,
    };
    console.log(saveData);

    const checkExistingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (checkExistingUser) {
      return new Response(
        JSON.stringify({ status: 500, data: "User with same email already registered" }),
        { status: 500 }
      );
    }

    const register = await prisma.user.create({
      data: saveData,
    });

    if (!register) {
      return new Response(
        JSON.stringify({ status: 500, data: "Unable to register user" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Account opened successfully!", data: {} }),
      { status: 200 }
    );

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
