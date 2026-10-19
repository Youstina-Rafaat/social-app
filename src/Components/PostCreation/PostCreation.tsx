import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState, type ChangeEvent } from "react";
import { FiImage, FiSend } from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function PostCreation() {
  const [isUploaded, setisUploaded] = useState("");

  const textInput = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const query = useQueryClient();

  function handlePreviweImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setisUploaded(URL.createObjectURL(file));
    }
  }

  function createPost(formData: FormData) {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  function clearForm() {
    setisUploaded("");
    if (textInput.current) textInput.current.value = "";
    if (imageInput.current) imageInput.current.value = "";
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      clearForm();
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success(res.data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleCreatePost() {
    const text = textInput.current?.value ?? "";
    const file = imageInput.current?.files?.[0];
    if (!text && !file) return;

    const formData = new FormData();
    if (text) {
      formData.append("body", text);
    }
    if (file) {
      formData.append("image", file);
    }
    mutate(formData);
  }

  return (
    <div className="mx-auto w-[1000px] rounded-2xl border border-line bg-card p-4 font-['Outfit'] text-ink shadow-sm">
      <textarea
        ref={textInput}
        rows={3}
        dir="auto"
        placeholder="What's on your mind?"
        className="w-full resize-none rounded-xl bg-app p-3 text-ink placeholder:text-mute outline-none transition focus:ring-[3px] focus:ring-soft"
      />

      {isUploaded && (
        <div className="relative mt-3">
          <img
            src={isUploaded}
            alt=""
            className="max-h-[320px] w-full rounded-xl object-cover"
          />
          <IoIosCloseCircle
            onClick={() => {
              setisUploaded("");
              if (imageInput.current) imageInput.current.value = "";
            }}
            className="absolute end-2 top-2 size-8 cursor-pointer text-white drop-shadow"
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-mute transition hover:bg-soft hover:text-acc">
          <FiImage size={18} />
          Add image
          <input
            ref={imageInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePreviweImage}
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          onClick={() => handleCreatePost()}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-acc px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FiSend size={16} />
              Create Post
            </>
          )}
        </button>
      </div>
    </div>
  );
}