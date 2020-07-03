import React, { useEffect, useState, MouseEvent } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { FaFilter, FaTimesCircle, FaClone, FaEdit, FaTrashAlt, FaCheckCircle, FaPlus } from 'react-icons/fa';
import api from '../../services/api';

interface Props {
  needsFetch: boolean;
  setNeedsFetch: (needsFetch: boolean) => void;
}

interface Post {
  post_id: number,
  author: string,
  title: string,
  date: string,
}

const order = ['descending','ascending'];

const PostListing: React.FC<Props> = ({needsFetch, setNeedsFetch}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectionCount, setSelectionCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [hideContents, setHideContents] = useState<boolean>();

  const history = useHistory();
  const location = useLocation();

  function handleSelection(id: number) {
    const alreadySelected = selected.findIndex(post => post === id);
    if(alreadySelected >= 0){
      const filteredItems = selected.filter(item => item !== id);
      setSelected(filteredItems);
      setSelectionCount(selectionCount-1);
    } else {
      setSelected([...selected, id]);
      setSelectionCount(selectionCount+1);
    }
  }

  function handleDelete() {
    selected.forEach(id => {
      api.delete(`posts/${id}`);
    });
    setNeedsFetch(true);
    setSelected([]);
    setSelectionCount(0);
  }

  function handleClone() {
    selected.forEach(id => {
      api.get(`posts/${id}`).then(response => {
        api.post(`posts`, {
          author: response.data.author,
          title: response.data.title,
          image_url: response.data.image_url,
          body: response.data.body,
        });
      })
    });
    setNeedsFetch(true);
  }

  function handleNewPost() {
    history.push('/posts/new');
  }

  function handleEdit() {
    console.log('push');
    history.push(`/posts/${selected[0]}?mode=edit`);
  }

  function handleSetSort(mode: number) {
    setSortOrder(mode);
  }

  useEffect(() => {
    setLoading(true);
    api.get(`posts?sort=${order[sortOrder]}`).then(response => {
      setPosts(response.data);
      setLoading(false);
      setNeedsFetch(false);
    });
  }, [needsFetch,sortOrder]);

  useEffect(() => {
    const path = location.pathname.split('/');
    console.log(path);
    if(path.length >= 3){
      if(path[2] !== '' && path[2] !== undefined){
        setHideContents(true);
      } else {
        setHideContents(false);
      }
    } else {
      setHideContents(false);
    }
  },[location]);

  return (
    <div
      className={`${hideContents ? 'hidden lg:flex' : 'flex'} flex-col mt-16 lg:mt-0 bg-purple-light-gray text-purple-dark-gray flex-grow font-bold text-xs relative overflow-hidden`}
    >
      <div className="px-8 border-solid border-b border-custom-gray-light mx-4 lg:mx-0">
        <h1 className="my-4 lg:my-8 text-custom-gray-dark font-bold text-lg">
          Meus artigos
        </h1>
        <div className="flex flex-row justify-between pb-4">
          <FaFilter size="1.75em" />
          <span
            onClick={() => handleSetSort(sortOrder ? 0 : 1)}
            className="flex-grow px-4 cursor-pointer"
          >
            {sortOrder ? 'Mais velhos primeiro' : 'Mais novos primeiro'}
          </span>
          <FaTimesCircle size="1.75em" />
        </div>
      </div>
      { selectionCount > 0 && (
        <div className="flex flex-row p-4 lg:p-8 mx-4 lg:mx-0">
          <div className="flex-grow">
            {selectionCount} {selectionCount > 1 ? 'artigos selecionados' : 'artigo selecionado'}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleClone()}
          >
            <FaClone size="2em" className="rounded p-1 hover:shadow hover:bg-white" />
          </div>
          <div
            className={selectionCount > 1 ? '' : 'cursor-pointer'}
            onClick={() => selectionCount > 1 ? null : handleEdit()}
          >
            <FaEdit size="2em" className={`rounded p-1 ${selectionCount > 1 ? 'text-gray-400' : 'hover:shadow hover:bg-white' }`} />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleDelete()}
          >
            <FaTrashAlt size="2em" className="rounded p-1 hover:shadow hover:bg-white" />
          </div>
        </div>
        )
      }
      <div className="overflow-y-auto">
        { loading ? (
          <div className="flex flex-grow justify-center items-center py-4">
            <Loader type="ThreeDots" color="#b0b1c6" height={70} width={70} />
          </div>
          ) : posts.length === 0 ? (
              <div className="flex p-4 lg:p-8 mx-4 lg:mx-0 border-solid border-b border-custom-gray-light
                font-semibold text-xxs transition ease-in-out duration-200 focus:bg-white no-select text-lg">
                <Link to="/posts/new">
                  Não existe nenhum artigo nesta pasta, clique aqui para criar um.
                </Link>
              </div>
          ) : posts.map(post => {
            const isSelected = selected.includes(post.post_id);
            return (
              <Link
                to={`/posts/${post.post_id}`}
                key={post.post_id}
                className={
                  `flex p-4 lg:p-8 mx-4 lg:mx-0 border-solid border-b border-custom-gray-light
                  font-semibold text-xxs transition ease-in-out duration-200 focus:bg-white no-select
                  ${isSelected ? 'bg-white rounded-xlg post-highlight' : 'hover:rounded-xlg hover:shadow-lg'}`
                }
              >
                <div className="pr-8">
                  <span
                    onClick={(event: MouseEvent) => {
                      event.preventDefault();
                      event.stopPropagation();
                      event.nativeEvent.stopImmediatePropagation();
                      handleSelection(post.post_id);
                    }}
                  >
                    <FaCheckCircle
                      size={isSelected ? '3em' : '1.75em'}
                      className={
                        `transition ease-in-out duration-200 h-full cursor-pointer ${isSelected && 'text-custom-purple'}`
                      }
                    />
                  </span>
                </div>
                <div className="text-custom-gray-medium flex-grow">
                  <h3>{post.author}</h3>
                  <h2 className="text-xs text-custom-gray-dark">{post.title}</h2>
                  <h3>{post.date}</h3>
                </div>
              </Link>
            );
        })}
        <div className="h-32"></div>
      </div>
        <span
          onClick={() => handleNewPost()}
          className="floating-button flex content-center justify-center hover:shadow-lg
            cursor-pointer hover:bg-custom-purple-light"
        >
            <FaPlus size="2em" className="text-white h-full" />
        </span>
    </div>
  );
}

export default PostListing;