import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type loginSchemaType } from "../../schemas/auth.schema";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-card px-3.5 py-3 text-sm text-ink placeholder:text-mute focus:border-acc focus:outline-none focus:ring-[3px] focus:ring-soft";
const errorClass = "mt-1 text-[13px] font-bold text-err";

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });
  const { register, handleSubmit, formState } = form;

  function handleLogin(values: loginSchemaType) {
    setIsLoading(true);
    axios
      .post(`https://route-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        if (res.data.success) {
          toast.success("Logged in successfully");
          navigate("/home");
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
            Good to see you again.
          </h1>
          <p className="hidden max-w-[34ch] text-lg opacity-90 md:block">
            Pick up where you left off and catch up on new posts.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-card px-6 py-10">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-full max-w-[400px]"
        >
          <h2 className="mb-1.5 text-3xl font-bold text-ink">Log in</h2>
          <p className="mb-7 text-mute">Enter your email and password.</p>

          {apiError && (
            <p className="mb-5 rounded-xl bg-err p-3 text-center text-sm font-bold text-white">
              {apiError}
            </p>
          )}

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

          <div className="mb-5">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Your password"
              className={inputClass}
            />
            {formState.errors.password?.message && (
              <p className={errorClass}>{formState.errors.password?.message}</p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-acc px-5 py-3 font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

          <p className="mt-5 text-center text-mute">
            New here?
            <Link to="/register" className="font-semibold text-acc">
              <span> Create an account</span>
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
