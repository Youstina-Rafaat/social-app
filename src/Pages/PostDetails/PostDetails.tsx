import { Link, useParams } from "react-router-dom";
import Post from "../../Post/Post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../Loader/Loader";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function PostDetails() {
  const { id } = useParams();

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getSinglePost,
  });

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }
  return (
    <>
      <div className="mx-auto max-w-[950px] pt-5 font-['Outfit']">
        <Link
          to="/"
          className="rounded-[10px] bg-soft px-3.5 py-2 font-semibold text-acc hover:brightness-95"
        >
          <FaArrowLeftLong className="inline mr-2 mb-[2px]"/>Back to feed
        </Link>
      </div>
      <Post post={data?.data.data.post} isPostDetails={true} />
    </>
  );
}
