import axios from "axios";
import Post from "../../Post/Post";
import Loader from "../../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../../Components/PostCreation/PostCreation";
import type { PostType } from "../../Types/Post.type";

export default function Home() {
  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }
  return (
    <>
      <div className="my-6 font-['Outfit']">
        <div>
          <PostCreation />
        </div>

        {data?.data.data.posts?.map((post: PostType) => (
          <Post post={post} key={post._id} isPostDetails={false} />
        ))}
      </div>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f7354201667d48a122dcbd0bdaebddde28c4ab37
