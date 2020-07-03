import React, { useState } from 'react'
import { Link, Switch, Route } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import Sidebar from '../../components/Sidebar';
import PostListing from '../../components/PostListing';
import PostContents from '../../components/PostContents';

import logo from '../../assets/razzo-logo.png';

const Dashboard: React.FC = () => {

  const [menuState, setMenuState] = useState<boolean>(false);
  const [needsFetch, setNeedsFetch] = useState<boolean>(false);

  const setFetchNeeded = () => {
  }


  return (
    <div className="flex flex-col relative h-full">
      <div className="fixed w-full h-16 z-50 bg-white lg:hidden flex flex-row justify-between px-4">
        <Link to="/" className="my-auto"><img src={logo} alt="Razzo" /></Link>
        <div
          onClick={() => setMenuState(!menuState)}
          className="my-auto cursor-pointer no-select w-5 h-5"
        >
          {
            !menuState ? <FaBars className="block my-auto w-5 h-5 text-purple-dark-gray" /> :
            <FaTimes className="block my-auto w-5 h-5 text-purple-dark-gray" />
          }
        </div>
      </div>
      <div className="flex flex-row h-screen">
        <Sidebar openMenu={menuState} setMenuState={setMenuState} />
        <PostListing needsFetch={needsFetch} setNeedsFetch={setNeedsFetch}/>
        <Switch>
          <Route path="/posts/:post_id" render={(props) => <PostContents {...props} setNeedsFetch={setNeedsFetch} />} />
        </Switch>
      </div>
    </div>
  );
};

export default Dashboard;