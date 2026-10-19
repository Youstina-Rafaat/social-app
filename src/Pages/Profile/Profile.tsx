import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { FiCalendar, FiClock, FiLock, FiMail, FiUser } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";
import Loader from "../../Loader/Loader";
import Post from "../../Post/Post";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
import type { PostType } from "../../Types/Post.type";

const containerClass = "mx-auto max-w-[1000px] font-['Outfit'] text-ink";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Profile() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  function getProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });

  const user = data?.data.data.user;

  function getMyPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${user._id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const {
    data: postsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useQuery({
    queryKey: ["getAllPosts", "myPosts", user?._id],
    queryFn: getMyPosts,
    enabled: !!user?._id,
  });

  const myPosts: PostType[] = postsData?.data.data.posts || [];

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }
  if (!user) return null;

  const details = [
    { icon: <FiMail />, label: "Email", value: user.email, capitalize: false },
    {
      icon: <FiCalendar />,
      label: "Birthday",
      value: formatDate(user.dateOfBirth),
      capitalize: false,
    },
    { icon: <FiUser />, label: "Gender", value: user.gender, capitalize: true },
    {
      icon: <FiClock />,
      label: "Joined",
      value: formatDate(user.createdAt),
      capitalize: false,
    },
  ];

  const stats = [
    { label: "Posts", value: myPosts.length },
    { label: "Followers", value: user.followersCount },
    { label: "Following", value: user.followingCount },
    { label: "Bookmarks", value: user.bookmarksCount },
  ];

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <div className={`${containerClass} my-6`}>
        {user.cover ? (
          <img
            src={user.cover}
            alt=""
            className="h-44 w-full rounded-t-2xl object-cover"
          />
        ) : (
          <div className="h-44 rounded-t-2xl bg-gradient-to-r from-[#3A47C9] via-acc to-[#9B7CF6]" />
        )}

        <div className="rounded-b-2xl border border-line bg-card px-6 pb-6 shadow-sm">
          <div className="-mt-14 flex flex-wrap items-end gap-4">
            <img
              src={user.photo}
              alt=""
              className="h-28 w-28 rounded-full border-4 border-card bg-card object-cover"
            />
            <div className="pb-1">
              <h1 className="text-2xl font-bold leading-tight">{user.name}</h1>
              <p className="text-mute">@{user.username}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsChangingPassword(true)}
              className="ms-auto flex cursor-pointer items-center gap-2 rounded-xl bg-soft px-4 py-2.5 font-semibold text-acc transition hover:brightness-95"
            >
              <FiLock /> Change password
            </button>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-3 border-t border-line pt-5 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <b className="block text-xl leading-tight text-acc">{stat.value}</b>
                <span className="text-sm text-mute">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold">About</h2>
          <ul className="grid gap-3">
            {details.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft text-acc">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] text-mute">{item.label}</p>
                  <p
                    className={`break-words font-medium ${item.capitalize ? "capitalize" : ""}`}
                  >
                    {item.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="mt-6 text-xl font-bold">My posts</h2>
      </div>
      {isPostsLoading ? (
        <div className="flex justify-center py-10 text-acc">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      ) : isPostsError ? (
        <p className={`${containerClass} py-6 text-center font-bold text-err`}>
          {postsError.message}
        </p>
      ) : myPosts.length === 0 ? (
        <div className={`${containerClass} my-4`}>
          <div className="rounded-2xl border border-line bg-card p-8 text-center text-mute shadow-sm">
            You haven't posted anything yet.
          </div>
        </div>
      ) : (
        myPosts.map((post) => (
          <Post post={post} key={post._id} isPostDetails={false} />
        ))
      )}

      <div className="h-6" />

      {isChangingPassword && (
        <ChangePassword onClose={() => setIsChangingPassword(false)} />
      )}
    </>
  );
}
