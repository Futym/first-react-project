import {
  collection,
  addDoc,
  query,
  where,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../configs/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Like {
  userId: string;
  likeId: string;
}

interface Props {
  postId: string;
}

export const Likes = (props: Props) => {
  const { postId } = props;
  const likesRef = collection(db, "likes");
  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState<Like[] | null>(null);

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: postId,
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
        where("postId", "==", postId),
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

  const likesDoc = query(likesRef, where("postId", "==", postId));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <div>
      <button onClick={hasUserLiked ? removeLike : addLike}>
        {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
      </button>
      {likes && <p>Likes: {likes?.length}</p>}
    </div>
  );
};
