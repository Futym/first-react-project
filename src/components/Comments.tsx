import { yupResolver } from "@hookform/resolvers/yup";
import { Timestamp } from "firebase/firestore";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db, auth } from "../configs/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Comment } from "./comment";

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

interface Props {
  postId: string;
}

export const Comments = (props: Props) => {
  const { postId } = props;
  const [user] = useAuthState(auth);
  const schema = yup.object().shape({
    content: yup.string().required(),
  });
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const commentsRef = collection(db, "comments");

  const [comments, setComments] = useState<IComment[] | null>(null);

  const commentsDocs = query(commentsRef, where("postId", "==", postId));

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
    await addDoc(commentsRef, {
      userId: user?.uid,
      postId: postId,
      content: data.content,
      timestamp: Timestamp.fromDate(new Date()),
      username: user?.displayName,
    });
    reset({ content: "" });
    getComments();
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      <div>
        {comments &&
          comments
            ?.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
            .map((comment) => (
              <Comment comment={comment} getComments={getComments} />
            ))}
      </div>
      <form onSubmit={handleSubmit(submitComment)}>
        <input type="text" placeholder="Comment..." {...register("content")} />
        <input type="submit" value="&#10148;" />
      </form>
    </div>
  );
};
