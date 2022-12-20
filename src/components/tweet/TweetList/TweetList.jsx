import { useState } from "react";
import style from "./TweetList.module.scss";
import { Link } from "react-router-dom";

const TweetList = ({ tweets, onClickReply, onClickLike }) => {
  console.log('tweets:', tweets)
  // [v] 點推文
  // [ ] 回覆
  // [ ] 按讚

  return (
    <div className="tweetList">
      {
        tweets.map(tweet =>
          <div className={style.tweet} key={tweet.id}>
            <div className={style.avatar}>
              <img src={tweet.User.avatar} alt="" />
            </div>
            <div className={style.info}>
              <div className={style.top}>
                <Link className={style.name} to={'/userSelf/' + tweet.User.id} > {tweet.User.name}</Link>
                <Link className={style.account} to={'/userSelf/' + tweet.User.id}>@{tweet.User.account}</Link>
                <div className={style.time}>{tweet.createdAt}</div>
              </div>
              <Link to={'/replylist/' + tweet.id} className={style.description}>
                {tweet.description}
              </Link>
              <div className={style.toolbar}>
                <button
                  onClick={() => onClickReply?.({ ...tweet })}
                  className={style.toolButton + ' ' + style.replyCount}
                >
                  {tweet.replyCount}
                </button>
                <button
                  onClick={() => onClickLike?.({ ...tweet })}
                  className={style.toolButton + ' ' + style.likeCount + ' ' + (!!tweet.isLiked ? style.active : '')}
                >
                  {tweet.likeCount}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default TweetList