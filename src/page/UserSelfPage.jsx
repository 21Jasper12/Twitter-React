import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserSelfArea from "../components/UserPage/UserSelfArea"
import { useAuth } from "../contexts/AuthContext"
import { getUser } from "../api/user"
import { 
  getUserTweets, 
  getUserReplyTweets, 
  getUserLikeTweets, 
  createReply, 
  addLike, 
  removeLike 
} from './../api/tweet'
import { Toast } from "../utils/utils"
import { testAddFollowing, testRemoveFollowing } from './../api/followship'

// const userPro = {
//   id: 1,
//   background: 'https://image.cache.storm.mg/styles/smg-800x533-fp/s3/media/image/2020/11/07/20201107-092915_U13380_M651499_4ac4.jpg?itok=6KFZde7p',
//   avatar: 'https://storystudio.tw/storage/upload/article/2020/03/people-x-sobooks-baxuan-2.jpg',
//   introduction: 'My name is Allen.',
//   userName: 'Allen',
//   account: 'Joe456',
//   tweetCount: '1.8k',
//   likeCount: '50k',
//   folloingCount: 1000,
//   followerCount: 80,
//   isFollow: false,
// }

const UserSelfPage = () => {
  const [userInfo, setUserInfo] = useState([]) // userInfo
  const [userTweets, setUserTweets] = useState([]) // userOwnTweets
  const [userReplies, setUserReplies] = useState([]) // userReplyTweets
  const [userLikes, setUserLikes] = useState([]) // userLikeTweets
  const [userTabId, setUserTabId] = useState(1)
  const [isOpen, setIsOpen] = useState(false) //Modal show useState
  const [chooseTweet, setChooseTweet] = useState(null)
  const [replyModalIsOpen, setReplyModalIsOpen] = useState(false)
  const { currentUser, isAuthenticated, update } = useAuth()
  const navigate = useNavigate()
  // const userId = 1
  const { id } = useParams()


  async function handleAddFollow(id, currentUserId) {
    const response = await testAddFollowing(id, currentUserId)

    console.log('addfollow', response)

    if (response.status === "success"){
      setUserInfo((prevUser) => {
        return {
          ...prevUser,
          isFollowed: true
        }
      })

    }
    
    update()
  }

  async function handleCancelFollow(id) {
    const response = await testRemoveFollowing(id)

    console.log('cancelfollow', response)

    if(response.status === 'success'){
      setUserInfo((prevUser) => {
        return {
          ...prevUser,
          isFollowed: false
        }
      })

    }
    update()

  }

  // 按讚狀態狀態切換
  const handleClickLike = async (chosedTweet) => {
    console.log('tweet:', chosedTweet);
    const tweet = { ...chosedTweet }
    // 新增Tweet這邊會在使用ChangeLikePOSTAPI
    try {
      setUserTweets(userTweets.map(t => {
        if (t.id === tweet.id) {
          return {
            ...tweet,
            isLiked: !tweet.isLiked,
            likeCount: tweet.likeCount + (!!tweet.isLiked ? -1 : 1)
          }
        }
        return t;
      }));
      setUserLikes(userLikes.map(t => {
        if (t.TweetId === tweet.id) {
          return {
            ...t,
            Tweet: {
              ...t.Tweet,
              isLiked: !tweet.isLiked,
              likeCount: tweet.likeCount + (!!tweet.isLiked ? -1 : 1)
            }
          }
        }
        return t;
      }))

      if (currentUser.id === Number(id)){
        console.log('params', id)
        console.log('currentUserId', currentUser.id)
        setUserLikes((prevLikes) => {
          return prevLikes.filter((like) => like.Tweet.isLiked !== false)
        })
          
      }
      // 按讚
      if (!tweet.isLiked) {
        await addLike(tweet.id);
      }
      // 取消讚
      if (!!tweet.isLiked) {
        await removeLike(tweet.id);
      }

      update()

    } catch (error) {
      console.log(error)
    }
  }

  // 開啟回覆Modal
  const handleOpenReply = (chosedTweet) => {
    console.log('chosedTweet', chosedTweet);
    setChooseTweet({ ...chosedTweet });
    setReplyModalIsOpen(true);
  }

  // 關閉回覆Modal
  const handleCloseModal = () => {
    console.log('close')
    setReplyModalIsOpen(false);
  }

  // 新增回覆
  const handleCreateReply = async (value) => {
    setReplyModalIsOpen(false);
    try {
      const result = await createReply({
        tweetId: chooseTweet.id,
        UserId: currentUser.id,
        comment: value,
      });

      Toast.fire({
        title: '發送回覆成功！',
        icon: 'success'
      })

      setUserTweets(userTweets.map(t => {
        if (t.id === chooseTweet.id) {
          return {
            ...chooseTweet,
            replyCount: chooseTweet.replyCount + 1
          }
        }
        return t;
      }));

      setUserLikes(userLikes.map(t => {
        if (t.TweetId === chooseTweet.id) {
          return {
            ...t,
            Tweet: {
              ...t.Tweet,
              replyCount: chooseTweet.replyCount + 1
            }
          }
        }
        return t;
      }));


      update()
    } catch (err) {
      console.error(err);
    }
  }






  function handleChangeTab(value) {
    setUserTabId(value)
  }

  // 開啟UserModal編輯功能
  function changeModalStatus(value) {
    setIsOpen(value)
    update()
  }

  useEffect(() => {
    async function getUserInfoAsync() {
      const { data } = await getUser(Number(id))

      setUserInfo(data)
    }

    getUserInfoAsync()
  },[id])

  useEffect(() => {
    async function getUserAsync() {
      // const { data } = await getUser(Number(id))
      // const userOwnTweets = await getUserTweets(Number(id))
      // const userReplyTweets = await getUserReplyTweets(Number(id))
      // const userLikeTweets = await getUserLikeTweets(Number(id))

      const [userOwnTweets, userReplyTweets, userLikeTweets] = await Promise.all([
        // getUser(Number(id)),
        getUserTweets(Number(id)),
        // getUserReplyTweets(Number(id)),
        // getUserLikeTweets(Number(id))
      ])

      // console.log('UserData', data)
      console.log('UserTweets', userOwnTweets)
      console.log('UserReplies', userReplyTweets)
      console.log('UserLikes', userLikeTweets)

      // setUserInfo(userInfo.data)
      setUserTweets(userOwnTweets ?
        userOwnTweets.map((tweet) => {
          return{
            ...tweet,
            User: userInfo
          }
        }) : ''
      )
      setUserReplies(userReplyTweets ? userReplyTweets : '')
      setUserLikes(userLikeTweets ? userLikeTweets : '')
    }

    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    else {
      getUserAsync()
      
    }
  }, [isAuthenticated, navigate, id, update, userInfo])

  return (
    <UserSelfArea
      tweets={userTweets}
      replies={userReplies}
      likes={userLikes}
      isOpen={isOpen} 
      user={userInfo}
      userId={currentUser?.id}
      tabId={userTabId}
      paramsId={Number(id)}
      replyModalStatus={replyModalIsOpen}
      chooseTweet={chooseTweet}
      onAddFollow={handleAddFollow}
      onCancelFollow={handleCancelFollow}
      onChangeTab={handleChangeTab}
      onShowModal={changeModalStatus}
      onClickReply={handleOpenReply}
      onClickLike={handleClickLike}
      onClickCreateReply={handleCreateReply}
      onClickCloseReplyModal={handleCloseModal}
    />
  )
}

export default UserSelfPage