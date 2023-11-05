import { useEffect, useState } from "react";
import { db } from "../../configs/firebase";
import { getDocs, collection, getDoc } from "firebase/firestore";
import { Post } from "./post";

export interface Post {
  id: string;
  userId: string;
  content: string;
  title: string;
  username: string;
}

export const Main = () => {
  const postRef = collection(db, "posts");
  const [postList, setPostList] = useState<Post[] | null>(null);

  const getPosts = async () => {
    const data = await getDocs(postRef);
    setPostList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    );
  };
  useEffect(() => {
    getPosts();
  }, []);

  return <div>{postList?.map((post) => <Post post = {post}/>)}</div>;
};
