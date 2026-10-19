import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa";
import { FaCommentAlt } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";

type CommentForm = {
  content: string;
  image?: FileList;
};

export default function CommentCreation({
  postId,
  queryKey,
}: {
  postId: string;
  queryKey: string[];
}) {
  const { register, handleSubmit, reset } = useForm<CommentForm>({
    defaultValues: { content: "" },
  });
  const query = useQueryClient();

  function createComment(formData: FormData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      reset();
      query.invalidateQueries({ queryKey: queryKey });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleCreateComment(values: CommentForm) {
    const file = values.image?.[0];
    if (!values.content && !file) return;
    const formData = new FormData();
    if (values.content) {
      formData.append("content", values.content);
    }
    if (file) {
      formData.append("image", file);
    }
    mutate(formData);
  }

  return (
    <div className="mt-3.5 font-['Outfit']">
      <form
        className="flex items-center gap-2"
        onSubmit={handleSubmit(handleCreateComment)}
      >
        <label
          title="Add image"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-soft text-acc transition hover:brightness-95"
        >
          <FaImage className="size-[18px]" />
          <input {...register("image")} type="file" accept="image/*" hidden />
        </label>

        <input
          {...register("content")}
          type="text"
          dir="auto"
          placeholder="Write a comment"
          className="min-w-0 flex-1 rounded-full bg-app px-4 py-2.5 text-sm text-ink placeholder:text-mute outline-none transition focus:ring-[3px] focus:ring-soft"
        />

        <button
          disabled={isPending}
          type="submit"
          aria-label="Send comment"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-acc text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaCommentAlt className="size-4" />
          )}
        </button>
      </form>
    </div>
  );

}