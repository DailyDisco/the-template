/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
// import { Link, useParams } from 'react-router-dom';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { client, urlFor } from '../pages/client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = () => {
  // use router.query to get the id of the post
  const router = useRouter();
  const { pinId } = router.query;
  // const { pinId } = useParams();

  const auth = getAuth();
  const [user] = useAuthState(auth);
  // const User =
  //   localStorage.getItem('user') !== 'undefined'
  //     ? JSON.parse(localStorage.getItem('user'))
  //     : localStorage.clear();

  // pins are the posts that will be displayed
  const [pins, setPins] = useState();
  // pinDetail is the post that is being displayed on the page
  const [pinDetail, setPinDetail] = useState();
  // comment is the comment that the user is writing
  const [comment, setComment] = useState('');
  // addingComment is a boolean that will be used to show a spinner
  const [addingComment, setAddingComment] = useState(false);

  // this is the query that will be sent to sanity to get the post that is being displayed
  const fetchPinDetails = () => {
    console.log('fetching pin details');
    console.log('pinId we need to query', pinId);
    const query = pinDetailQuery('lykpIUqaXTD5Wb28QEQEPY');
    console.log('query', query);
    if (query) {
      client.fetch(`${query}`).then((data) => {
        console.log('post fetch data', data);
        console.log('post fetch data', data[0]);
        setPinDetail(data[0]);
        // console.log('pinDetail', pinDetail);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            console.log('more pins', res);
            setPins(res);
          });
        }
      });
    }
  };

  // this is the query that will be sent to sanity to get the posts that will be displayed
  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: 'postedBy', _ref: user.uid },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  if (!pinDetail) {
    return (
      <div>
        <Spinner />
        <p>Loading post details... </p>
      </div>
    );
  }

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto dark:bg-nft-dark bg-white"
          style={{ maxWidth: '1500px', borderRadius: '32px' }}
        >
          <div className="flex justify-center items-center mt-5 mb-5 font-poppins font-semibold text-2xl">
            Pin Details
          </div>
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* this is for linking to another source */}
              {/* <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination?.slice(8)}
              </a> */}
            </div>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            {/* <Link
              href={`/user-profile/${pinDetail?.postedBy._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg "
            >
              <img
                src={pinDetail?.postedBy.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link> */}
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                  key={item.comment}
                >
                  <img
                    src={item.postedBy?.uid}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              {/* <Link to={`/user-profile/${user._id}`}>
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link> */}
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Doing...' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
      {console.log('pins', pins)}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? <MasonryLayout pins={pins} /> : <p>Loading pin details</p>}
    </>
  );
};

export default PinDetail;
