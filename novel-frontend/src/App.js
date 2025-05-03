import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/home/Home';
import Menu from './components/menu/Menu';
import NovelDetail from './components/novelDetail/novelDetail';
import Authors from './components/authors/authors';
import Recommend from './components/Recommend/recommend';
import UserAccount from './components/Account/userAccount';
import AuthorAccounts from './components/Account/AuthorAccounts';
import AdminAccount from './components/Account/AdminAccount';
import AdminProfile from './components/Account/AdminProfile';
import History from './components/History/history';
import NovelView from './components/NovelView/novelView';
import UserStickyNote from './components/UserStickyNote';
import AuthorStickyNote from './components/AuthorStickyNote';
import CreateNovel from './components/createNovel/CreateNovel';
import ListNovels from './components/ListNovels/ListNovels';
import UpdateNovel from './components/UpdateNovel/updateNovel';
import Chapter from './components/Chapter/Chapter';
import BlindBook from './components/BlindBook/blindbook';
import Update from './components/update/update';
import Register from './components/register';
import Login from './components/Login';
import ClientRoute from './components/routes/ClientRoute';
import AuthorRoute from './components/routes/AuthorRoute';
import AdminRoute from './components/routes/AdminRoute';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';
import TopViewedNovels from './components/topViewedNovels/TopViewedNovels';
import RevenueTracking from './components/RevenueTracking/RevenueTracking';
import MessageAI from './components/messageAI/messageAI';
import UnlockedNovels from './components/UnlockedNovels/UnlockedNovels';

// Import thêm các component mới
import PlaylistByCategory from './components/playlistByCategory/playlistByCategory';
import PlaylistPage from './components/playlistPage/PlaylistPage';
import FavoriteNovel from './pages/FavoriteNovel';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <MessageAI />
        <Routes>

          {/* ---------------- CLIENT ROUTES ---------------- */}
          <Route path="/" element={<ClientRoute children={<Home />} />} />
          <Route path="/menu/:categoryID" element={<ClientRoute children={<Menu />} />} />
          <Route path="/novelDetail/:novelID" element={<ClientRoute children={<NovelDetail />} />} />
          <Route path="/novel/:novelID/read" element={<ClientRoute children={<NovelView />} />} />
          <Route path="/novelView/:novelID" element={<ClientRoute children={<NovelView />} />} />
          <Route path="/recommend" element={<ClientRoute children={<Recommend />} />} />
          <Route path="/authors" element={<ClientRoute children={<Authors />} />} />
          <Route path="/userAccount" element={<ClientRoute children={<UserAccount />} />} />
          <Route path="/history" element={<ClientRoute children={<History />} />} />
          <Route path="/UserStickyNote" element={<ClientRoute children={<UserStickyNote />} />} />
          <Route path="/blindbook" element={<ClientRoute children={<BlindBook />} />} /> 
          <Route path="/update" element={<ClientRoute children={<Update />} />} />
          <Route path="/register" element={<ClientRoute children={<Register />} />} />
          <Route path="/login" element={<ClientRoute children={<Login />} />} />
          <Route path="/topViewedNovels" element={<ClientRoute children={<TopViewedNovels />} />} />
          <Route path="/favorites" element={<ClientRoute children={<FavoriteNovel />} />} />
          <Route path="/unlockedNovels" element={<ClientRoute children={<UnlockedNovels />} />} />

          {/* Playlist routes */}
          <Route path="/playlist" element={<ClientRoute children={<PlaylistByCategory />} />} />
          <Route path="/playlist/:categoryID" element={<ClientRoute children={<PlaylistPage />} />} />

          {/* ---------------- AUTHOR ROUTES ---------------- */}
          <Route path="/header" element={<AuthorRoute children={<Header />} />} />
          <Route path="/authorAccounts" element={<ClientRoute children={<AuthorAccounts />} />} />
          <Route path="/createNovel" element={<ClientRoute children={<CreateNovel />} />} />
          <Route path="/listNovels" element={<ClientRoute children={<ListNovels />} />} />
          <Route path="/updateNovel" element={<ClientRoute children={<UpdateNovel />} />} />
          <Route path="/AuthorStickyNote" element={<ClientRoute children={<AuthorStickyNote />} />} />
          <Route path="/chapter" element={<ClientRoute children={<Chapter />} />} />
          <Route path="/revenueTracking" element={<ClientRoute children={<RevenueTracking />} />} />

          {/* ---------------- ADMIN ROUTES ---------------- */}
          <Route path="/adminAccount" element={<AdminRoute children={<AdminAccount />} />} />
          <Route path="/adminProfile" element={<AdminRoute children={<AdminProfile />} />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
