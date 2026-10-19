import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import Comment from "./../Components/Comment/Comment";
import CommentCreation from "../Components/CommentCreation/CommentCreation";
import { HiDotsVertical } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";
import type { PostType, TopComment } from "../Types/Post.type";

const menuItemClass =
  "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] px-3.5 py-2.5 font-medium text-ink transition-colors hover:bg-soft hover:text-acc disabled:cursor-not-allowed disabled:opacity-60";
const actionClass =
  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] py-2.5 font-semibold text-mute transition-colors hover:bg-soft hover:text-acc";
const primaryBtnClass =
  "flex cursor-pointer items-center justify-center rounded-xl bg-acc px-5 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";
const ghostBtnClass =
  "cursor-pointer rounded-xl bg-soft px-5 py-2.5 font-semibold text-acc transition hover:brightness-95";

export default function Post({
  post,
  isPostDetails = false,
}: {
  post: PostType;
  isPostDetails: boolean;
}) {
  const {
    user,
    createdAt,
    body,
    image,
    topComment,
    _id,
    commentsCount,
    likesCount,
  } = post;
  const { photo, name, _id: userId } = user;
  const query = useQueryClient();
  const navigate = useNavigate();
  const { userId: loginUserId } = useContext(AuthContext);

  const [isOpen, setisOpen] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [newContent, setnewContent] = useState(body);
  const [newImage, setnewImage] = useState<File | null>(null);

  function getAllComment() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?sort=createdAt`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllComment"],
    queryFn: getAllComment,
    enabled: isPostDetails,
  });

  function handlePostDelete() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: handlePostDelete,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      if (isPostDetails) {
        navigate("/");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handlePostUpdate() {
    const formData = new FormData();
    formData.append("body", newContent);
    if (newImage) {
      formData.append("image", newImage);
    }
    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: handlePostUpdate,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getSinglePost"] });
      setisEditing(false);
      setnewImage(null);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <div className="mx-auto my-4 max-w-[1000px] rounded-2xl border border-line bg-card p-4 font-['Outfit'] text-ink shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={photo}
              alt=""
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="font-bold leading-tight">{name}</p>
              <p className="text-sm text-mute">
                {new Date(createdAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {loginUserId === userId && (
            <div className="relative">
              <button
                type="button"
                aria-label="Post options"
                onClick={() => setisOpen(!isOpen)}
                className="cursor-pointer rounded-lg p-2 text-mute hover:bg-soft hover:text-acc"
              >
                <HiDotsVertical className="text-xl" />
              </button>
              {isOpen && (
                <div className="absolute end-0 top-full z-20 mt-1.5 min-w-[170px] rounded-[14px] border border-line bg-card p-1.5 shadow-[0_12px_32px_rgba(20,25,60,.18)]">
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
                    onClick={() => mutate()}
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

        <div className="mb-3">
          <p className="mb-3 whitespace-pre-wrap">{body}</p>
          {image && (
            <img
              src={image}
              alt=""
              className="max-h-[420px] w-full rounded-xl object-cover"
            />
          )}
        </div>
        <div className="pt-2 pb-4 flex justify-between">
          <div>
            <span>{likesCount}</span> likes
          </div>
          <div>
            <span>{commentsCount}</span> comments
          </div>
        </div>

        <div className="flex gap-1 border-t border-line pt-1.5">
          <button type="button" className={actionClass}>
            <AiFillLike /> Like
          </button>
          <Link to={`/postdetails/${_id}`} className={actionClass}>
            <FaComment /> Comment
          </Link>
          <button type="button" className={actionClass}>
            <FaShare /> Share
          </button>
        </div>

        <CommentCreation
          postId={_id}
          queryKey={isPostDetails ? ["getAllComment"] : ["getAllPosts"]}
        />

        {topComment && (
          <Comment
            postId={_id}
            comment={topComment}
            queryKey={["getAllPosts"]}
          />
        )}

        {isPostDetails &&
          data?.data.data.comments &&
          data?.data.data.comments.map((comment: TopComment) => (
            <Comment
              postId={_id}
              comment={comment}
              key={comment._id}
              queryKey={["getAllComment"]}
            />
          ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C1E]/55 p-5 font-['Outfit']">
          <div className="w-full max-w-[520px] rounded-[18px] bg-card p-6 text-ink">
            <h2 className="mb-4 text-[22px] font-bold">Edit post</h2>
            <textarea
              className="min-h-[110px] w-full resize-none rounded-xl border-[1.5px] border-line bg-card p-3 text-ink focus:border-acc focus:outline-none focus:ring-[3px] focus:ring-soft"
              value={newContent}
              onChange={(e) => setnewContent(e.target.value)}
            />
            {(newImage || image) && (
              <div className="relative mt-3 overflow-hidden rounded-xl">
                <img
                  src={newImage ? URL.createObjectURL(newImage) : image}
                  alt=""
                  className="h-80 w-full object-cover "
                />
                {newImage && (
                  <button
                    type="button"
                    aria-label="Remove new image"
                    onClick={() => setnewImage(null)}
                    className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-lg leading-none text-white hover:bg-black/80"
                  >
                    &times;
                  </button>
                )}
              </div>
            )}
            <label className="mt-3 inline-block cursor-pointer rounded-full bg-soft px-4 py-2 text-sm font-semibold text-acc hover:brightness-95">
              Change image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setnewImage(e.target.files?.[0] || null)}
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setisEditing(false);
                  setnewContent(body);
                  setnewImage(null);
                }}
                className={ghostBtnClass}
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutate()}
                disabled={isUpdating || newContent === ""}
                className={primaryBtnClass}
              >
                {isUpdating ? <FaSpinner className="animate-spin" /> : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
