import { Post as IPost } from "./Main";
import { db, auth } from "../../configs/firebase";
import {
  Timestamp,
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
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Comment } from "./comment";

interface Props {
  post: IPost;
}

interface Like {
  userId: string;
  likeId: string;
}

export interface IComment {
  userId: string;
  commentId: string;
  content: string;
  timestamp: Timestamp;
  username: string;
}

interface CreateCommentData {
  content: string;
}

export const Post = (props: Props) => {
  const schema = yup.object().shape({
    content: yup.string().required(),
  });
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const likesRef = collection(db, "likes");
  const commentsRef = collection(db, "comments");
  const [user] = useAuthState(auth);
  const { post } = props;
  const [likes, setLikes] = useState<Like[] | null>(null);
  const [comments, setComments] = useState<IComment[] | null>(null);

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user.uid, likeId: newDoc.id }]
            : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToRemoveQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );
      const likeToRemoveData = await getDocs(likeToRemoveQuery);
      const likeId = likeToRemoveData.docs[0].id;
      const likeToRemove = doc(db, "likes", likeId);
      await deleteDoc(likeToRemove);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const commentsDocs = query(commentsRef, where("postId", "==", post.id));

  const getComments = async () => {
    const data = await getDocs(commentsDocs);
    setComments(
      data.docs.map((doc) => ({
        userId: doc.data().userId,
        commentId: doc.id,
        content: doc.data().content,
        timestamp: doc.data().timestamp,
        username: doc.data().username,
      })) as IComment[]
    );
  };

  const submitComment = async (data: CreateCommentData) => {
    console.log(data.content);
    await addDoc(commentsRef, {
      userId: user?.uid,
      postId: post.id,
      content: data.content,
      timestamp: Timestamp.fromDate(new Date()),
      username: user?.displayName
    });
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
    getComments();
  }, []);

  return (
    <div>
      <div>
        <h1>{post.title}</h1>
      </div>
      <div>
        <p>{post.content}</p>
      </div>
      <div>
        <p>{post.username}</p>
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p>Likes: {likes?.length}</p>}
      </div>
      <div>
        {comments && comments?.map((comment) => <Comment comment={comment} />)}
      </div>
      <form onSubmit={handleSubmit(submitComment)}>
        <input type="text" placeholder="Comment..." {...register("content")} />
        <input type="submit" value="&#10148;" />
      </form>
    </div>
  );
};
