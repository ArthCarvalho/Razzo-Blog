import React, { useState, useEffect, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FaFolder, FaSignOutAlt } from 'react-icons/fa';

import logo from '../../assets/razzo-logo.png';

interface Props {
  openMenu: boolean;
  setMenuState: (menuState: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ openMenu, setMenuState }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const placeholderFolderList = ['Meus Artigos', 'Compartilhados', 'Lixeira'];
  const placeholderCategoriesList = ['Sem categoria', 'Desenvolvimento Mobile', 'TI', 'Design', 'Desenvolvimento Web'];

  const history = useHistory();

  const renderMenuItem = (label: string) => (
    <li
      key={label}
      className="px-4 py-1 cursor-pointer hover:bg-gray-300 focus:bg-gray-300 transition ease-in-out duration-200 no-select rounded-full"
    >
      {label}
    </li>
  );

  useEffect(() => {
    setIsOpen(openMenu);
  },[openMenu]);

  return (
    <div>
      <div
        className={
        `pt-24 lg:pt-8 lg:px-4 px-2 pb-4 lg:pb-8 flex flex-col h-full bg-gray-200 lg:bg-white justify-between w-64 text-xs lg:translate-x-0
        text-custom-gray-dark absolute lg:relative z-40 shadow-lg lg:shadow-none transition ease-in-out duration-300
        ${isOpen ? 'translate-x-0' : 'transform -translate-x-full'}`
      }>
        <div>
          <div className="px-4 mb-8 hidden lg:block">
            <img src={logo} alt="Razzo" />
          </div>
          <div className="flex px-4">
            <span
              onClick={(event: MouseEvent) => {
                event.preventDefault();
                history.push('/');
                setMenuState(false);
              }}
              className={
              `rounded-full w-full flex justify-center font-semibold py-3 px-8 bg-custom-purple text-white font-normal
              cursor-pointer no-select hover:bg-custom-purple-light transition ease-in-out duration-200`
              }
            >
            <span><FaFolder size="1.6em" className="text-white mr-2" /></span>
              Meu diretório
            </span>
          </div>
          <div className="mt-8">
            <div className="px-4 text-xxs uppercase text-purple-dark-gray my-3">Arquivos</div>
            <ul className="font-bold">
              {placeholderFolderList.map(renderMenuItem)}
            </ul>
          </div>
          <div className="mt-8">
            <div className="px-4 text-xxs uppercase text-purple-dark-gray my-3">Categorias</div>
            <ul className="font-bold">
              {placeholderCategoriesList.map(renderMenuItem)}
            </ul>
          </div>
        </div>
        <div className="px-4 flex flex-row content-center justify-around">
          <div className="rounded-full h-8 w-8 bg-gray-200" />
          <div>
            <div className="font-bold">Rudi Duarte</div>
            <div className="text-xxxs uppercase text-purple-dark-gray">Usuário Premium</div>
          </div>
          <span className="h-8 w-8">
              <FaSignOutAlt size="1.6em" className="text-purple-dark-gray h-full" />
          </span>
        </div>
      </div>
      <div
        onClick={() => setMenuState(false)}
        className={`bg-menu-transparent w-screen h-screen z-30 ${
          isOpen ? 'fixed lg:hidden' : 'hidden'
        }`}>
      </div>
    </div>
  );
};

export default Sidebar;