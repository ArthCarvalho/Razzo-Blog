import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { FaRegImage, FaExclamationTriangle } from 'react-icons/fa';
import Loader from 'react-loader-spinner';
import api from '../../services/api';

interface Props {
  setNeedsFetch: (needsFetch: boolean) => void;
}

interface Params {
  post_id: number;
}

interface Data {
  date: string;
  author: string;
  title: string;
  image_url: string;
  body: string;
}

const PostContents: React.FC<Props> = ({setNeedsFetch}) => {
  const [data, setData] = useState<Data>({} as Data);
  const [status, setStatus] = useState<number>(0);
  const [newPostFlag, setNewPostFlag] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [openContents, setOpenContents] = useState<boolean>(false);

  const { post_id } = useParams();
  
  const { search } = useLocation();

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setOpenContents(true);
    setNewPostFlag(false);
    if(post_id === "new"){
      setData({
        date: '',
        author: 'Rudi Duarte',
        title: '',
        image_url: '',
        body: '',
      } as Data);
      setEditMode(true);
      setLoading(false);
      setNewPostFlag(true);
      setStatus(0);
      return;
    }
    setEditMode(false);

    const query = new URLSearchParams(search);
    const mode = query.get("mode");
    
    if(mode === 'edit'){
      setEditMode(true);
    }
    api.get(`posts/${post_id}`).then(response => {
      setData(response.data);
      setStatus(0);
      setLoading(false);
    }).catch(error => {
      setData({
        title: `${error.response.status} - ${error.response.data.title}`,
        body: error.response.data.message,
      } as Data);
      setStatus(error.response.status);
      setLoading(false);
      setEditMode(false);
    })
  }, [post_id,search]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const postData = {
      title: data.title,
      body: data.body,
      author: data.author,
      image_url: data.image_url,
    }
    if(postData.title === '' || postData.body === ''){
      alert(`O artigo precisa de ${
        (postData.title === '') ? 'um título' : ''}${
        (postData.title === '' && postData.body === '') ? ' e ' : ''}${
        (postData.body === '') ? 'um corpo': ''}.`);
    }
    let rstate = { data: post_id };
    if(!newPostFlag) {
      await api.put(`posts/${post_id}`, postData)
    } else {
      rstate = await api.post('posts', postData);
    }
    history.push(`/posts/${rstate.data}`);
    setNeedsFetch(true);
  }
  
  return loading ? (
    <div className={
      `${!openContents ? 'hidden' : ''} pt-24 lg:pt-0 flex flex-col w-full lg:w-5/12 p-0 justify-center items-center`
    }>
      <Loader type="TailSpin" color="#9954FF" height={120} width={120} />
    </div>
    ) : (
    <div
      className={`${!openContents ? 'hidden' : ''} pt-20 lg:pt-8 lg:flex flex-col w-full
      lg:w-5/12 p-4 lg:p-8 overflow-x-hidden overflow-y-scroll`}
    >
      <form onSubmit={handleSubmit}>
        <div>
          { editMode ?
            <input
              value={data.title}
              placeholder={newPostFlag ? 'Novo Artigo' : undefined}
              onChange={(event) => {
                setData({...data, title: event.target.value});
              }}
              className={
                `w-full font-semibold text-5xl focus:outline-none focus:bg-gray-100 leading-tight lg:leading-normal
                ${editMode ? 'bg-gray-200 rounded-lg px-2 text-purple-dark-gray' : 'text-custom-gray-dark'}`
              }
            >
            </input>
          : (
            <h1
              className={
                `font-semibold text-5xl focus:outline-none focus:bg-gray-100 leading-tight lg:leading-normal
                ${editMode ? 'bg-gray-200 rounded-lg px-2 text-purple-dark-gray' : 'text-custom-gray-dark'}`
              }
            >
              {data.title}
            </h1>
          )}
          { status === 0 ? (
            <div>
              { !editMode && (
                <div
                  className="flex flex-row justify-between text-sm font-semibold text-custom-gray-medium"
                >
                  <p>Publicado por: {data.author}</p>
                  <p>{data.date}</p>
                </div>
              )}
              <div
                className="flex content-center justify-center font-bold bg-purple-light-gray
                text-purple-dark-gray h-56 rounded-xlg my-6"
              >
                <FaRegImage size="5em" className="h-full" />
              </div>
            </div>
          ) : (
            <div
              className="flex content-center justify-center text-custom-gray-light my-8"
            >
              <FaExclamationTriangle size="8em" />
            </div>
          ) }
          { editMode ?
            <textarea
              value={data.body}
              onChange={(event) => {
                setData({...data, body: event.target.value});
              }}
              className={
                `w-full text-sm font-semibold leading-loose whitespace-pre-wrap focus:outline-none focus:bg-gray-100
                ${editMode ? 'bg-gray-200 p-2 rounded-lg text-purple-dark-gray' : 'text-custom-gray-medium'}`
              }
            >
            </textarea> :
          <p
          className={
            `text-sm font-semibold leading-loose whitespace-pre-wrap focus:outline-none focus:bg-gray-100
            ${editMode ? 'bg-gray-200 p-2 rounded-lg text-purple-dark-gray' : 'text-custom-gray-medium'}`
          }
          >
            {data.body}
          </p>
        }
      </div>
      { /* Edit Mode Buttons! */
        editMode && (
          <div className="flex flex-grow content-end justify-end mt-4">
              <div>
                <button
                  onClick={() => newPostFlag ? history.push('/') : setEditMode(false)}
                  className={
                    `rounded-full flex justify-center font-semibold py-2 px-8 bg-custom-purple
                    text-white font-normal text-xs focus:outline-none focus:bg-custom-purple-light
                    hover:bg-custom-purple-light transition ease-in-out duration-200`
                  }
                >
                  Cancelar
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  onSubmit={handleSubmit}
                  className={
                    `rounded-full flex justify-center font-semibold py-2 px-8 bg-custom-purple
                    text-white font-normal text-xs focus:outline-none focus:bg-custom-purple-light
                    hover:bg-custom-purple-light ml-2 transition ease-in-out duration-200`
                  }
                >
                  {newPostFlag ? 'Publicar' : 'Salvar'}
                </button>
              </div>
          </div>
        )
      }
      </form>
    </div>
  );
}

export default PostContents;