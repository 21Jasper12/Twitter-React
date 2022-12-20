import TweetEdit from '../components/tweet/TweetEdit/TweetEdit';
import TweetList from '../components/tweet/TweetList/TweetList';
import SingleTweetForReply from '../components/tweet/SingleTweetForReply/SingleTweetForReply';
import Header from "../components/layoutItems/Header";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '../components/modal/Modal';
import { getTweets, createTweet } from '../api/tweet';
import { useAuth } from "./../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";



const HomePage = () => {
  console.log('HomePage')
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, update } = useAuth();
  const [tweet, setTweet] = useState(null)
  const [tweets, setTweets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);


  const handleCloseModal = () => {
    setModalOpen(false);
  }

  const handleCreateTweet = async (value) => {
    // 頁面資料處理
    try {
      const result = await createTweet({
        UserId: currentUser.id,
        description: value,
      });
      setTweets((prevTweets) => {
        return [{
          ...result,
          createdAt: "幾秒前",
          User: { ...currentUser }
        }, ...prevTweets]
      })
    } catch (err) {
      console.error(err);
    }
  }

  const handleCreateReply = (value) => {
    setModalOpen(false);
    console.log('reply:', value);
    // { tweetId, UserId, comment }
    

    // Swal.fire({
    //   position: 'top',
    //   title: '新增回覆成功！',
    //   timer: 1000,
    //   icon: 'success',
    //   showConfirmButton: false,
    // });
  }

  const handleOpenReply = (chosedTweet) => {
    setTweet({ ...chosedTweet });
    setModalOpen(true);
    // 打開Modale
    console.log('reply:', chosedTweet);

    // 新增Tweet這邊會在使用ReplyAPI
    setTweets(tweets.map(t => {
      if (t.id === chosedTweet.id) {
        return {
          ...chosedTweet,
          replyCount: chosedTweet.replyCount + 1
        }
      }
      return t;
    }));
  }

  const handleClickLike = (chosedTweet) => {
    console.log('tweet:', chosedTweet);
    const tweet = { ...chosedTweet }

    // 新增Tweet這邊會在使用ChangeLikePOSTAPI
    setTweets(tweets.map(t => {
      if (t.id === tweet.id) {
        return {
          ...tweet,
          isLiked: !tweet.isLiked,
          likeCount: tweet.likeCount + (!!tweet.isLiked ? -1 : 1)
        }
      }
      return t;
    }));
  }

  useEffect(() => {
    console.log('HomePage', 'useEffect')
    if (isAuthenticated) {
      const getTweetsAsync = async () => {
        try {
          const tweets = await getTweets();
          setTweets(tweets.map(todo => ({ ...todo, isEdit: false })));
        } catch (err) {
          console.log(err)
        }
      }
      getTweetsAsync();
    } else {
      navigate('/login')
    }
    console.log('isAuthenticated2', isAuthenticated)
    console.log('currentUser', currentUser)
  }, [currentUser, isAuthenticated, navigate, update]);


  return (
    <>
      <Header title="首頁" type="main" />
      <TweetEdit key={tweets.length}
        name='推文'
        placeholder='有什麼新鮮事？'
        onClick={handleCreateTweet}
      />
      <TweetList
        tweets={tweets}
        onClickReply={handleOpenReply}
        onClickLike={handleClickLike}
      />

      <Modal isOpen={modalOpen} closeModal={handleCloseModal}>
        {modalOpen &&
          <>
            <SingleTweetForReply
              id={tweet.id}
              User={tweet.User}
              time={tweet.time}
              description={tweet.description}
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

export default HomePage