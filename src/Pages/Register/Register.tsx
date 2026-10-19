import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type registerSchemaType,
} from "../../schemas/auth.schema";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-card px-3.5 py-3 text-sm text-ink placeholder:text-mute focus:border-acc focus:outline-none focus:ring-[3px] focus:ring-soft";
const errorClass = "mt-1 text-[13px] font-bold text-err";
const radioLabelClass =
  "flex flex-1 cursor-pointer select-none items-center gap-2 rounded-xl border-[1.5px] border-line px-3.5 py-3 text-sm font-medium text-ink has-[:checked]:border-acc has-[:checked]:bg-soft";

export default function Register() {
  const { setUserLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<registerSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      password: "",
      rePassword: "",
      gender: "female",
    },
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });
  const { register, handleSubmit, formState } = form;

  function handleRegister(values: registerSchemaType) {
    setIsLoading(true);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        if (res.data.success) {
          toast.success("Account Created! You Can log in Now.");
          localStorage.setItem("userToken", res.data.data.token);
          setUserLogin(res.data.data.token);
          navigate("/login");
        }
      })
      .catch((err) => {
        setApiError(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="grid min-h-screen font-['Outfit'] md:grid-cols-[1.1fr_1fr]">
      <section className="relative flex min-h-[200px] flex-col justify-between overflow-hidden bg-acc p-7 text-white md:p-14">
        <div className="pointer-events-none absolute -bottom-28 -right-36 h-[420px] w-[420px] rounded-full border-2 border-white/25" />
        <div className="pointer-events-none absolute -bottom-8 -right-12 h-[260px] w-[260px] rounded-full border-2 border-white/25 bg-white/10" />
        <div className="relative flex items-center gap-2.5 text-2xl font-bold">
          <span className="inline-block h-[30px] w-[30px] rounded-full border-[5px] border-white" />
          Circle
        </div>
        <div className="relative mt-10 md:mt-0">
          <h1 className="mb-3.5 max-w-[11ch] text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Your people, in one place.
          </h1>
          <p className="hidden max-w-[34ch] text-lg opacity-90 md:block">
            Share what you're up to and see what your friends are posting.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-card px-6 py-10">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="w-full max-w-[400px]"
        >
          <h2 className="mb-1.5 text-3xl font-bold text-ink">
            Create your account
          </h2>
          <p className="mb-7 text-mute">It takes less than a minute.</p>

          {apiError && (
            <p className="mb-5 rounded-xl bg-err p-3 text-center text-sm font-bold text-white">
              {apiError}
            </p>
          )}

          <div className="mb-4">
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Enter your name"
              className={inputClass}
            />
            {formState.errors.name?.message && formState.touchedFields.name && (
              <p className={errorClass}>{formState.errors.name?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="you@example.com"
              className={inputClass}
            />
            {formState.errors.email?.message && (
              <p className={errorClass}>{formState.errors.email?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="dateOfBirth" className={labelClass}>
              Birthday
            </label>
            <input
              {...register("dateOfBirth")}
              type="date"
              id="dateOfBirth"
              className={inputClass}
            />
            {formState.errors.dateOfBirth?.message &&
              formState.touchedFields.dateOfBirth && (
                <p className={errorClass}>
                  {formState.errors.dateOfBirth?.message}
                </p>
              )}
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Password"
                className={inputClass}
              />
              {formState.errors.password?.message && (
                <p className={errorClass}>
                  {formState.errors.password?.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="repassword" className={labelClass}>
                Confirm password
              </label>
              <input
                {...register("rePassword")}
                type="password"
                id="repassword"
                placeholder="Repeat password"
                className={inputClass}
              />
              {formState.errors.rePassword?.message && (
                <p className={errorClass}>
                  {formState.errors.rePassword?.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-5">
            <span className={labelClass}>Gender</span>
            <div className="flex gap-3">
              <label htmlFor="male" className={radioLabelClass}>
                <input
                  {...register("gender")}
                  id="male"
                  type="radio"
                  value="male"
                  className="h-4 w-4 accent-acc"
                />
                Male
              </label>
              <label htmlFor="female" className={radioLabelClass}>
                <input
                  {...register("gender")}
                  id="female"
                  type="radio"
                  value="female"
                  className="h-4 w-4 accent-acc"
                />
                Female
              </label>
            </div>
            {formState.errors.gender?.message &&
              formState.touchedFields.gender && (
                <p className={errorClass}>{formState.errors.gender?.message}</p>
              )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-acc px-5 py-3 font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>

          <p className="mt-5 text-center text-mute">
            Already have an account?
            <Link to="/login" className="font-semibold text-acc">
              <span> Log in</span>
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}