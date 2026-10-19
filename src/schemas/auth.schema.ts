import * as zod from "zod";

export const registerSchema = zod.object({
  name: zod
    .string()
    .nonempty("name is required")
    .min(3, "min length is 3 chars")
    .max(10, "max length is 10chars"),
  email: zod
    .email()
    .nonempty("email is required")
    .regex(
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      "invalid email",
    ),
  gender: zod.enum(["male", "female"]),
  dateOfBirth: zod.string().refine((dateValue) => {
    const userDate = new Date(dateValue).getFullYear();
    const nowDate = new Date().getFullYear();
    return nowDate - userDate > 10 ? true : false;
  }, "invalid date"),
  password:zod.string().nonempty("password is required").regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,"invalid password"),
  rePassword:zod.string().nonempty("repassword is required")
}).refine((obj)=>{
  if(obj.rePassword===obj.password){
    return true
  }else{
    return false
  }
},{
  path:["rePassword"],
  error:"password and repassword not match"
});


export type registerSchemaType=zod.infer<typeof registerSchema>

export const loginSchema = zod.object({

  email: zod
    .email()
    .nonempty("email is required")
    .regex(
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      "invalid email",
    ),
  password:zod.string().nonempty("password is required").regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,"invalid password"),
})


export type loginSchemaType=zod.infer<typeof loginSchema>

export const changePasswordSchema = zod
  .object({
    password: zod.string().nonempty("Current password is required"),
    newPassword: zod
      .string()
      .nonempty("New password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        "At least 8 characters with upper, lower, a number and a symbol",
      ),
  })
  .refine((data) => data.password !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from the current one",
  });

export type changePasswordSchemaType = zod.infer<typeof changePasswordSchema>;