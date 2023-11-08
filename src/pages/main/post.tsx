import { Post as IPost } from "./Main";
import { db, auth } from "../../configs/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Comments } from "../../components/Comments";
import { Likes } from "../../components/Likes";

interface Props {
  post: IPost;
}

interface Like {
  userId: string;
  likeId: string;
}

export const Post = (props: Props) => {
  const { post } = props;

  return (
    <div>
      <div>
        <Link to={`/post/${post.id}`}>
          <h1>{post.title}</h1>
        </Link>
      </div>
      <div>
        <p>{post.content}</p>
      </div>
      <div>
        <p>{post.username}</p>
        <Likes postId={post.id} />
      </div>
      <Comments postId={post.id} />
    </div>
  );
};
