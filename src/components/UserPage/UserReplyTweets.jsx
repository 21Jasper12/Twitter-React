
import style from './../tweet/TweetList/TweetList.module.scss';
import { Link } from 'react-router-dom';

const UserReplyTweets = ({ replys }) => {
  return (
    <div className="tweetList">
      {
        replys.map(tweet =>
          <div className={style.tweet} key={tweet.id}>
            <Link className={style.name} to={`/userSelf/${tweet.User.id}`}>
              <div className={style.avatar}>
                <img src={tweet.User.avatar} alt="" />
              </div>
            </Link>
            <div className={style.info}>
              <div className={style.top}>
                <Link className={style.name} to={'/userSelf/' + tweet.User.id}>
                  <div className={style.name}>{tweet.User.name}</div>
                </Link>
                <Link className={style.name} to={'/userSelf/' + tweet.User.id} >
                  <div className={style.account}>@{tweet.User.account}</div>
                </Link>
                <div className={style.time}>{tweet.createdAt}</div>
              </div>
              <div className={style.replyAccount}>回覆
                <span>@{tweet.Tweet.User.account ? tweet.Tweet.User.account : ''}</span>
              </div>
              <Link className={style.commend} to={'/replylist/' + tweet.TweetId}>
                {tweet.comment}
              </Link>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default UserReplyTweets;