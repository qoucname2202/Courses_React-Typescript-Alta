import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';
import { Courses, CoursesCreate, CoursesUpdated } from '../../state/action';
import { updatedCourse } from '../../state/action-creators';
import { State } from '../../state/reducer';
import './style.css';

interface ErrorMessage {
  title: string;
  author: string;
  image: string;
  price: string;
  rating: string;
  buyAmount: string;
}

const Updated = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useNavigate();
  const courses = useSelector((state: State) => state.courses);
  const errorRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { updatedCourse } = bindActionCreators(actionCreators, dispatch);
  // State image
  const [image, setImage] = useState('https://source.unsplash.com/random/');
  // State Course
  const [course, setCourse] = useState<CoursesCreate>({
    title: '',
    author: '',
    image: '',
    price: 0,
    rating: 0,
    buyAmount: 0,
    bestSeller: false,
  });
  // View first after render templated
  useEffect(() => {
    let index: number = courses.findIndex(item => item.id === id);
    if (index === -1) {
      history('/');
    } else {
      let temp: Courses = courses[index];
      setCourse({ ...temp });
    }
  }, []);

  // state validated:
  const [error, setError] = useState({
    title: '',
    author: '',
    image: '',
    price: '',
    rating: '',
    buyAmount: '',
  });
  // Function handelOnChange
  const handelOnChange = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (target.name === 'image') {
      setImage(target.value);
    }
    setCourse({ ...course, [target.name]: target.value });
    if (errorRef.current) {
      clearInterval(errorRef.current);
    }
    errorRef.current = setTimeout(() => {
      if (target.value.toString().length <= 0) {
        setError({ ...error, [target.name]: 'This is require field!' });
      } else {
        try {
          if (target.name === 'buyAmount' || target.name === 'price') {
            let number = parseInt(target.value);
            if (number < 0) {
              setError({
                ...error,
                [target.name]: 'Number must be lager than 5!',
              });
            } else {
              setError({ ...error, [target.name]: '' });
              setCourse({ ...course, [target.name]: parseInt(target.value) });
            }
          } else if (target.name === 'rating') {
            let number = parseInt(target.value);
            if (number < 1 || number > 5) {
              setError({
                ...error,
                [target.name]: 'Rating must be lager than 5!',
              });
            } else {
              setError({ ...error, [target.name]: '' });
              setCourse({ ...course, [target.name]: parseInt(target.value) });
            }
          } else {
            setError({ ...error, [target.name]: '' });
          }
        } catch (error) {}
      }
    }, 500);
  };

  // Handel checked
  const [checked, setChecked] = useState<boolean>(false);
  const handleChecked = (e: React.FormEvent<HTMLInputElement>): void => {
    let target = e.target as HTMLInputElement;
    setChecked(target.checked);
  };
  // handel submit
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (course.title === '') {
      setError({ ...error, title: 'This is require field!' });
      return;
    }
    if (
      Object.keys(error).every(
        (key: string) => error[key as keyof ErrorMessage] === '',
      )
    ) {
      let newCourse: CoursesUpdated = {
        id: id as string,
        ...course,
        image: image,
        bestSeller: checked,
      };
      updatedCourse(newCourse);
      history('/');
    }
  };
  const handelErrorImage = (e: any): void => {
    e.target.onerror = null;
    setImage(
      'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    );
  };

  return (
    <div>
      <h2 className='heading-course'>UPDATE COURSE</h2>
      <form className='form-post' onSubmit={handelSubmit}>
        <div className='text-field'>
          <label htmlFor='username3'>Heading</label>
          <input
            autoComplete='off'
            type='text'
            name='title'
            onChange={handelOnChange}
            value={course.title as string}
          />
          <p className='error'>{error?.title}</p>
        </div>
        <div className='text-field'>
          <label htmlFor='username3'>Author</label>
          <input
            autoComplete='off'
            type='text'
            name='author'
            onChange={handelOnChange}
            value={course.author as string}
          />
          <p className='error'>{error?.author}</p>
        </div>
        <div className='text-field'>
          <label htmlFor='username3'>Rating</label>
          <input
            autoComplete='off'
            type='text'
            name='rating'
            onChange={handelOnChange}
            value={course.rating as number}
          />
          <p className='error'>{error?.rating}</p>
        </div>
        <div className='text-field'>
          <label htmlFor='username3'>Amount</label>
          <input
            autoComplete='off'
            type='text'
            name='buyAmount'
            onChange={handelOnChange}
            value={course.buyAmount as number}
          />
          <p className='error'>{error?.buyAmount}</p>
        </div>
        <div className='text-field'>
          <label htmlFor='username3'>Price</label>
          <input
            autoComplete='off'
            type='text'
            name='price'
            onChange={handelOnChange}
            value={course.price as number}
          />
          <p className='error'>{error?.price}</p>
        </div>
        <div className='input-check'>
          <label htmlFor='best-seller' className='name-seller'>
            Best Seller:{' '}
          </label>
          <input type='checkbox' checked={checked} onChange={handleChecked} />
        </div>
        <div className='text-field'>
          <label htmlFor='username3'>Thumbnail</label>
          <input
            autoComplete='off'
            type='text'
            name='image'
            onChange={handelOnChange}
            value={course.image as string}
          />
          <div className='imgBox'>
            <img src={course.image} alt='images' onError={handelErrorImage} />
          </div>
          <p className='error'>{error?.image}</p>
        </div>
        <div className='inputSubmit'>
          <button type='submit' className='btnSubmit'>
            Update course
          </button>
        </div>
      </form>
    </div>
  );
};

export default Updated;
