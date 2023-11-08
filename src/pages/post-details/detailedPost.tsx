import { useParams } from "react-router-dom";
import {
  getDocs,
  getDoc,
  collection,
  doc,
  query,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../configs/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Comments } from "../../components/Comments";
import { Likes } from "../../components/Likes";

interface PostInfo {
  username: string;
  title: string;
  content: string;
}

export const DetailedPost = () => {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);

  const getPost = async () => {
    const postToGet = doc(db, "posts", id!);
    const postDoc = await getDoc(postToGet);
    setPostInfo(postDoc.data() as PostInfo);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div>
      <h1>{postInfo?.title}</h1>
      <h2>{postInfo?.username}</h2>
      <p>{postInfo?.content}</p>
      <Likes postId={id!} />
      <Comments postId={id!} />
    </div>
  );
};
