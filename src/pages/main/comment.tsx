import { IComment } from "./post";
import { auth, db } from "../../configs/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { deleteDoc, doc } from "firebase/firestore";

interface Props {
  comment: IComment;
}

export const Comment = (props: Props) => {
  const { comment } = props;
  const [user] = useAuthState(auth);
  const userId = comment.userId;

  const removeComment = async () => {
    try {
      const likeToRemove = doc(db, "comments", comment.commentId);
      await deleteDoc(likeToRemove);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h3>{comment.username}</h3>
      <p>{comment.timestamp.toDate().toLocaleTimeString()}</p>
      <p>{comment.content}</p>
      {userId === user?.uid && <button onClick={removeComment}>&#128465;</button>}
    </div>
  );
};
