import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";
import {
  changePasswordSchema,
  type changePasswordSchemaType,
} from "../../schemas/auth.schema";
import { AuthContext } from "../../Context/AuthContext";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink";
const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-card px-3.5 py-3 text-sm text-ink placeholder:text-mute focus:border-acc focus:outline-none focus:ring-[3px] focus:ring-soft";
const errorClass = "mt-1 text-[13px] font-bold text-err";

export default function ChangePassword({ onClose }: { onClose: () => void }) {
  const { setUserLogin } = useContext(AuthContext);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<changePasswordSchemaType>({
    defaultValues: { password: "", newPassword: "" },
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
  });
  const { register, handleSubmit, formState, reset } = form;

  function changePassword(values: changePasswordSchemaType) {
    return axios.patch(
      `https://route-posts.routemisr.com/users/change-password`,
      values,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      toast.success(res.data.message || "Password changed successfully");
      const newToken = res.data?.data?.token;
      if (newToken) {
        localStorage.setItem("userToken", newToken);
        setUserLogin(newToken);
      }
      reset();
      setApiError(null);
      onClose();
    },
    onError: (err: any ) => {
      setApiError( err.response?.data?.message);
      console.log(err.response?.data?.message)
    },
  });

  function handleChangePassword(values: changePasswordSchemaType) {
    setApiError(null);
    mutate(values);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="changePassTitle"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C1E]/55 p-5 font-['Outfit']"
    >
      <form
        onSubmit={handleSubmit(handleChangePassword)}
        className="w-full max-w-[440px] rounded-[18px] bg-card p-6 text-ink"
      >
        <h2 id="changePassTitle" className="mb-4 text-[22px] font-bold">
          Change password
        </h2>

        {apiError && (
          <p className="mb-4 rounded-xl bg-err p-3 text-center text-sm font-bold text-white">
            {apiError}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="password" className={labelClass}>
            Current password
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Enter your current password"
            className={inputClass}
          />
          {formState.errors.password?.message && (
            <p className={errorClass}>{formState.errors.password.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="newPassword" className={labelClass}>
            New password
          </label>
          <input
            {...register("newPassword")}
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            className={inputClass}
          />
          {formState.errors.newPassword?.message && (
            <p className={errorClass}>{formState.errors.newPassword.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setApiError(null);
              onClose();
            }}
            className="cursor-pointer rounded-xl bg-soft px-5 py-2.5 font-semibold text-acc transition hover:brightness-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex cursor-pointer items-center justify-center rounded-xl bg-acc px-5 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Update password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}