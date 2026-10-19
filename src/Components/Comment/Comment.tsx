import { useContext, useState } from "react";
import type { TopComment } from "../../Types/Post.type";
import { AuthContext } from "../../Context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { HiDotsVertical } from "react-icons/hi";
import { FaPen, FaSpinner, FaTrashAlt } from "react-icons/fa";

const menuItemClass =
  "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] px-3.5 py-2.5 font-medium text-ink transition-colors hover:bg-soft hover:text-acc disabled:cursor-not-allowed disabled:opacity-60";

export default function Comment({
  comment,
  postId,
  queryKey,
}: {
  comment: TopComment;
  postId: string;
  queryKey: string[];
}) {
  const query = useQueryClient();
  const [isOpen, setisOpen] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [newContent, setnewContent] = useState(comment.content);
  const [newImage, setnewImage] = useState<File | null>(null);
  const { userId: loginUserId } = useContext(AuthContext);

  function handleCommentDelete() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  function handleCommentUpdate() {
    const formData = new FormData();
    formData.append("content", newContent);
    if (newImage) {
      formData.append("image", newImage);
    }
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: handleCommentDelete,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: handleCommentUpdate,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey });
      setisEditing(false);
      setnewImage(null);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <div className="my-3 flex gap-2.5 font-['Outfit'] text-ink">
        <img
          src={comment.commentCreator.photo}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newContent}
                onChange={(e) => setnewContent(e.target.value)}
                className="w-full rounded-[14px] border-[1.5px] border-acc bg-card px-3.5 py-2.5 text-ink ring-[3px] ring-soft focus:outline-none"
              />

              {(newImage || comment.image) && (
                <img
                  src={newImage ? URL.createObjectURL(newImage) : comment.image}
                  alt=""
                  className="max-h-60 rounded-xl object-cover"
                />
              )}

              <label className="inline-block w-fit cursor-pointer rounded-full bg-soft px-3.5 py-1.5 text-sm font-semibold text-acc hover:brightness-95">
                Change image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setnewImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              <div className="flex items-center justify-end gap-2">
                <small className="me-auto text-mute">Editing comment</small>
                <button
                  onClick={() => {
                    setisEditing(false);
                    setnewContent(comment.content);
                    setnewImage(null);
                  }}
                  className="cursor-pointer rounded-[10px] bg-soft px-4 py-1.5 text-sm font-semibold text-acc hover:brightness-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateMutate()}
                  disabled={isUpdating || newContent.trim() === ""}
                  className="flex cursor-pointer items-center justify-center rounded-[10px] bg-acc px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? <FaSpinner className="animate-spin" /> : "Update"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-1">
                <div className="inline-block max-w-full rounded-[14px] bg-app px-3.5 py-2.5">
                  <p className="text-sm font-bold">{comment.commentCreator.name}</p>
                  <p>{comment.content}</p>
                  {comment.image && (
                    <img
                      src={comment.image}
                      alt=""
                      className="mt-2 max-h-60 rounded-xl object-cover"
                    />
                  )}
                </div>

                {loginUserId === comment.commentCreator._id && (
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Comment options"
                      onClick={() => setisOpen(!isOpen)}
                      className="cursor-pointer rounded-lg p-1.5 text-mute hover:bg-soft hover:text-acc"
                    >
                      <HiDotsVertical className="text-lg" />
                    </button>
                    {isOpen && (
                      <div className="absolute start-0 top-full z-20 mt-1.5 min-w-[170px] rounded-[14px] border border-line bg-card p-1.5 shadow-[0_12px_32px_rgba(20,25,60,.18)]">
                        <button
                          onClick={() => {
                            setisEditing(true);
                            setisOpen(false);
                          }}
                          className={menuItemClass}
                        >
                          Edit <FaPen />
                        </button>
                        <button
                          onClick={() => {
                            mutate();
                            setisOpen(false);
                          }}
                          disabled={isPending}
                          className={`${menuItemClass} !text-err hover:!bg-err/10`}
                        >
                          {isPending ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <>
                              Delete <FaTrashAlt />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="ms-1 mt-1 text-[13px] text-mute">
                {new Date(comment.createdAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}