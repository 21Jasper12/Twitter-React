import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "./../contexts/AuthContext";
import Header from "../components/layoutItems/Header";
import ReplyList from '../components/tweet/ReplyList/ReplyList';
import TweetEdit from '../components/tweet/TweetEdit/TweetEdit';
import SingleTweet from '../components/tweet/SingleTweet/SingleTweet';
import SingleTweetForReply from '../components/tweet/SingleTweetForReply/SingleTweetForReply';
import Modal from '../components/modal/Modal';
import { getTweet, getReplies, createReply, addLike, removeLike } from './../api/tweet';
import { getUserLikes } from '../api/user';
import { Toast } from '../utils/utils';



const ReplyListPage = () => {
  // 取得文章id後撈：1.單一文章資料, 2.repplyList的資料
  let { id } = useParams();
  console.log('id', id);
  const navigate = useNavigate();
  const [tweet, setTweet] = useState(null);
  const [replys, setReplys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  // 回覆
  const handleCreateReply = async (value) => {
    setModalOpen(false);
    try {
      const result = await createReply({
        tweetId: tweet.id,
        UserId: currentUser.id,
        comment: value,
      });
      console.log('result', result)
      setReplys((prevPeplies) => {
        return [{
          ...result,
          createdAt: "幾秒前",
          User: { ...currentUser }
        }, ...prevPeplies]
      })
      setTweet({
        ...tweet,
        replyCount: tweet.replyCount + 1
      })
    } catch (err) {
      console.error(err);
      Toast.fire({
        title: err.message,
        icon: 'error'
      })
    }
  }

  const handleOpenReply = () => {
    setModalOpen(true);
  }


  // 按讚
  const handleClickLike = async () => {
    // 新增Tweet這邊會在使用ChangeLikePOSTAPI
    try {
      setTweet({
        ...tweet,
        isLiked: !tweet.isLiked,
        likeCount: tweet.likeCount + (!!tweet.isLiked ? -1 : 1)
      });
      // 按讚
      if (!tweet.isLiked) {
        await addLike(tweet.id);
      }
      // 取消讚
      if (!!tweet.isLiked) {
        await removeLike(tweet.id);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || currentUser.role !== 'user') {
      navigate('/login')
      return
    }
  }, [currentUser, isAuthenticated])

  useEffect(() => {
    if (id) {
      const getTweetAsync = async () => {
        try {
          const dbTweet = await getTweet(id);
          console.log('dbTweet', dbTweet);
          setTweet({ ...dbTweet });
        } catch (err) {
          console.log(err)
        }
      }
      getTweetAsync();
    }
  }, [id]);


  useEffect(() => {
    if (id) {
      const getRepliesAsync = async () => {
        const replies = await getReplies(id);
        console.log('replies', replies);
        setReplys(replies);
      }
      getRepliesAsync();
    }
  }, []);

  return (
    <>
      <Header title="推文" type="tweet" url={'/home'} />
      {tweet && <SingleTweet
        tweet={tweet}
        onClickReply={handleOpenReply}
        onClickLike={handleClickLike}
      />}

      <ReplyList replys={replys} userAccount={tweet?.User?.account || ''} />

      <Modal isOpen={modalOpen} closeModal={handleCloseModal}>
        {modalOpen &&
          <>
            <SingleTweetForReply
              tweet={tweet}
            />
            <TweetEdit
              name='回覆'
              placeholder='推你的回覆'
              onClick={handleCreateReply}
            />
          </>
        }
      </Modal>
    </>
  )
}

export default ReplyListPage