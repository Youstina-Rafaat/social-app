import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import { FiImage, FiSend } from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa6";
import toast from "react-hot-toast";
export default function PostCreation() {
  const [isUploaded, setisUploaded] = useState("")

  const textInput=useRef(null)
  const imageInput=useRef(null)

  const formData=new FormData()

  const query=useQueryClient()

  function handlePreviweImage(e){
    const path=URL.createObjectURL(e.target.files[0])
    setisUploaded(path)
  }
  function createPost(){
    return axios.post(`https://route-posts.routemisr.com/posts`,formData,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }


  function clearForm(){
    setisUploaded("")
    textInput.current.value=""
    imageInput.current.value=""
  }

  const {data,isPending,mutate}=useMutation({
    mutationFn:createPost,
    onSuccess:(res)=>{
      clearForm()
      query.invalidateQueries({queryKey:["getAllPosts"]})
      toast.success(res.data.message)
    },
    onError:(err)=>{toast.error(err.message)},
    onSettled:()=>{}
  })

  function handleCreatePost(){
    if(textInput.current.value===""&& imageInput.current.value==="")return
    if(textInput.current.value){
      formData.append("body",textInput.current.value)
    }
    if(imageInput.current.value){
      formData.append("image",imageInput.current.files[0])
    }

    mutate()
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
            onClick={()=>{setisUploaded("");imageInput.current.value=""}}
            className="absolute end-2 top-2 size-8 cursor-pointer text-white drop-shadow"
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-mute transition hover:bg-soft hover:text-acc">
          <FiImage size={18} />
          Add image
          <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={handlePreviweImage}/>
        </label>

        <button
          type="submit"
          disabled={isPending}
          onClick={()=>handleCreatePost()}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-acc px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending?<>
          <FaSpinner className="animate-spin"/>
          </>
          :<>
          <FiSend size={16} />
          Create Post
          </>
        }
        </button>
      </div>
    </div>
  );
}
