import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import style from './SideBar.module.scss';
import Modal from '../modal/Modal';
import TweetEdit from './../tweet/TweetEdit/TweetEdit';
import './navActive.scss';
import { useAuth } from './../../contexts/AuthContext';
import { createTweet } from './../../api/tweet';




const SideBar = ({ type }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { logout, update } = useAuth();

  console.log('pathname', pathname, pathname === '/home')

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  // 新增推文
  const handleCreateTweet = async (value) => {

    console.log('tweet:', value);
    const result = await createTweet({
      UserId: currentUser.id,
      description: value,
    });



    if (result && pathname === '/home') {
      update()
      setModalOpen(false);
    } else {
      Swal.fire({
        position: 'top',
        title: '新增推文失敗，請再試一次！',
        timer: 2000,
        icon: 'error',
        showConfirmButton: false,
      });

    }

  }

  // 登出
  const handleLogout = () => {
    console.log('logout');
    logout();
    navigate('/login')
  }

  return (
    <div className={style.sidebar}>
      <div className={style.sidebarWrap}>
        <h1 className={style.logo}>alphitter</h1>
        <nav className={'nav' + ' ' + style.navbar}>
          <ul>
            <li>
              <NavLink className={style.navLink} to="/home"> 首頁</NavLink>
            </li>
            <li>
              <NavLink className={style.navLink} to="/userSelf/user">個人資料</NavLink>
            </li>
            <li>
              <NavLink className={style.navLink} to="/setting">設定</NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className={style.navLink + ' ' + style.logout}>登出</button>
            </li>
          </ul>
          <button
            className={style.btn}
            onClick={() => setModalOpen(!modalOpen)}>
            推文
          </button>
        </nav>
      </div>
      <Modal isOpen={modalOpen} closeModal={handleCloseModal}>
        {modalOpen &&
          <TweetEdit
            name='推文'
            placeholder='有什麼新鮮事?'
            onClick={handleCreateTweet}
          />}
      </Modal>
    </div>
  )
}

export default SideBar